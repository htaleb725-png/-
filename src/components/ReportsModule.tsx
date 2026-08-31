import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import * as XLSX from 'xlsx';
import { 
  BarChart3, 
  Printer, 
  FileSpreadsheet
} from 'lucide-react';

export const ReportsModule: React.FC = () => {
  const { citizens, requests, interviews, organizationRecords, addAuditLog } = useApp();

  const [reportType, setReportType] = useState<'requests' | 'citizens' | 'interviews' | 'organization'>('requests');

  // Compute breakdown by entity
  const entityCounts: { [entity: string]: number } = {};
  requests.forEach(r => {
    entityCounts[r.Entity] = (entityCounts[r.Entity] || 0) + 1;
  });

  // Compute breakdown by district
  const districtCounts: { [dist: string]: number } = {};
  citizens.forEach(c => {
    districtCounts[c.District] = (districtCounts[c.District] || 0) + 1;
  });

  // Compute breakdown by status
  const statusCounts: { [status: string]: number } = {};
  requests.forEach(r => {
    statusCounts[r.ProcessingStatus] = (statusCounts[r.ProcessingStatus] || 0) + 1;
  });

  // Excel Export
  const exportToExcel = () => {
    let dataToExport: any[] = [];
    let fileName = '';

    if (reportType === 'requests') {
      dataToExport = requests.map(r => ({
        'رقم الطلب': r.Request_ID,
        'الرقم التعريفي': r.Citizen_ID,
        'اسم المواطن': r.CitizenName,
        'الهاتف': r.CitizenPhone,
        'الجهة المعنية': r.Entity,
        'المسار الإداري': r.ProcessingStatus,
        'الأولوية': r.Priority,
        'تفاصيل المعاملة': r.Details,
        'توجيه النائب': r.DeputyNotes || '',
        'تاريخ التسجيل': r.CreatedAt,
        'الموظف المسجل': r.CreatedBy
      }));
      fileName = 'تقرير_المعاملات_مكتب_النائب_علا_الناشي.xlsx';
    } else if (reportType === 'citizens') {
      dataToExport = citizens.map(c => ({
        'الرقم التعريفي': c.Citizen_ID,
        'الاسم الرباعي واللقب': c.FullName,
        'الهاتف 1': c.Phone1,
        'الهاتف 2': c.Phone2 || '',
        'القضاء': c.District,
        'الناحية': c.SubDistrict,
        'المهنة': c.Job,
        'التحصيل': c.Education,
        'التقييم': c.Rating,
        'المعرف': c.ReferralSource || '',
        'تاريخ التسجيل': c.CreatedAt
      }));
      fileName = 'سجل_المراجعين_المركزي.xlsx';
    } else if (reportType === 'interviews') {
      dataToExport = interviews.map(i => ({
        'رقم المقابلة': i.Interview_ID,
        'الاسم': i.FullName,
        'الموضوع': i.Subject,
        'الهاتف': i.Phone1,
        'السكن': i.Address,
        'التاريخ': i.InterviewDate,
        'الوقت': i.InterviewTime || '',
        'الأهمية': i.Priority,
        'الموقف': i.Status,
        'توجيه النائب': i.DeputyNotes || ''
      }));
      fileName = 'جدول_مقابلات_النائب.xlsx';
    } else {
      dataToExport = organizationRecords.map(o => ({
        'الرقم التعريفي': o.Citizen_ID,
        'الاسم': o.FullName,
        'القضاء': o.District,
        'الموقف التنظيمي': o.OrgRating,
        'الثقل الاجتماعي': o.InfluenceType,
        'التقييم': o.EvaluationPoints,
        'المركز الانتخابي': o.ElectionCenter || '',
        'المحطة': o.StationNumber || ''
      }));
      fileName = 'سجل_الموقف_التنظيمي_والجماهيري.xlsx';
    }

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'البيانات');
    XLSX.writeFile(wb, fileName);

    addAuditLog(
      'تصدير تقرير Excel',
      'التقارير والإحصائيات',
      `تصدير ملف ${fileName} يحتوي على ${dataToExport.length} سجل`
    );
  };

  const handlePrintReport = () => {
    addAuditLog(
      'طباعة تقرير ورقي',
      'التقارير والإحصائيات',
      `طباعة التقرير الإحصائي العام لمكتب النائب علا الناشي`
    );
    window.print();
  };

  return (
    <div className="space-y-4 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-pink-600" />
            <h2 className="text-base font-bold text-slate-900">قسم التقارير والإحصائيات وتصدير البيانات</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
              تصدير إكسل فوري
            </span>
          </div>
          <p className="text-xs text-slate-500">
            تحليل مؤشرات الإنجاز، التوزيع الجغرافي للمراجعين، وتصدير كافة البيانات إلى Excel متوافق مع Google Sheets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToExcel}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>تصدير ملف Excel (.xlsx)</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة التقرير</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {[
          { id: 'requests', label: `تقرير المعاملات الإدارية (${requests.length})` },
          { id: 'citizens', label: `سجل المراجعين المركزي (${citizens.length})` },
          { id: 'interviews', label: `تقرير مقابلات النائب (${interviews.length})` },
          { id: 'organization', label: `تقرير الموقف التنظيمي (${organizationRecords.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              reportType === tab.id
                ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Visual Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Entity Distribution */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h4 className="font-bold text-xs text-slate-800 border-r-2 border-blue-600 pr-2">
            توزيع المعاملات حسب الوزارات والجهات
          </h4>
          <div className="space-y-2">
            {Object.entries(entityCounts).map(([entity, count]) => {
              const pct = Math.round((count / requests.length) * 100) || 0;
              return (
                <div key={entity} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-700">
                    <span className="truncate max-w-[180px]">{entity}</span>
                    <span className="font-mono font-bold text-blue-600">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* District Distribution */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h4 className="font-bold text-xs text-slate-800 border-r-2 border-amber-500 pr-2">
            التوزيع الجغرافي للمراجعين بأقضية ذي قار
          </h4>
          <div className="space-y-2">
            {Object.entries(districtCounts).map(([district, count]) => {
              const pct = Math.round((count / citizens.length) * 100) || 0;
              return (
                <div key={district} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-700">
                    <span>{district}</span>
                    <span className="font-mono font-bold text-amber-600">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Processing Status Breakdown */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h4 className="font-bold text-xs text-slate-800 border-r-2 border-emerald-500 pr-2">
            مؤشرات الإنجاز والمسار الإداري
          </h4>
          <div className="space-y-2">
            {Object.entries(statusCounts).map(([status, count]) => {
              const pct = Math.round((count / requests.length) * 100) || 0;
              return (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-700">
                    <span>{status}</span>
                    <span className="font-mono font-bold text-emerald-600">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
