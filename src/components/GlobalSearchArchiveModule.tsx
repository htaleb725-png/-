import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Citizen } from '../types';
import { 
  Search, 
  Printer, 
  Clock, 
  ShieldAlert, 
  FolderKanban, 
  Handshake, 
  Award, 
  Paperclip, 
  ExternalLink, 
  Upload
} from 'lucide-react';

export const GlobalSearchArchiveModule: React.FC = () => {
  const { 
    citizens, 
    requests, 
    interviews, 
    documents, 
    addDocument,
    setPrintableCitizenCard, 
    setPrintableBadgeCitizen,
    setSelectedCitizenForHistory,
    canPrintOfficialCard, 
    currentUser
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(citizens[0] || null);

  // New Document Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<'مستمسكات ثبوتية' | 'طلب مقدم' | 'كتاب رسمي صادر' | 'أخرى'>('مستمسكات ثبوتية');
  const [docFileUrl, setDocFileUrl] = useState('');

  const filteredCitizens = (citizens || []).filter(c => {
    if (!c) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (c.FullName && c.FullName.toLowerCase().includes(q)) ||
      (c.Citizen_ID && c.Citizen_ID.toLowerCase().includes(q)) ||
      (c.Phone1 && c.Phone1.includes(q)) ||
      (c.Phone2 && c.Phone2.includes(q)) ||
      (c.Surname && c.Surname.toLowerCase().includes(q)) ||
      (c.District && c.District.toLowerCase().includes(q)) ||
      (c.Job && c.Job.toLowerCase().includes(q))
    );
  });

  const citizenRequests = selectedCitizen 
    ? requests.filter(r => r.Citizen_ID === selectedCitizen.Citizen_ID) 
    : [];

  const citizenInterviews = selectedCitizen 
    ? interviews.filter(i => i.Citizen_ID === selectedCitizen.Citizen_ID) 
    : [];

  const citizenDocs = selectedCitizen 
    ? documents.filter(d => d.Citizen_ID === selectedCitizen.Citizen_ID) 
    : [];

  const handlePrintCard = (citizen: Citizen) => {
    if (!canPrintOfficialCard(currentUser)) {
      alert('عذراً! ميزة طباعة بطاقة المعلومات الرسمية مقتصرة حصرياً على: [المطور، المدير، موظف الإدارة] وفق محددات الأمان الإداري.');
      return;
    }
    setPrintableCitizenCard(citizen);
  };

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCitizen || !docTitle.trim()) return;

    addDocument({
      Citizen_ID: selectedCitizen.Citizen_ID,
      CitizenName: selectedCitizen.FullName,
      Title: docTitle.trim(),
      Category: docCategory,
      FileUrl: docFileUrl || 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=80',
      FileType: 'pdf',
      FileSize: '2.1 MB',
      UploadedBy: currentUser?.FullName || 'موظف الأرشيف'
    });

    setShowUploadModal(false);
    setDocTitle('');
    setDocFileUrl('');
  };

  return (
    <div className="space-y-4 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-900">قسم الأرشيف والبحث الشامل وطباعة البطاقات</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              الملف المتكامل
            </span>
          </div>
          <p className="text-xs text-slate-500">
            البحث في كافة بيانات المنظومة، استعراض السجل التراكمي للمراجع، وإصدار بطاقات المعلومات الرسمية المقيدة أمنياً.
          </p>
        </div>
      </div>

      {/* Main Search Input */}
      <div className="relative">
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث بالاسم الرباعي، الرقم التعريفي (ONA-XXXX)، رقم الهاتف، القضاء، اللقب، أو المهنة..."
          className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-right shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700 px-2 py-0.5 bg-slate-100 rounded"
          >
            مسح البحث
          </button>
        )}
      </div>

      {/* 2-Column Split: Citizens List + Citizen Full Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Search Results List (4 Cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700">نتائج البحث ({filteredCitizens.length})</span>
            <span className="text-[10px] text-slate-500">اختر مراجع لعرض أرشيفه</span>
          </div>

          <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredCitizens.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs shadow-xs">
                لا يوجد مراجع يطابق معايير البحث الحالية.
              </div>
            ) : (
              filteredCitizens.map((c) => {
                const isSelected = selectedCitizen?.Citizen_ID === c.Citizen_ID;

                return (
                  <div
                    key={c.Citizen_ID}
                    onClick={() => setSelectedCitizen(c)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-right shadow-xs ${
                      isSelected
                        ? 'bg-purple-50 border-purple-400 ring-1 ring-purple-400'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-blue-700">{c.Citizen_ID}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                        {c.District}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900">{c.FullName}</h4>
                    
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
                      <span dir="ltr">{c.Phone1}</span>
                      <span className="text-purple-700 font-sans font-semibold">{c.Job}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Citizen Full Profile & Archives (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedCitizen ? (
            <div className="space-y-4">
              {/* Profile Card & Action Bar */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{selectedCitizen.FullName}</h3>
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {selectedCitizen.Citizen_ID}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      السكن: {selectedCitizen.District} - {selectedCitizen.SubDistrict} | تاريخ التسجيل: {selectedCitizen.CreatedAt}
                    </p>
                  </div>

                  {/* Print & Action Buttons with RBAC guard */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* STRICT RBAC: Printable Official Info Card */}
                    {canPrintOfficialCard(currentUser) ? (
                      <button
                        onClick={() => handlePrintCard(selectedCitizen)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                        title="طباعة بطاقة المعلومات الرسمية مع الباركود"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>طباعة بطاقة المعلومات الرسمية</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold">
                        <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                        <span>طباعة البطاقة مقيدة للمدير والإدارة</span>
                      </div>
                    )}

                    <button
                      onClick={() => setPrintableBadgeCitizen(selectedCitizen)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>باج مراجعة</span>
                    </button>

                    <button
                      onClick={() => setSelectedCitizenForHistory(selectedCitizen)}
                      className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>السجل الزمني</span>
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px] mb-0.5">الهاتف الأساسي</span>
                    <strong className="text-slate-900 font-mono text-xs" dir="ltr">{selectedCitizen.Phone1}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px] mb-0.5">المهنة</span>
                    <strong className="text-slate-900 text-xs">{selectedCitizen.Job}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px] mb-0.5">التحصيل الدراسي</span>
                    <strong className="text-slate-900 text-xs">{selectedCitizen.Education}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px] mb-0.5">المعرّف / المصرّح</span>
                    <strong className="text-blue-700 text-xs">{selectedCitizen.ReferralSource || 'مباشر'}</strong>
                  </div>
                </div>
              </div>

              {/* Citizen's Requests Archive */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <FolderKanban className="w-4 h-4 text-blue-600" />
                    <span>المعاملات والطلبات الإدارية المسجلة ({citizenRequests.length})</span>
                  </h4>
                </div>

                <div className="space-y-2">
                  {citizenRequests.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-3">لا توجد طلبات إدارية مسجلة لهذا المراجع.</p>
                  ) : (
                    citizenRequests.map((req) => (
                      <div key={req.Request_ID} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-blue-700">{req.Request_ID}</span>
                            <span className="font-bold text-slate-900">الجهة: {req.Entity}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            req.ProcessingStatus === 'منجز' ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {req.ProcessingStatus}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{req.Details}</p>
                        {req.DeputyNotes && (
                          <div className="text-[11px] text-amber-700 font-semibold">
                            توجيه النائب: {req.DeputyNotes}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Citizen's Interviews */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Handshake className="w-4 h-4 text-amber-600" />
                  <span>المقابلات المباشرة مع النائب ({citizenInterviews.length})</span>
                </h4>

                <div className="space-y-2">
                  {citizenInterviews.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-3">لا توجد مقابلات مسجلة لهذا المراجع.</p>
                  ) : (
                    citizenInterviews.map((intv) => (
                      <div key={intv.Interview_ID} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">{intv.Subject}</span>
                          <span className="font-mono text-slate-400">{intv.InterviewDate}</span>
                        </div>
                        <div className="text-xs text-amber-700">
                          توجيه وقرار النائب: {intv.DeputyNotes || 'لا توجد ملاحظات'}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Archived Cloud Documents */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-purple-600" />
                    <span>المستندات والوثائق المؤرشفة سحابياً ({citizenDocs.length})</span>
                  </h4>

                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold cursor-pointer flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>أرشفة مستند جديد</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {citizenDocs.length === 0 ? (
                    <div className="col-span-2 p-4 text-center text-slate-500 text-xs">
                      لا توجد وثائق مرفقة لهذا المراجع حالياً.
                    </div>
                  ) : (
                    citizenDocs.map((doc) => (
                      <div key={doc.Doc_ID} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs">
                        <div className="space-y-0.5 text-right">
                          <div className="font-bold text-slate-900">{doc.Title}</div>
                          <div className="text-[10px] text-slate-500">{doc.Category} • {doc.FileSize}</div>
                        </div>

                        <a
                          href={doc.FileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
                          title="معاينة المستند"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs shadow-xs">
              يرجى اختيار مراجع من القائمة لعرض ملفه وأرشيفه المتكامل.
            </div>
          )}
        </div>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && selectedCitizen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white text-slate-800 rounded-2xl border border-slate-200 shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">أرشفة مستند سحابي للمواطن</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleUploadDoc} className="space-y-3 text-right">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان المستند أو الكتاب *</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="مثال: البطاقة الموحدة، كتاب وزارة الإعمار..."
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-right outline-none focus:bg-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نوع المستند</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-right outline-none focus:bg-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="مستمسكات ثبوتية">مستمسكات ثبوتية</option>
                  <option value="طلب مقدم">طلب مقدم</option>
                  <option value="كتاب رسمي صادر">كتاب رسمي صادر</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رابط أو ملف Drive (اختياري)</label>
                <input
                  type="text"
                  value={docFileUrl}
                  onChange={(e) => setDocFileUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-left font-mono outline-none focus:bg-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowUploadModal(false)} className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">إلغاء</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs">حفظ بالأرشيف</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
