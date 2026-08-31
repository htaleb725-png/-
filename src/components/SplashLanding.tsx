import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  ShieldCheck, 
  Layers, 
  Award,
  Lock,
  ChevronLeft,
  Users
} from 'lucide-react';

export const SplashLanding: React.FC = () => {
  const { systemSettings, login, users, switchUser, setIsSplashOpen } = useApp();
  const [username, setUsername] = useState('director');
  const [password, setPassword] = useState('123');
  const [errorMsg, setErrorMsg] = useState('');
  const [showDirectRoles, setShowDirectRoles] = useState(false);

  // Time-based greeting in Arabic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return 'صباح الخير والبركة';
    if (hour >= 12 && hour < 17) return 'طاب مساؤكم بكل خير';
    return 'مساء الخير وأهلاً وسهلاً بكم';
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setErrorMsg('اسم المستخدم أو كلمة المرور غير صحيحة، أو الحساب مجمد.');
    } else {
      setErrorMsg('');
    }
  };

  const handleQuickLogin = (userObj: typeof users[0]) => {
    switchUser(userObj);
    setIsSplashOpen(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F1F5F9] text-slate-800 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="relative z-10 w-full bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  مجلس النواب العراقي
                </span>
                <span className="text-xs text-slate-500 font-medium">{systemSettings.province}</span>
              </div>
              <h1 className="text-base font-bold text-slate-900 mt-0.5">
                {systemSettings.appName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDirectRoles(!showDirectRoles)}
              className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>تجربة الحسابات السريعة</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero & Login Section */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 md:py-12 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Side: Information */}
        <div className="flex-1 space-y-5 text-center lg:text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
            <span>{getGreeting()}</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              المنظومة الإدارية المتكاملة
              <span className="block mt-1 text-blue-700">
                {systemSettings.deputyName}
              </span>
            </h2>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl leading-relaxed">
              منصة سحابية متقدمة لإدارة شؤون المراجعين، توثيق المعاملات، جدولة مقابلات النائب، الأرشفة الذكية، وإصدار بطاقات المعلومات الرسمية الشاملة.
            </p>
          </div>

          {/* Key Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs text-right">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1.5" />
              <h3 className="text-xs font-bold text-slate-900">صلاحيات أمنية (RBAC)</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">حماية تامة للبيانات والبطاقات</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs text-right">
              <Layers className="w-5 h-5 text-blue-600 mb-1.5" />
              <h3 className="text-xs font-bold text-slate-900">رقم تعريفي موحد</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">رمز ثابت لكل مواطن مع Barcode</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs text-right">
              <Award className="w-5 h-5 text-amber-600 mb-1.5" />
              <h3 className="text-xs font-bold text-slate-900">طباعة بطاقات رسمية</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">بترويسة مجلس النواب العراقي</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Box */}
        <div className="w-full max-w-md">
          <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-xl space-y-5">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">تسجيل الدخول للنظام</h3>
              <p className="text-xs text-slate-500">يرجى إدخال بيانات الاعتماد الممنوحة لك من إدارة المكتب</p>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 text-right">
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="مثال: director أو admin أو developer"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-right text-xs transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 text-right">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="•••••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-right text-xs transition-all"
                  required
                />
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                  <span>كلمة المرور الافتراضية: <strong className="font-mono text-blue-600">123</strong></span>
                  <span>المستخدم الافتراضي: <strong className="font-mono text-blue-600">director</strong></span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <span>دخول النظام</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-bold text-slate-600 text-center">أو الدخول المباشر السريع بنقرة واحدة:</div>
              <div className="grid grid-cols-2 gap-1.5">
                {users.slice(0, 4).map((u) => (
                  <button
                    key={u.User_ID}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-slate-700 hover:text-blue-700 text-[10px] font-bold transition-all text-center cursor-pointer truncate"
                    title={u.FullName}
                  >
                    ⚡ {u.RoleArabic.split(' ')[0]} {u.RoleArabic.split(' ')[1] || ''}
                  </button>
                ))}
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setShowDirectRoles(true)}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Users className="w-3 h-3" />
                  <span>عرض جميع الحسابات والصلاحيات ({users.length})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Quick Roles Modal */}
      {showDirectRoles && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">اختر حساباً للدخول الفوري وتجربة النظام</h3>
                <p className="text-xs text-slate-500 mt-0.5">يقوم النظام بتوجيه كل حساب تلقائياً للقسم المصرح له حسب قواعد (RBAC)</p>
              </div>
              <button
                onClick={() => setShowDirectRoles(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {users.map((user) => (
                <div
                  key={user.User_ID}
                  onClick={() => handleQuickLogin(user)}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between group text-right"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                        {user.FullName}
                      </span>
                      {user.Role === 'developer' && (
                        <span className="px-1.5 py-0.5 text-[10px] rounded bg-purple-100 text-purple-700 font-bold">
                          صلاحية مطلقة
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">{user.Department}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-600">
                      <span>المستخدم: <code className="text-blue-700 font-mono font-bold">{user.Username}</code></span>
                      <span>•</span>
                      <span>الرتبة: {user.RoleArabic}</span>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <p className="text-[11px] text-slate-500">
                ملاحظة أمنية: ميزة طباعة بطاقة المعلومات الرسمية الشاملة مقيدة حصراً بـ [المطور، المدير، موظف الإدارة].
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 w-full bg-white border-t border-slate-200 py-3 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            {systemSettings.deputyTitle} - {systemSettings.province}
          </div>
          <div className="flex items-center gap-4">
            <span>العنوان: {systemSettings.officeAddress}</span>
            <span>•</span>
            <span>الخط الساخن: {systemSettings.hotline}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
