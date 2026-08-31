import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck,
  Printer,
  Search,
  FolderKanban
} from 'lucide-react';

export const DirectorExecutiveModule: React.FC = () => {
  const { 
    requests, 
    updateRequest, 
    auditLogs, 
    setActiveSection,
    addAuditLog
  } = useApp();

  const urgentRequests = requests.filter(r => r.Priority === 'عاجل' || r.Priority === 'خاص جداً');

  const [decisionNotes, setDecisionNotes] = useState<{ [reqId: string]: string }>({});

  const handleApprove = (reqId: string, citizenName: string) => {
    const req = requests.find(r => r.Request_ID === reqId);
    if (!req) return;

    updateRequest({
      ...req,
      ProcessingStatus: 'مرسل إلى الوزارة/الهيئة',
      DeputyNotes: decisionNotes[reqId] || 'موافقة مدير المكتب وتوجيه بالمتابعة العاجلة مع الوزارة'
    });

    addAuditLog(
      'مصادقة مدير المكتب',
      'مدير المكتب',
      `مصادقة على الطلب ${reqId} للمواطن ${citizenName} وإحالته للجهة المعنية`
    );
  };

  const handleReject = (reqId: string, citizenName: string) => {
    const req = requests.find(r => r.Request_ID === reqId);
    if (!req) return;

    updateRequest({
      ...req,
      ProcessingStatus: 'مرفوض',
      DeputyNotes: decisionNotes[reqId] || 'غير مستوفي للشروط والضوابط القانونية'
    });

    addAuditLog(
      'رفض طلب',
      'مدير المكتب',
      `رفض الطلب ${reqId} لعدم استيفاء الشروط`
    );
  };

  return (
    <div className="space-y-4 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">قسم مدير المكتب التنفيذي والإشراف العام</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              صلاحيات تنفيذية عليا
            </span>
          </div>
          <p className="text-xs text-slate-500">
            الإشراف المركزي على سير المعاملات، اعتماد التوجيهات والقرارات، المصادقة على الإحالات، وتتبع جودة الأداء اليومي.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('drive_requests')}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="البحث والطباعة المباشرة للطلبات من Google Drive"
          >
            <Printer className="w-4 h-4" />
            <span>البحث والطباعة (Google Drive)</span>
          </button>

          <button
            onClick={() => setActiveSection('reports')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <TrendingUp className="w-4 h-4" />
            <span>عرض التقارير الشاملة</span>
          </button>
        </div>
      </div>

      {/* Urgent Operations Board */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>المعاملات العاجلة التي تتطلب قرار ومصادقة فورية ({urgentRequests.length})</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {urgentRequests.length === 0 ? (
            <div className="col-span-2 p-8 rounded-xl bg-white border border-slate-200 text-center text-slate-500 text-xs shadow-xs">
              لا توجد طلبات عاجلة متأخرة حالياً. كافة العمليات منتظمة.
            </div>
          ) : (
            urgentRequests.map((req) => (
              <div
                key={req.Request_ID}
                className="p-4 rounded-xl bg-white border border-red-200 space-y-3 text-right shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-700">{req.Request_ID}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                      {req.Priority}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{req.CreatedAt}</span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900">{req.CitizenName}</h4>
                  <div className="text-xs text-blue-700 font-semibold mt-0.5">الجهة: {req.Entity}</div>
                  <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    {req.Details}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    placeholder="اكتب توجيه أو هامش مدير المكتب..."
                    value={decisionNotes[req.Request_ID] || ''}
                    onChange={(e) => setDecisionNotes({ ...decisionNotes, [req.Request_ID]: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-right outline-none focus:bg-white focus:ring-2 focus:ring-amber-500"
                  />

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleReject(req.Request_ID, req.CitizenName)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold cursor-pointer border border-red-200"
                    >
                      رفض الطلب
                    </button>
                    <button
                      onClick={() => handleApprove(req.Request_ID, req.CitizenName)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-xs"
                    >
                      مصادقة وإحالة للوزارة
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Audit Log Overview */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>سجل الرقابة والحوكمة الإدارية المباشر (Audit Log)</span>
          </h3>
          <button
            onClick={() => setActiveSection('audit')}
            className="text-xs text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
          >
            عرض السجل الكامل
          </button>
        </div>

        <div className="space-y-1.5">
          {auditLogs.slice(0, 5).map((log) => (
            <div
              key={log.Log_ID}
              className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{log.ActionType || log.Action}</span>
                  <span className="text-[10px] text-blue-700 font-semibold">({log.Department || log.Section})</span>
                  <span className="text-[10px] text-slate-500">بواسطة: {log.UserName || log.User}</span>
                </div>
                <p className="text-[11px] text-slate-600">{log.Details}</p>
              </div>
              <span className="font-mono text-[10px] text-slate-400 shrink-0" dir="ltr">{log.Timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
