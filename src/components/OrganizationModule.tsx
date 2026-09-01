import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrganizationRecord, Citizen } from '../types';
import { 
  Users2, 
  Search, 
  Plus, 
  Clock,
  SendHorizontal,
  UserCheck,
  Eye,
  Filter,
  Layers
} from 'lucide-react';

export const OrganizationModule: React.FC = () => {
  const { 
    organizationRecords, 
    addOrganizationRecord, 
    updateOrganizationRecord, 
    citizens,
    getDropdownOptions,
    setSelectedCitizenForHistory
  } = useApp();

  const [activeTab, setActiveTab] = useState<'records' | 'referred_citizens'>('records');
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [influenceFilter, setInfluenceFilter] = useState('all');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<OrganizationRecord | null>(null);

  // Form states
  const [citizenId, setCitizenId] = useState('');
  const [orgRating, setOrgRating] = useState('مؤيد');
  const [influence, setInfluence] = useState('وجيه منطقة');
  const [points, setPoints] = useState(90);
  const [electionCenter, setElectionCenter] = useState('');
  const [stationNumber, setStationNumber] = useState('');
  const [notes, setNotes] = useState('');

  const filteredRecords = organizationRecords.filter(rec => {
    const matchesSearch = 
      rec.FullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.Citizen_ID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.District.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.InfluenceType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating = ratingFilter === 'all' || rec.OrgRating === ratingFilter;
    const matchesDistrict = districtFilter === 'all' || rec.District === districtFilter;
    const matchesInfluence = influenceFilter === 'all' || rec.InfluenceType === influenceFilter;

    return matchesSearch && matchesRating && matchesDistrict && matchesInfluence;
  });

  // Filter citizens referred to Organization Manager
  const referredCitizens = citizens.filter(c => 
    c.CurrentStage === 'مدير التنظيم' || (c.WorkflowHistory && c.WorkflowHistory.some(w => w.ToStage === 'مدير التنظيم'))
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingRecord) {
      updateOrganizationRecord({
        ...editingRecord,
        OrgRating: orgRating,
        InfluenceType: influence,
        EvaluationPoints: points,
        ElectionCenter: electionCenter || undefined,
        StationNumber: stationNumber || undefined,
        Notes: notes || undefined
      });
      setEditingRecord(null);
    } else {
      const cit = citizens.find(c => c.Citizen_ID === citizenId);
      if (!cit) {
        alert('يرجى اختيار مراجع مسجل بالنظام أولاً.');
        return;
      }

      addOrganizationRecord({
        Citizen_ID: cit.Citizen_ID,
        FullName: cit.FullName,
        District: cit.District,
        SubDistrict: cit.SubDistrict,
        Phone1: cit.Phone1,
        OrgRating: orgRating,
        InfluenceType: influence,
        EvaluationPoints: points,
        ElectionCenter: electionCenter || undefined,
        StationNumber: stationNumber || undefined,
        Notes: notes || undefined
      });

      setShowAddModal(false);
    }

    setNotes('');
    setElectionCenter('');
    setStationNumber('');
  };

  const openEdit = (rec: OrganizationRecord) => {
    setEditingRecord(rec);
    setCitizenId(rec.Citizen_ID);
    setOrgRating(rec.OrgRating);
    setInfluence(rec.InfluenceType);
    setPoints(rec.EvaluationPoints);
    setElectionCenter(rec.ElectionCenter || '');
    setStationNumber(rec.StationNumber || '');
    setNotes(rec.Notes || '');
    setShowAddModal(true);
  };

  const openCreateForCitizen = (cit: Citizen) => {
    const existing = organizationRecords.find(r => r.Citizen_ID === cit.Citizen_ID);
    if (existing) {
      openEdit(existing);
    } else {
      setEditingRecord(null);
      setCitizenId(cit.Citizen_ID);
      setOrgRating('مؤيد');
      setInfluence('وجيه منطقة');
      setPoints(90);
      setElectionCenter('');
      setStationNumber('');
      setNotes('');
      setShowAddModal(true);
    }
  };

  return (
    <div className="space-y-4 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Users2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">قسم التنظيم والموقف الجماهيري</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              المحطة الرابعة في المسار الإداري
            </span>
          </div>
          <p className="text-xs text-slate-500">
            استلام المراجعين المحالين من (الاستعلامات ← مدير المكتب ← مدير الإدارة ← مدير التنظيم) وتوثيق تقييمهم الجماهيري.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingRecord(null);
            setCitizenId(citizens[0]?.Citizen_ID || '');
            setShowAddModal(true);
          }}
          className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>إضافة تقييم تنظيمي لمواطن</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'records'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>سجلات الموقف التنظيمي الموثقة ({filteredRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('referred_citizens')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 relative ${
            activeTab === 'referred_citizens'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <SendHorizontal className="w-4 h-4 text-amber-500" />
          <span>الوارد المحال من الإدارة ومدير المكتب ({referredCitizens.length})</span>
          {referredCitizens.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-ping"></span>
          )}
        </button>
      </div>

      {activeTab === 'records' && (
        <>
          {/* Filter Bar */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث بالاسم، القضاء، أو الثقل الاجتماعي..."
                  className="w-full pr-9 pl-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs text-right focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-right focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="all">-- تصفية حسب الموقف التنظيمي (الكل) --</option>
                  <option value="مؤيد">مؤيد</option>
                  <option value="متردد">متردد</option>
                  <option value="معارض">معارض</option>
                  <option value="كادر قيادي">كادر قيادي</option>
                  <option value="شخصية مؤثرة">شخصية مؤثرة</option>
                </select>
              </div>

              <div>
                <select
                  value={influenceFilter}
                  onChange={(e) => setInfluenceFilter(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-right focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="all">-- الثقل الاجتماعي (الكل) --</option>
                  <option value="شيخ عشيرة">شيخ عشيرة</option>
                  <option value="وجيه منطقة">وجيه منطقة</option>
                  <option value="ناشط مدني">ناشط مدني</option>
                  <option value="أكاديمي">أكاديمي</option>
                  <option value="كاسب">كاسب</option>
                  <option value="متقاعد">متقاعد</option>
                  <option value="خريج">خريج</option>
                </select>
              </div>

              <div>
                <select
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-right focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="all">-- القضاء السكني (الكل) --</option>
                  {getDropdownOptions('District').map((d, idx) => (
                    <option key={idx} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Org Records Table */}
          <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-800">
                سجلات التنظيم والموقف الميداني ({filteredRecords.length})
              </span>
              <span className="text-[10px] text-slate-500">
                تكامل البيانات مع الرقم التعريفي الموحد (Citizen_ID)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">الرقم التعريفي</th>
                    <th className="p-3">الاسم الرباعي واللقب</th>
                    <th className="p-3">السكن</th>
                    <th className="p-3">الموقف التنظيمي</th>
                    <th className="p-3">الثقل الاجتماعي</th>
                    <th className="p-3">نقاط التقييم</th>
                    <th className="p-3">المركز الانتخابي</th>
                    <th className="p-3 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-slate-400">
                        لا توجد سجلات تنظيمية مطابقة لخيارات البحث.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((rec) => (
                      <tr key={rec.Citizen_ID} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-indigo-600 text-[11px]">{rec.Citizen_ID}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{rec.FullName}</div>
                          <div className="text-[10px] text-slate-400 font-mono" dir="ltr">{rec.Phone1}</div>
                        </td>
                        <td className="p-3">{rec.District} - {rec.SubDistrict}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            rec.OrgRating === 'مؤيد' || rec.OrgRating === 'كادر قيادي'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : rec.OrgRating === 'معارض'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {rec.OrgRating}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-800">{rec.InfluenceType}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-indigo-600 h-full rounded-full" 
                                style={{ width: `${Math.min(100, rec.EvaluationPoints)}%` }}
                              />
                            </div>
                            <span className="font-mono font-bold text-indigo-700 text-[11px]">{rec.EvaluationPoints}</span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-600">{rec.ElectionCenter || 'غير محدد'}</td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEdit(rec)}
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-indigo-700 border border-slate-200 text-[10px] font-bold cursor-pointer"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => {
                                const cit = citizens.find(c => c.Citizen_ID === rec.Citizen_ID);
                                if (cit) setSelectedCitizenForHistory(cit);
                              }}
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
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
        </>
      )}

      {/* Referred Citizens Tab */}
      {activeTab === 'referred_citizens' && (
        <div className="space-y-3">
          {referredCitizens.length === 0 ? (
            <div className="p-8 rounded-xl bg-white border border-slate-200 text-center text-slate-500 text-xs shadow-xs">
              لا يوجد مراجعين محالين حالياً إلى قسم التنظيم والموقف الجماهيري.
            </div>
          ) : (
            referredCitizens.map((cit) => {
              const orgRec = organizationRecords.find(r => r.Citizen_ID === cit.Citizen_ID);
              const latestDirective = cit.WorkflowHistory && cit.WorkflowHistory.length > 0
                ? cit.WorkflowHistory[cit.WorkflowHistory.length - 1]
                : null;

              return (
                <div
                  key={cit.Citizen_ID}
                  className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 shadow-xs space-y-3 transition-all text-right"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {cit.Citizen_ID}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{cit.FullName}</h4>
                      {cit.Surname && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          عشيرة: {cit.Surname}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        <span>محال إلى مدير التنظيم</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {orgRec ? (
                        <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          الموقف: {orgRec.OrgRating} ({orgRec.InfluenceType})
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 font-bold text-[11px]">
                          بانتظار تسجيل التقييم التنظيمي
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Latest Directive & Referrals */}
                  {latestDirective && (
                    <div className="bg-indigo-50/60 p-3 rounded-lg border border-indigo-100 text-xs text-indigo-950 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-indigo-600 font-bold">
                        <span>آخر إحالة من: {latestDirective.ActionBy} ({latestDirective.FromStage} ← {latestDirective.ToStage})</span>
                        <span className="font-mono">{latestDirective.Timestamp}</span>
                      </div>
                      <p className="font-medium text-slate-800">
                        توجيه الإحالة: {latestDirective.DirectiveNotes || 'لا توجد ملاحظات إضافية'}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px] mb-0.5">الهاتف</span>
                      <span className="font-mono font-bold text-slate-900" dir="ltr">{cit.Phone1}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] mb-0.5">السكن</span>
                      <span className="font-semibold text-slate-900">{cit.District} - {cit.SubDistrict}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] mb-0.5">المهنة</span>
                      <span className="font-semibold text-slate-900">{cit.Job || 'كاسب'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedCitizenForHistory(cit)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>السجل التراكمي الشامل</span>
                    </button>

                    <button
                      onClick={() => openCreateForCitizen(cit)}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{orgRec ? 'تعديل التقييم والبيانات الانتخابية' : '+ تثبيت التقييم التنظيمي'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Add / Edit Org Modal */}
      {(showAddModal || editingRecord) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white text-slate-800 rounded-2xl border border-slate-200 shadow-xl p-5 md:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users2 className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingRecord ? `تعديل الموقف التنظيمي (${editingRecord.FullName})` : 'إضافة وتوثيق الموقف التنظيمي'}
                  </h3>
                  <p className="text-[11px] text-slate-500">تحديد الولاء، الثقل الاجتماعي، والبيانات الانتخابية</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingRecord(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-right">
              {!editingRecord ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-0.5">اختر المراجع *</label>
                  <select
                    value={citizenId}
                    onChange={(e) => setCitizenId(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-right focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  >
                    <option value="">-- اختر مراجع مسجل بالاستعلامات --</option>
                    {citizens.map((c) => (
                      <option key={c.Citizen_ID} value={c.Citizen_ID}>
                        {c.FullName} ({c.Citizen_ID}) - {c.District}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">المواطن:</span>
                    <strong className="text-slate-900 text-xs">{editingRecord.FullName}</strong>
                  </div>
                  <div className="font-mono text-indigo-700 text-xs font-bold">{editingRecord.Citizen_ID}</div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-0.5">الموقف التنظيمي</label>
                  <select
                    value={orgRating}
                    onChange={(e) => setOrgRating(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-right focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-indigo-700"
                  >
                    <option value="مؤيد">مؤيد</option>
                    <option value="متردد">متردد</option>
                    <option value="معارض">معارض</option>
                    <option value="كادر قيادي">كادر قيادي</option>
                    <option value="شخصية مؤثرة">شخصية مؤثرة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-0.5">الثقل الاجتماعي</label>
                  <select
                    value={influence}
                    onChange={(e) => setInfluence(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-right focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="شيخ عشيرة">شيخ عشيرة</option>
                    <option value="وجيه منطقة">وجيه منطقة</option>
                    <option value="ناشط مدني">ناشط مدني</option>
                    <option value="أكاديمي">أكاديمي</option>
                    <option value="كاسب">كاسب</option>
                    <option value="متقاعد">متقاعد</option>
                    <option value="خريج">خريج</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-0.5">نقاط التقييم (0 - 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-left font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-0.5">المركز الانتخابي</label>
                  <input
                    type="text"
                    value={electionCenter}
                    onChange={(e) => setElectionCenter(e.target.value)}
                    placeholder="مدرسة النصر الابتدائية"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-right focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-0.5">رقم المحطة</label>
                  <input
                    type="text"
                    value={stationNumber}
                    onChange={(e) => setStationNumber(e.target.value)}
                    placeholder="محطة 3"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-right focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-0.5">ملاحظات إضافية ومواقف ميدانية</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="ملاحظات حول الحضور، التأثير على العائلة، والجاهزية للمؤتمرات..."
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-right focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingRecord(null);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  حفظ البيانات التنظيمية
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
