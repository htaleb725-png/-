import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OfficeRequest, ProcessingStatus, RequestStatus, Priority } from '../types';
import { 
  FolderKanban, 
  Search, 
  Plus, 
  Paperclip, 
  Clock,
  Printer
} from 'lucide-react';

export const AdminModule: React.FC = () => {
  const { 
    requests, 
    addRequest, 
    updateRequest, 
    citizens, 
    getDropdownOptions, 
    addDocument,
    currentUser,
    setSelectedCitizenForHistory,
    setActiveSection
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntityFilter, setSelectedEntityFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState('all');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState<OfficeRequest | null>(null);

  // Form states
  const [selectedCitizenId, setSelectedCitizenId] = useState('');
  const [entity, setEntity] = useState('وزارة العمل والشؤون الاجتماعية (شبكة الحماية)');
  const [customEntity, setCustomEntity] = useState('');
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('مستلم');
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>('قيد التدقيق');
  const [priority, setPriority] = useState<Priority>('عام');
  const [details, setDetails] = useState('');
  const [attachmentReq, setAttachmentReq] = useState('');
  const [attachmentResp, setAttachmentResp] = useState('');
  const [deputyNotes, setDeputyNotes] = useState('');

  const entitiesList = getDropdownOptions('Entity');

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.Request_ID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.CitizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.Details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.Entity.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEntity = selectedEntityFilter === 'all' || req.Entity === selectedEntityFilter;
    const matchesStatus = selectedStatusFilter === 'all' || req.ProcessingStatus === selectedStatusFilter;
    const matchesPriority = selectedPriorityFilter === 'all' || req.Priority === selectedPriorityFilter;

    return matchesSearch && matchesEntity && matchesStatus && matchesPriority;
  });

  const handleSaveRequest = (e: React.FormEvent) => {
    e.preventDefault();

    const finalEntity = entity === 'أخرى' && customEntity ? customEntity.trim() : entity;

    if (editingRequest) {
      updateRequest({
        ...editingRequest,
        Entity: finalEntity,
        RequestStatus: requestStatus,
        ProcessingStatus: processingStatus,
        Priority: priority,
        Details: details,
        AttachmentRequest: attachmentReq || editingRequest.AttachmentRequest,
        AttachmentResponse: attachmentResp || editingRequest.AttachmentResponse,
        DeputyNotes: deputyNotes
      });
      setEditingRequest(null);
    } else {
      const citizen = citizens.find(c => c.Citizen_ID === selectedCitizenId);
      if (!citizen) {
        alert('يرجى اختيار مراجع مسجل بالنظام أولاً.');
        return;
      }

      addRequest({
        Citizen_ID: citizen.Citizen_ID,
        CitizenName: citizen.FullName,
        CitizenPhone: citizen.Phone1,
        Entity: finalEntity,
        RequestStatus: requestStatus,
        ProcessingStatus: processingStatus,
        Priority: priority,
        Details: details,
        AttachmentRequest: attachmentReq || undefined,
        AttachmentResponse: attachmentResp || undefined,
        DeputyNotes: deputyNotes || undefined,
        CreatedBy: currentUser ? currentUser.FullName : 'قسم الإدارة'
      });

      // If document attached, archive automatically
      if (attachmentReq) {
        addDocument({
          Citizen_ID: citizen.Citizen_ID,
          CitizenName: citizen.FullName,
          Title: `مرفق طلب: ${details.slice(0, 30)}`,
          Category: 'طلب مقدم',
          FileUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=80',
          FileType: 'pdf',
          FileSize: '1.5 MB',
          UploadedBy: currentUser?.FullName || 'موظف الإدارة'
        });
      }

      setShowAddModal(false);
    }

    // Reset
    setDetails('');
    setCustomEntity('');
    setAttachmentReq('');
    setAttachmentResp('');
    setDeputyNotes('');
  };

  const openEditModal = (req: OfficeRequest) => {
    setEditingRequest(req);
    setSelectedCitizenId(req.Citizen_ID);
    setEntity(req.Entity);
    setRequestStatus(req.RequestStatus);
    setProcessingStatus(req.ProcessingStatus);
    setPriority(req.Priority);
    setDetails(req.Details);
    setAttachmentReq(req.AttachmentRequest || '');
    setAttachmentResp(req.AttachmentResponse || '');
    setDeputyNotes(req.DeputyNotes || '');
  };

  return (
    <div className="space-y-4 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">قسم الإدارة ومتابعة المعاملات الحكومية</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {requests.length} معاملة مسجلة
            </span>
          </div>
          <p className="text-xs text-slate-500">
            متابعة مسار المعاملات الموجهة للوزارات والهيئات والدوائر الخدمية بذي قار، والأرشفة الذكية للكتب والمرفقات.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveSection('drive_requests')}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="البحث والطباعة المباشرة من أرشيف Google Drive"
          >
            <Printer className="w-4 h-4" />
            <span>البحث والطباعة (Google Drive)</span>
          </button>

          <button
            onClick={() => {
              setEditingRequest(null);
              setDetails('');
              setSelectedCitizenId(citizens[0]?.Citizen_ID || '');
              setShowAddModal(true);
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ إنشاء طلب إداري جديد</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث برقم الطلب، اسم المواطن..."
              className="w-full pr-8 pl-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <select
              value={selectedEntityFilter}
              onChange={(e) => setSelectedEntityFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">-- تصفية حسب الجهة المعنية (الكل) --</option>
              {entitiesList.map((ent, idx) => (
                <option key={idx} value={ent}>{ent}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">-- تصفية حسب المسار الإداري (الكل) --</option>
              <option value="قيد التدقيق">قيد التدقيق</option>
              <option value="مرسل إلى الوزارة/الهيئة">مرسل إلى الوزارة/الهيئة</option>
              <option value="منجز">منجز</option>
              <option value="تم الطباعة">تم الطباعة</option>
              <option value="بانتظار الموافقة">بانتظار الموافقة</option>
              <option value="مرفوض">مرفوض</option>
            </select>
          </div>

          <div>
            <select
              value={selectedPriorityFilter}
              onChange={(e) => setSelectedPriorityFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">-- تصفية حسب الأولوية (الكل) --</option>
              <option value="عاجل">عاجل</option>
              <option value="خاص جداً">خاص جداً</option>
              <option value="عام">عام</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-bold text-slate-800">
            جدول المعاملات الإدارية ({filteredRequests.length})
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            انقر على "تعديل" لتحديث موقف المعاملة أو توجيه النائب
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
              <tr>
                <th className="p-3">رقم الطلب</th>
                <th className="p-3">اسم المواطن</th>
                <th className="p-3">الجهة المعنية</th>
                <th className="p-3">شرح وتفاصيل الطلب</th>
                <th className="p-3">المسار الإداري</th>
                <th className="p-3">الأولوية</th>
                <th className="p-3">المرفقات</th>
                <th className="p-3">التاريخ</th>
                <th className="p-3 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    لا توجد طلبات إدارية مطابقة لخيارات البحث والتصفية.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.Request_ID} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-blue-700 text-[11px]">{req.Request_ID}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{req.CitizenName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{req.Citizen_ID}</div>
                    </td>
                    <td className="p-3 font-medium text-slate-800">{req.Entity}</td>
                    <td className="p-3 max-w-xs">
                      <p className="line-clamp-2 text-slate-600">{req.Details}</p>
                      {req.DeputyNotes && (
                        <div className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded mt-1 border border-amber-200 inline-block">
                          توجيه النائب: {req.DeputyNotes}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        req.ProcessingStatus === 'منجز'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : req.ProcessingStatus === 'مرسل إلى الوزارة/الهيئة'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : req.ProcessingStatus === 'مرفوض'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {req.ProcessingStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        req.Priority === 'عاجل' || req.Priority === 'خاص جداً'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {req.Priority}
                      </span>
                    </td>
                    <td className="p-3">
                      {req.AttachmentRequest || req.AttachmentResponse ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                          <Paperclip className="w-3 h-3" />
                          <span>مرفق مستند</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">لا يوجد</span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">{req.CreatedAt}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(req)}
                          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[11px] font-bold cursor-pointer"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => {
                            const cit = citizens.find(c => c.Citizen_ID === req.Citizen_ID);
                            if (cit) setSelectedCitizenForHistory(cit);
                          }}
                          className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-amber-700 cursor-pointer"
                          title="السجل التراكمي"
                        >
                          <Clock className="w-3.5 h-3.5" />
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

      {/* Add / Edit Request Modal */}
      {(showAddModal || editingRequest) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white text-slate-800 rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <FolderKanban className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingRequest ? `تعديل ومتابعة الطلب (${editingRequest.Request_ID})` : 'إنشاء وتوثيق طلب إداري جديد'}
                  </h3>
                  <p className="text-xs text-slate-500">تحديث الجهة المعنية، المسار، الأولوية، والمرفقات</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingRequest(null);
                }}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRequest} className="space-y-3.5 text-right">
              {/* Select Citizen (if creating new) */}
              {!editingRequest ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">اختر المراجع *</label>
                  <select
                    value={selectedCitizenId}
                    onChange={(e) => setSelectedCitizenId(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">-- اختر مراجع من المسجلين بالاستعلامات --</option>
                    {citizens.map((c) => (
                      <option key={c.Citizen_ID} value={c.Citizen_ID}>
                        {c.FullName} ({c.Citizen_ID}) - {c.District}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block">المواطن:</span>
                    <strong className="text-slate-900 text-sm font-bold">{editingRequest.CitizenName}</strong>
                  </div>
                  <div className="font-mono text-blue-700 font-bold">{editingRequest.Citizen_ID}</div>
                </div>
              )}

              {/* Entity (Auto add) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الجهة المعنية *</label>
                <select
                  value={entity}
                  onChange={(e) => setEntity(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  {entitiesList.map((ent, idx) => (
                    <option key={idx} value={ent}>{ent}</option>
                  ))}
                  <option value="أخرى">+ أخرى (إضافة وزارة أو جهة جديدة)</option>
                </select>
                {entity === 'أخرى' && (
                  <input
                    type="text"
                    value={customEntity}
                    onChange={(e) => setCustomEntity(e.target.value)}
                    placeholder="اكتب اسم الجهة أو المديرية..."
                    className="w-full mt-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-400 text-slate-900 text-xs text-right"
                    required
                  />
                )}
              </div>

              {/* Statuses & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">حالة الاستلام</label>
                  <select
                    value={requestStatus}
                    onChange={(e) => setRequestStatus(e.target.value as RequestStatus)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="مستلم">مستلم</option>
                    <option value="غير مستلم">غير مستلم</option>
                    <option value="معاد">معاد</option>
                    <option value="غير مستوفي للشروط">غير مستوفي للشروط</option>
                    <option value="خاص">خاص</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المسار الإداري</label>
                  <select
                    value={processingStatus}
                    onChange={(e) => setProcessingStatus(e.target.value as ProcessingStatus)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-700"
                  >
                    <option value="قيد التدقيق">قيد التدقيق</option>
                    <option value="مرسل إلى الوزارة/الهيئة">مرسل إلى الوزارة/الهيئة</option>
                    <option value="منجز">منجز</option>
                    <option value="تم الطباعة">تم الطباعة</option>
                    <option value="بانتظار الموافقة">بانتظار الموافقة</option>
                    <option value="مرفوض">مرفوض</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">درجة الأولوية</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-red-700"
                  >
                    <option value="عام">عام</option>
                    <option value="عاجل">عاجل (إشعار فوري)</option>
                    <option value="خاص جداً">خاص جداً (إشعار فوري)</option>
                  </select>
                </div>
              </div>

              {/* Details */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">شرح وتفاصيل المعاملة *</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={3}
                  placeholder="موضوع الطلب والإجراء والمتابعة مع الوزارة..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Attachments / Files */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">اسم/رابط الطلب المقدم</label>
                  <input
                    type="text"
                    value={attachmentReq}
                    onChange={(e) => setAttachmentReq(e.target.value)}
                    placeholder="طلب_مقدم_2026.pdf"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">اسم/رابط كتاب الإجابة أو الأمر</label>
                  <input
                    type="text"
                    value={attachmentResp}
                    onChange={(e) => setAttachmentResp(e.target.value)}
                    placeholder="كتاب_الإجابة_الرسمي.pdf"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Deputy Notes */}
              <div>
                <label className="block text-xs font-bold text-amber-800 mb-1">توجيه وقرار النائب (إن وجد)</label>
                <input
                  type="text"
                  value={deputyNotes}
                  onChange={(e) => setDeputyNotes(e.target.value)}
                  placeholder="مثال: مفاتحة معالي الوزير مباشرة، إحالة للمتابعة الشخصية..."
                  className="w-full px-3 py-1.5 rounded-lg bg-amber-50/50 border border-amber-300 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* Submit buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingRequest(null);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  {editingRequest ? 'حفظ التعديلات' : 'حفظ وإرسال التنبيه'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
