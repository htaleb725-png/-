import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Interview, InterviewStatus } from '../types';
import { 
  Handshake, 
  Plus, 
  Search, 
  CheckCircle, 
  Send, 
  Edit
} from 'lucide-react';

export const InterviewsModule: React.FC = () => {
  const { 
    interviews, 
    addInterview, 
    updateInterview, 
    convertInterviewToRequest, 
    citizens
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [citizenId, setCitizenId] = useState('');
  const [fullName, setFullName] = useState('');
  const [subject, setSubject] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [address, setAddress] = useState('');
  const [referrer, setReferrer] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('10:30 صباحاً');
  const [priority, setPriority] = useState<'عادي' | 'عاجل' | 'خاص جداً'>('عادي');
  const [status, setStatus] = useState<InterviewStatus>('مجدولة');
  const [deputyNotes, setDeputyNotes] = useState('إحالة للإدارة');
  const [outcome, setOutcome] = useState('');

  const filteredInterviews = interviews.filter(intv => {
    const matchesSearch = 
      intv.FullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intv.Interview_ID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intv.Subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intv.Address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || intv.Status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || intv.Priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCitizenSelect = (selectedId: string) => {
    setCitizenId(selectedId);
    const citizen = citizens.find(c => c.Citizen_ID === selectedId);
    if (citizen) {
      setFullName(citizen.FullName);
      setPhone1(citizen.Phone1);
      setPhone2(citizen.Phone2 || '');
      setAddress(`${citizen.District} - ${citizen.SubDistrict}`);
      setReferrer(citizen.ReferralSource || '');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingInterview) {
      updateInterview({
        ...editingInterview,
        Subject: subject,
        InterviewDate: interviewDate,
        InterviewTime: interviewTime,
        Priority: priority,
        Status: status,
        DeputyNotes: deputyNotes,
        Outcome: outcome
      });
      setEditingInterview(null);
      setSuccessMessage('تم تحديث بيانات المقابلة وتوجيهات النائب بنجاح.');
    } else {
      if (!fullName.trim() || !subject.trim() || !interviewDate) {
        alert('يرجى ملء جميع الحقول المطلوبة للمقابلة.');
        return;
      }

      addInterview({
        Citizen_ID: citizenId || `ONA-${Math.floor(10000 + Math.random() * 90000)}`,
        FullName: fullName.trim(),
        Subject: subject.trim(),
        Phone1: phone1.trim(),
        Phone2: phone2.trim() || undefined,
        Address: address.trim(),
        Referrer: referrer.trim() || undefined,
        InterviewDate: interviewDate,
        InterviewTime: interviewTime,
        Priority: priority,
        Status: status,
        DeputyNotes: deputyNotes || undefined,
        Outcome: outcome || undefined,
        ConvertedToRequest: false
      });

      setShowAddModal(false);
      setSuccessMessage('تمت جدولة موعد المقابلة مع النائب بنجاح.');
    }

    // Reset
    setCitizenId('');
    setFullName('');
    setSubject('');
    setPhone1('');
    setPhone2('');
    setAddress('');
    setReferrer('');
    setInterviewDate('');
    setOutcome('');
  };

  const openEdit = (intv: Interview) => {
    setEditingInterview(intv);
    setCitizenId(intv.Citizen_ID);
    setFullName(intv.FullName);
    setSubject(intv.Subject);
    setPhone1(intv.Phone1);
    setPhone2(intv.Phone2 || '');
    setAddress(intv.Address);
    setReferrer(intv.Referrer || '');
    setInterviewDate(intv.InterviewDate);
    setInterviewTime(intv.InterviewTime || '10:30 صباحاً');
    setPriority(intv.Priority);
    setStatus(intv.Status);
    setDeputyNotes(intv.DeputyNotes || 'إحالة للإدارة');
    setOutcome(intv.Outcome || '');
  };

  const handleConvert = (intv: Interview) => {
    const res = convertInterviewToRequest(intv.Interview_ID, 'ديوان محافظة ذي قار');
    if (res) {
      setSuccessMessage(`تم بنجاح تحويل المقابلة (${intv.Interview_ID}) إلى طلب إداري برقم (${res.Request_ID}) وترحيله لقسم الإدارة.`);
    }
  };

  return (
    <div className="space-y-4 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Handshake className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">قسم مقابلات النائب (المستقل)</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              إدارة اللقاءات المباشرة
            </span>
          </div>
          <p className="text-xs text-slate-500">
            جدولة وتنظيم المقابلات البرلمانية المباشرة للنائب، وتأشير الهوامش والتوجيهات والتحويل الفوري إلى طلبات إدارية.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingInterview(null);
            setShowAddModal(true);
          }}
          className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ جدولة مقابلة جديدة</span>
        </button>
      </div>

      {/* Success banner */}
      {successMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث باسم الشخص، موضوع المقابلة..."
              className="w-full pr-8 pl-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs text-right focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-right focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="all">-- تصفية حسب نتيجة وموقف المقابلة (الكل) --</option>
              <option value="مجدولة">مجدولة (بانتظار الموعد)</option>
              <option value="تمت المقابلة">تمت المقابلة</option>
              <option value="تمت الإحالة">تمت الإحالة للإدارة</option>
              <option value="مؤجلة">مؤجلة</option>
              <option value="ملغاة">ملغاة</option>
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-right focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="all">-- تصفية حسب درجة الأهمية (الكل) --</option>
              <option value="عادي">عادي</option>
              <option value="عاجل">عاجل</option>
              <option value="خاص جداً">خاص جداً</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interviews Table */}
      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-bold text-slate-800">
            جدول مقابلات النائب ({filteredInterviews.length})
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            يمكنك تحويل أي مقابلة منجزة إلى طلب إداري بنقرة زر واحدة
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
              <tr>
                <th className="p-3">رقم المقابلة</th>
                <th className="p-3">اسم الشخص / المواطن</th>
                <th className="p-3">موضوع المقابلة</th>
                <th className="p-3">موعد المقابلة</th>
                <th className="p-3">الأهمية</th>
                <th className="p-3">توجيه وقرار النائب</th>
                <th className="p-3">الموقف</th>
                <th className="p-3 text-center">الإجراءات والتحويل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInterviews.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    لا توجد مقابلات مسجلة تطابق خيارات البحث.
                  </td>
                </tr>
              ) : (
                filteredInterviews.map((intv) => (
                  <tr key={intv.Interview_ID} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-amber-700 text-[11px]">{intv.Interview_ID}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{intv.FullName}</div>
                      <div className="text-[10px] text-slate-500">{intv.Address}</div>
                      <div className="text-[10px] text-slate-500 font-mono" dir="ltr">{intv.Phone1}</div>
                    </td>
                    <td className="p-3 max-w-xs text-slate-700">{intv.Subject}</td>
                    <td className="p-3 font-mono">
                      <div className="text-slate-900 font-bold">{intv.InterviewDate}</div>
                      <div className="text-[10px] text-amber-700 font-bold">{intv.InterviewTime}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        intv.Priority === 'خاص جداً'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : intv.Priority === 'عاجل'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {intv.Priority}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-amber-800">
                      {intv.DeputyNotes || 'بانتظار المقابلة'}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        intv.Status === 'تمت المقابلة' || intv.Status === 'تمت الإحالة'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : intv.Status === 'مؤجلة'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {intv.Status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1.5">
                        {!intv.ConvertedToRequest ? (
                          <button
                            onClick={() => handleConvert(intv)}
                            className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors cursor-pointer flex items-center gap-1"
                            title="تحويل نتيجة المقابلة إلى طلب إداري في قسم الإدارة"
                          >
                            <Send className="w-3 h-3" />
                            <span>تحويل لطلب إداري</span>
                          </button>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>تم التحويل</span>
                          </span>
                        )}

                        <button
                          onClick={() => openEdit(intv)}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
                          title="تعديل المقابلة والقرار"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Interview Modal */}
      {(showAddModal || editingInterview) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white text-slate-800 rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <Handshake className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingInterview ? `تعديل مقابلة النائب (${editingInterview.Interview_ID})` : 'جدولة وتوثيق مقابلة برلمانية جديدة'}
                  </h3>
                  <p className="text-xs text-slate-500">تسجيل بيانات الشخص، موضوع المقابلة، وتوجيهات النائب المباشرة</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingInterview(null);
                }}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-right">
              {/* Select or search existing citizen */}
              {!editingInterview && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ربط بمواطن مسجل (اختياري)</label>
                  <select
                    value={citizenId}
                    onChange={(e) => handleCitizenSelect(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="">-- أو ادخل بيانات شخص جديد بالأسفل --</option>
                    {citizens.map((c) => (
                      <option key={c.Citizen_ID} value={c.Citizen_ID}>
                        {c.FullName} ({c.Citizen_ID}) - {c.District}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">اسم الشخص الكامل *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="الاسم الثلاثي أو الرباعي"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف الأول</label>
                  <input
                    type="tel"
                    value={phone1}
                    onChange={(e) => setPhone1(e.target.value)}
                    placeholder="078XXXXXXXX"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-left font-mono focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">السكن / القضاء</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="الناصرية - حي سومر"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">موضوع وقضية المقابلة *</label>
                <textarea
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  rows={2}
                  placeholder="شرح موجز لطلب أو شكوى المواطن المعروضة أمام النائب..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              {/* Date, Time, Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تاريخ المقابلة *</label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الوقت المحدد</label>
                  <input
                    type="text"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    placeholder="11:00 صباحاً"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">درجة الأهمية</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none font-bold text-amber-700"
                  >
                    <option value="عادي">عادي</option>
                    <option value="عاجل">عاجل</option>
                    <option value="خاص جداً">خاص جداً</option>
                  </select>
                </div>
              </div>

              {/* Deputy Decision & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-amber-800 mb-1">توجيه النائب وقرار المقابلة</label>
                  <select
                    value={deputyNotes}
                    onChange={(e) => setDeputyNotes(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-amber-50/50 border border-amber-300 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none font-bold"
                  >
                    <option value="إحالة للإدارة">إحالة للإدارة ومفاتحة الدائرة المعنية</option>
                    <option value="هامش مباشر">هامش مباشر وتأييد</option>
                    <option value="متابعة شخصية">متابعة شخصية من قبل النائب</option>
                    <option value="توجيه للمكنة">توجيه للمكنة للطباعة والتوثيق</option>
                    <option value="غير مستوفي للشروط">غير مستوفي للشروط والتعليمات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">موقف المقابلة</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as InterviewStatus)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="مجدولة">مجدولة</option>
                    <option value="تمت المقابلة">تمت المقابلة</option>
                    <option value="تمت الإحالة">تمت الإحالة</option>
                    <option value="مؤجلة">مؤجلة</option>
                    <option value="ملغاة">ملغاة</option>
                  </select>
                </div>
              </div>

              {/* Submit buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingInterview(null);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  {editingInterview ? 'حفظ التعديلات' : 'حفظ موعد المقابلة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
