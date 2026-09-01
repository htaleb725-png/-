import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck,
  Printer,
  Search,
  FolderKanban,
  UserPlus,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Eye,
  SendHorizontal,
  FileSpreadsheet
} from 'lucide-react';

export const DirectorExecutiveModule: React.FC = () => {
  const { 
    requests, 
    updateRequest, 
    auditLogs, 
    setActiveSection,
    addAuditLog,
    citizens,
    setSelectedCitizenForHistory,
    setPrintableBadgeCitizen,
    addRequest
  } = useApp();

  const [activeTab, setActiveTab] = useState<'reception_feed' | 'urgent_requests' | 'audit_log'>('reception_feed');
  const [receptionSearch, setReceptionSearch] = useState('');
  const [decisionNotes, setDecisionNotes] = useState<{ [reqId: string]: string }>({});
  const [directorMarginalNotes, setDirectorMarginalNotes] = useState<{ [citId: string]: string }>({});
  const [transferredToAdmin, setTransferredToAdmin] = useState<{ [citId: string]: boolean }>({});

  const urgentRequests = requests.filter(r => r.Priority === 'عاجل' || r.Priority === 'خاص جداً');

  // Filter reception citizens
  const filteredReceptionCitizens = citizens.filter(c => {
    if (!receptionSearch.trim()) return true;
    const q = receptionSearch.toLowerCase().trim();
    return (
      (c.FullName && c.FullName.toLowerCase().includes(q)) ||
      (c.Citizen_ID && c.Citizen_ID.toLowerCase().includes(q)) ||
      (c.Phone1 && c.Phone1.includes(q)) ||
      (c.District && c.District.toLowerCase().includes(q)) ||
      (c.Surname && c.Surname.toLowerCase().includes(q))
    );
  });

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

  const handleForwardToAdmin = (citizen: typeof citizens[0]) => {
    const note = directorMarginalNotes[citizen.Citizen_ID] || 'توجيه مدير المكتب: إحالة لقسم الإدارة لفتح معاملة ومخاطبة الوزارة المعنية فوراً';
    addRequest({
      Citizen_ID: citizen.Citizen_ID,
      CitizenName: citizen.FullName,
      CitizenPhone: citizen.Phone1,
      Entity: 'الأمانة العامة / الدوائر المعنية',
      RequestStatus: 'مستلم',
      ProcessingStatus: 'قيد التدقيق',
      Priority: 'عاجل',
      Details: `إحالة من مدير المكتب: ${note}`,
      DeputyNotes: note,
      CreatedBy: 'توجيه مباشر - مدير المكتب'
    });

    setTransferredToAdmin(prev => ({ ...prev, [citizen.Citizen_ID]: true }));
    addAuditLog(
      'توجيه مدير المكتب',
      'مدير المكتب',
      `إحالة مراجع الاستعلامات ${citizen.FullName} (${citizen.Citizen_ID}) لقسم الإدارة مع هامش: "${note}"`
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
            متابعة فورية لكافة المراجعين المسجلين في الاستعلامات، المصادقة على المعاملات العاجلة، وإصدار التوجيهات المباشرة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('drive_requests')}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="البحث والطباعة المباشرة للطلبات من Google Drive"
          >
            <Printer className="w-4 h-4" />
            <span>البحث والطباعة (Drive)</span>
          </button>

          <button
            onClick={() => setActiveSection('reports')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <TrendingUp className="w-4 h-4" />
            <span>التقارير الشاملة</span>
          </button>
        </div>
      </div>

      {/* KPI Stats for Executive Director */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>وارد الاستعلامات</span>
            <UserPlus className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{citizens.length}</div>
          <div className="text-[10px] text-blue-600 font-bold mt-0.5">مسجلين برقم تعريفي</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-red-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>معاملات عاجلة</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{urgentRequests.length}</div>
          <div className="text-[10px] text-red-600 font-bold mt-0.5">تتطلب مصادقة فورية</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>إجمالي المعاملات</span>
            <FolderKanban className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{requests.length}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">كافة الوزارات والدوائر</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>المنجز الكلي</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {requests.filter(r => r.ProcessingStatus === 'منجز').length}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">معاملة مكتملة</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('reception_feed')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'reception_feed'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>وارد الاستعلامات والمراجعين المباشر ({citizens.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('urgent_requests')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'urgent_requests'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>المعاملات العاجلة والمصادقة ({urgentRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_log')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'audit_log'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>سجل الرقابة والحوكمة (Audit Log)</span>
        </button>
      </div>

      {/* Tab 1: Real-time Reception Feed */}
      {activeTab === 'reception_feed' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={receptionSearch}
                onChange={(e) => setReceptionSearch(e.target.value)}
                placeholder="بحث فوري في وارد الاستعلامات (الاسم، رقم ID، الهاتف، القضاء)..."
                className="w-full h-9 pr-9 pl-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-right"
              />
            </div>
            <span className="text-xs text-slate-500 font-semibold px-2 text-center sm:text-right">
              المعروض: {filteredReceptionCitizens.length} مراجع مسجل
            </span>
          </div>

          <div className="space-y-3">
            {filteredReceptionCitizens.length === 0 ? (
              <div className="p-8 rounded-xl bg-white border border-slate-200 text-center text-slate-500 text-xs shadow-xs">
                لا توجد سجلات مطابقة للبحث حالياً.
              </div>
            ) : (
              filteredReceptionCitizens.map((cit) => {
                const citRequests = requests.filter(r => r.Citizen_ID === cit.Citizen_ID);
                const isTransferred = transferredToAdmin[cit.Citizen_ID];

                return (
                  <div
                    key={cit.Citizen_ID}
                    className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 shadow-xs space-y-3 transition-all text-right"
                  >
                    {/* Top Row: Basic ID and Badges */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {cit.Citizen_ID}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{cit.FullName}</h4>
                        {cit.Surname && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            عشيرة: {cit.Surname}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cit.Rating === 'مؤيد قوي' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          cit.Rating === 'مؤيد' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          التقييم: {cit.Rating || 'لائق'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cit.CreatedAt}</span>
                        </span>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-600">
                          بواسطة: {cit.CreatedBy || 'الاستعلامات'}
                        </span>
                      </div>
                    </div>

                    {/* Middle Info Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-slate-700 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[10px] mb-0.5">رقم الهاتف</span>
                        <span className="font-mono font-bold text-slate-900 flex items-center gap-1" dir="ltr">
                          <Phone className="w-3 h-3 text-emerald-600 inline" />
                          {cit.Phone1}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] mb-0.5">السكن والموقع</span>
                        <span className="font-semibold text-slate-900 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-blue-600 inline" />
                          {cit.District} {cit.SubDistrict ? `(${cit.SubDistrict})` : ''}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] mb-0.5">المهنة والتحصيل</span>
                        <span className="font-semibold text-slate-900">{cit.Job || 'كاسب'} - {cit.Education || 'إعدادية'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] mb-0.5">المعرّف / التزكية</span>
                        <span className="font-semibold text-slate-900">{cit.ReferralSource || 'مباشر بدون معرف'}</span>
                      </div>
                    </div>

                    {/* Associated Requests / Notes */}
                    {citRequests.length > 0 && (
                      <div className="space-y-1.5 bg-blue-50/40 p-2.5 rounded-lg border border-blue-100">
                        <span className="text-[11px] font-bold text-blue-900 block">الطلبات المسجلة للمراجع ({citRequests.length}):</span>
                        {citRequests.map(r => (
                          <div key={r.Request_ID} className="flex items-center justify-between text-xs bg-white p-2 rounded border border-blue-200">
                            <div>
                              <span className="font-mono font-bold text-blue-700 ml-2">{r.Request_ID}</span>
                              <span className="font-bold text-slate-900">[{r.Entity}]</span>
                              <span className="text-slate-600 mr-2">- {r.Details}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              {r.ProcessingStatus}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Executive Director Direct Action Bar */}
                    <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="اكتب توجيه أو هامش مدير المكتب لإحالته للإدارة..."
                          value={directorMarginalNotes[cit.Citizen_ID] || ''}
                          onChange={(e) => setDirectorMarginalNotes({ ...directorMarginalNotes, [cit.Citizen_ID]: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-right outline-none focus:bg-white focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 shrink-0">
                        <button
                          onClick={() => setPrintableBadgeCitizen(cit)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          title="طباعة باج المراجع"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>الباج</span>
                        </button>

                        <button
                          onClick={() => setSelectedCitizenForHistory(cit)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          title="معاينة الأرشيف التراكمي"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>السجل الشامل</span>
                        </button>

                        <button
                          onClick={() => handleForwardToAdmin(cit)}
                          disabled={isTransferred}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors ${
                            isTransferred 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-not-allowed'
                              : 'bg-amber-600 hover:bg-amber-700 text-white'
                          }`}
                        >
                          <SendHorizontal className="w-3.5 h-3.5" />
                          <span>{isTransferred ? 'تمت الإحالة للإدارة ✓' : 'إحالة لقسم الإدارة مع الهامش'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Urgent Requests */}
      {activeTab === 'urgent_requests' && (
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
      )}

      {/* Tab 3: Audit Log Overview */}
      {activeTab === 'audit_log' && (
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
            {auditLogs.slice(0, 15).map((log) => (
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
      )}
    </div>
  );
};
