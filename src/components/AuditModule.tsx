import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Search, 
  Plus
} from 'lucide-react';

interface ParliamentaryInquiry {
  id: string;
  inquiryNumber: string;
  targetMinistry: string;
  subject: string;
  details: string;
  status: 'قيد الإجابة' | 'تمت الإجابة' | 'إحالة للنزاهة' | 'جلسة استجواب';
  submissionDate: string;
}

export const AuditModule: React.FC = () => {
  const { auditLogs } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'audit_trail' | 'inquiries'>('audit_trail');

  const [inquiries, setInquiries] = useState<ParliamentaryInquiry[]>([
    {
      id: 'INQ-2026-01',
      inquiryNumber: 'س/ن/2026/44',
      targetMinistry: 'وزارة الموارد المائية',
      subject: 'سؤال برلماني حول شحة المياه في مناطق أهوار الجبايش',
      details: 'مطالبة بزيادة الإطلاقات المائية وتطهير مجاري الأنهر في جنوب ذي قار استناداً للمادة 61 من الدستور العراقي.',
      status: 'قيد الإجابة',
      submissionDate: '2026-02-20'
    },
    {
      id: 'INQ-2026-02',
      inquiryNumber: 'س/ن/2026/45',
      targetMinistry: 'وزارة الصحة',
      subject: 'طلب تشكيل لجنة تحقيقية بشأن تأخر إنجاز مستشفى الشطرة',
      details: 'متابعة نسب الإنجاز المالي والفني ومحاسبة الشركة المتلكئة في تنفيذ المشروع الخدمي.',
      status: 'إحالة للنزاهة',
      submissionDate: '2026-02-28'
    }
  ]);

  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [newInqNumber, setNewInqNumber] = useState('س/ن/2026/46');
  const [newMinistry, setNewMinistry] = useState('وزارة الكهرباء');
  const [newSubject, setNewSubject] = useState('');
  const [newDetails, setNewDetails] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    const action = (log.ActionType || log.Action || '').toLowerCase();
    const user = (log.UserName || log.User || '').toLowerCase();
    const dept = (log.Department || log.Section || '').toLowerCase();
    const details = (log.Details || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    return action.includes(q) || user.includes(q) || dept.includes(q) || details.includes(q);
  });

  const handleAddInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    setInquiries([
      {
        id: `INQ-2026-0${inquiries.length + 1}`,
        inquiryNumber: newInqNumber,
        targetMinistry: newMinistry,
        subject: newSubject,
        details: newDetails,
        status: 'قيد الإجابة',
        submissionDate: new Date().toISOString().split('T')[0]
      },
      ...inquiries
    ]);

    setShowInquiryModal(false);
    setNewSubject('');
    setNewDetails('');
  };

  return (
    <div className="space-y-4 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">قسم الرقابة البرلمانية والحوكمة الإدارية</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              حوكمة وشفافية
            </span>
          </div>
          <p className="text-xs text-slate-500">
            تتبع الأسئلة واللجان البرلمانية ضد الدوائر المتلكئة، وسجل الحركات والتدقيق الأمني لكافة موظفي المكتب.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('audit_trail')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'audit_trail' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            سجل الحركات (Audit Log)
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'inquiries' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            الأسئلة والرقابة النيابية
          </button>
        </div>
      </div>

      {activeTab === 'audit_trail' ? (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في سجل العمليات باسم الموظف، القسم، أو نوع الحركة..."
              className="w-full pr-10 pl-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-xs text-right outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-800">سجل النشاطات الإدارية المشفر ({filteredLogs.length})</span>
              <span className="text-[10px] text-slate-500">حفظ تلقائي لجميع التعديلات وحركات الحذف والطباعة</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">الرقم</th>
                    <th className="p-3">نوع الإجراء</th>
                    <th className="p-3">القسم</th>
                    <th className="p-3">الموظف القائم بالحركة</th>
                    <th className="p-3">تفاصيل الحركة الإدارية</th>
                    <th className="p-3">الوقت والتاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredLogs.map((log) => (
                    <tr key={log.Log_ID} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono text-slate-400 text-[11px]">{log.Log_ID}</td>
                      <td className="p-3 font-bold text-slate-900">{log.ActionType || log.Action}</td>
                      <td className="p-3 text-blue-700 font-semibold">{log.Department || log.Section}</td>
                      <td className="p-3 font-semibold text-slate-800">{log.UserName || log.User}</td>
                      <td className="p-3 text-slate-600">{log.Details}</td>
                      <td className="p-3 font-mono text-[10px] text-slate-400" dir="ltr">{log.Timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-800">الأسئلة النيابية واللجان الرقابية</h3>
            <button
              onClick={() => setShowInquiryModal(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة سؤال نيابي أو ملف رقابي</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inquiries.map((inq) => (
              <div key={inq.id} className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700">{inq.inquiryNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    inq.status === 'إحالة للنزاهة'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {inq.status}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-slate-900">{inq.subject}</h4>
                <div className="text-xs text-amber-700 font-semibold">الوزارة المستهدفة: {inq.targetMinistry}</div>
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                  {inq.details}
                </p>

                <div className="text-[10px] text-slate-400 font-mono">
                  تاريخ التقديم: {inq.submissionDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white text-slate-800 rounded-2xl border border-slate-200 shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">إضافة سؤال برلماني رقابي</h3>
              <button onClick={() => setShowInquiryModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleAddInquiry} className="space-y-3 text-right">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الوزارة / الجهة التنفيذية</label>
                <input
                  type="text"
                  value={newMinistry}
                  onChange={(e) => setNewMinistry(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">موضوع السؤال أو الملف الرقابي</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="حول تلكؤ مشاريع مجاري ذي قار..."
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">السند الدستوري وتفاصيل الاستفسار</label>
                <textarea
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowInquiryModal(false)} className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">إلغاء</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs">حفظ السؤال النيابي</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
