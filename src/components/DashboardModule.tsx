import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  FolderKanban, 
  Handshake, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  ArrowLeft, 
  Search, 
  Calendar,
  Printer,
  MessageSquare,
  Sparkles,
  Layers
} from 'lucide-react';

export const DashboardModule: React.FC = () => {
  const { 
    citizens, 
    requests, 
    interviews, 
    organizationRecords, 
    setActiveSection, 
    setSelectedCitizenForHistory,
    systemSettings 
  } = useApp();

  const totalCitizens = citizens.length;
  const totalRequests = requests.length;
  const completedRequests = requests.filter(r => r.ProcessingStatus === 'منجز').length;
  const urgentRequests = requests.filter(r => r.Priority === 'عاجل' || r.Priority === 'خاص جداً').length;
  const pendingInterviews = interviews.filter(i => i.Status === 'مجدولة').length;
  const supportersCount = organizationRecords.filter(o => o.OrgRating === 'مؤيد').length;

  const recentRequests = requests.slice(0, 5);
  const upcomingInterviews = interviews.filter(i => i.Status === 'مجدولة').slice(0, 3);

  return (
    <div className="space-y-5 text-right">
      {/* Top Header Controls / Summary Banner */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              لوحة التحكم الشاملة
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {systemSettings.deputyTitle} - {systemSettings.province}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            مركز المتابعة والقيادة التنفيذية
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('reception')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>+ تسجيل مراجع جديد</span>
          </button>
          <button
            onClick={() => setActiveSection('search_archive')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>البحث والطباعة</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid - High Density Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-3.5 rounded-xl shadow-xs border border-slate-200">
          <div className="text-slate-500 text-xs mb-1 font-medium flex items-center justify-between">
            <span>إجمالي المراجعين</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalCitizens.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">مسجل برقم موحد</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl shadow-xs border border-slate-200">
          <div className="text-slate-500 text-xs mb-1 font-medium flex items-center justify-between">
            <span>إجمالي المعاملات</span>
            <FolderKanban className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{totalRequests.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">كافة القطاعات</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl shadow-xs border border-slate-200">
          <div className="text-slate-500 text-xs mb-1 font-medium flex items-center justify-between">
            <span>الطلبات المنجزة</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{completedRequests.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">
            {totalRequests > 0 ? `${Math.round((completedRequests / totalRequests) * 100)}% نسبة الإنجاز` : '0%'}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl shadow-xs border border-slate-200 border-r-4 border-r-red-500">
          <div className="text-slate-500 text-xs mb-1 font-medium flex items-center justify-between">
            <span>طلبات عاجلة</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600">{urgentRequests.toLocaleString()}</div>
          <div className="text-[10px] text-red-600 font-bold mt-1">تتطلب إجراء فوري</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl shadow-xs border border-slate-200">
          <div className="text-slate-500 text-xs mb-1 font-medium flex items-center justify-between">
            <span>مقابلات اليوم</span>
            <Handshake className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{pendingInterviews.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">مجدولة بالمكتب</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl shadow-xs border border-slate-200">
          <div className="text-slate-500 text-xs mb-1 font-medium flex items-center justify-between">
            <span>قاعدة المؤيدين</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600">{supportersCount.toLocaleString()}</div>
          <div className="text-[10px] text-indigo-600 font-bold mt-1">تقييم تنظيمي إيجابي</div>
        </div>
      </div>

      {/* Tables & Analytics 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: High Density Requests Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-xs text-slate-800">آخر المراجعات والمعاملات المسجلة</h3>
            </div>
            <button
              onClick={() => setActiveSection('admin')}
              className="text-blue-600 text-xs hover:underline font-bold cursor-pointer"
            >
              عرض الكل
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] uppercase font-semibold">
                <tr>
                  <th className="px-3.5 py-2.5">رقم المعاملة</th>
                  <th className="px-3.5 py-2.5">اسم المراجع</th>
                  <th className="px-3.5 py-2.5">الجهة المقصودة</th>
                  <th className="px-3.5 py-2.5">الأسبقية</th>
                  <th className="px-3.5 py-2.5">الحالة</th>
                  <th className="px-3.5 py-2.5 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRequests.map((req) => (
                  <tr key={req.Request_ID} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3.5 py-2.5 font-mono text-slate-500 font-bold text-[11px]">
                      {req.Request_ID}
                    </td>
                    <td className="px-3.5 py-2.5 font-bold text-slate-900">
                      {req.CitizenName}
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-600 truncate max-w-[140px]">
                      {req.Entity}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.Priority === 'عاجل' || req.Priority === 'خاص جداً'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {req.Priority}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.ProcessingStatus === 'منجز'
                          ? 'bg-emerald-100 text-emerald-700'
                          : req.ProcessingStatus === 'مرفوض'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {req.ProcessingStatus}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-center">
                      <button
                        onClick={() => {
                          const c = citizens.find(cit => cit.Citizen_ID === req.Citizen_ID);
                          if (c) setSelectedCitizenForHistory(c);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs cursor-pointer"
                      >
                        تفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Geographic Distribution & Interviews Alert */}
        <div className="space-y-4">
          {/* Geographical Breakdown Panel */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-xs text-slate-800">توزيع المراجعين جغرافياً</h3>
              <span className="text-[10px] text-slate-400 font-medium">محافظة ذي قار</span>
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-700 font-medium">
                  <span>قضاء الناصرية</span>
                  <span className="font-bold text-slate-900">42%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[42%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-700 font-medium">
                  <span>قضاء الشطرة</span>
                  <span className="font-bold text-slate-900">28%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[28%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-700 font-medium">
                  <span>قضاء الرفاعي</span>
                  <span className="font-bold text-slate-900">15%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full w-[15%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-700 font-medium">
                  <span>أقضية ونواحي أخرى</span>
                  <span className="font-bold text-slate-900">15%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-300 h-full w-[15%]"></div>
                </div>
              </div>
            </div>

            {/* Alert Box for Scheduled MP Interviews */}
            <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-[11px] font-bold text-amber-900 mb-0.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>تنبيه مقابلات النائب القادمة</span>
              </div>
              <div className="text-xs text-amber-800 leading-relaxed">
                لديك <strong className="font-bold">{pendingInterviews}</strong> مقابلات مجدولة تتطلب تحضير الأضابير الرسمية.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1E293B] text-white p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <div className="text-slate-400 text-xs mb-1 font-medium">خاصية طباعة البطاقة الرسمية الشاملة</div>
            <div className="text-sm font-bold">البحث الشامل والطباعة الفورية مع الباركود</div>
          </div>
          <button
            onClick={() => setActiveSection('search_archive')}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
          >
            دخول القسم 🖨️
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center text-xl shrink-0">
              💬
            </div>
            <div>
              <div className="text-slate-500 text-xs mb-0.5 font-medium">ربط واتساب السريع</div>
              <div className="text-sm font-bold text-slate-900">إرسال إشعارات الإنجاز والتحديثات للمراجعين</div>
            </div>
          </div>
          <button
            onClick={() => setActiveSection('whatsapp')}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 rounded-lg text-xs transition-colors cursor-pointer shrink-0"
          >
            فتح التراسل
          </button>
        </div>
      </div>
    </div>
  );
};
