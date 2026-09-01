import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  ShieldCheck, 
  Layers, 
  Award,
  Lock,
  ChevronLeft,
  UserCheck,
  KeyRound,
  Info
} from 'lucide-react';

export const SplashLanding: React.FC = () => {
  const { systemSettings, login, users } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Time-based greeting in Arabic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return 'صباح الخير والبركة';
    if (hour >= 12 && hour < 17) return 'طاب مساؤكم بكل خير';
    return 'مساء الخير وأهلاً وسهلاً بكم';
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('يرجى إدخال اسم المستخدم وكلمة المرور.');
      return;
    }

    const success = login(username, password);
    if (!success) {
      setErrorMsg('بيانات الدخول غير صحيحة! تأكد من اسم المستخدم وكلمة المرور.');
    } else {
      setErrorMsg('');
    }
  };

  const fillCredentials = (uname: string) => {
    setUsername(uname);
    setPassword('123');
    setErrorMsg('');
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

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>بوابة المصادقة والصلاحيات المشفرة (RBAC)</span>
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
              المنظومة الإدارية والخدمية
              <span className="block mt-1 text-blue-700">
                {systemSettings.deputyName}
              </span>
            </h2>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl leading-relaxed">
              نظام موحد ومؤتمت لإدارة شؤون المراجعين، المعاملات الحكومية، الرقابة التنفيذية لمدير المكتب، والأرشفة السحابية. يوجه النظام كل موظف فورياً لقسمه المصرح به بمجرد إدخال رمز الدخول.
            </p>
          </div>

          {/* Key Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs text-right">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1.5" />
              <h3 className="text-xs font-bold text-slate-900">توجيه آلي للصلاحيات</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">فتح القسم المخصص لكل موظف فوراً</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs text-right">
              <Layers className="w-5 h-5 text-blue-600 mb-1.5" />
              <h3 className="text-xs font-bold text-slate-900">ربط مباشر مع الإدارة والمدير</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">ظهور فوري لبيانات وارد الاستعلامات</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs text-right">
              <Award className="w-5 h-5 text-amber-600 mb-1.5" />
              <h3 className="text-xs font-bold text-slate-900">سجل تعريفي موحد</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">رقم ثابت لكل مواطن مع Barcode</p>
            </div>
          </div>
        </div>

        {/* Right Side: Secure Login Box */}
        <div className="w-full max-w-md">
          <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-xl space-y-5">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">تسجيل الدخول للمنظومة</h3>
              <p className="text-xs text-slate-500">أدخل اسم المستخدم أو رمز الموظف وكلمة المرور للدخول لقسمك المصرح به</p>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 text-right">
                  اسم المستخدم أو رمز الموظف
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="مثال: reception أو director أو admin"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-right text-xs transition-all"
                    required
                  />
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 text-right">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="أدخل كلمة المرور..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-right text-xs transition-all"
                    required
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <span>التحقق وتسجيل الدخول</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Helper Reference for Available Accounts */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                <span className="flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>دليل حسابات الأقسام (كلمة المرور: <code className="text-blue-700 font-mono">123</code>)</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                {users.map((u) => (
                  <button
                    key={u.User_ID}
                    type="button"
                    onClick={() => fillCredentials(u.Username)}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-slate-700 hover:text-blue-800 text-[10px] text-right transition-all cursor-pointer truncate"
                    title={`انقر لملء اسم المستخدم: ${u.Username}`}
                  >
                    <div className="font-bold text-slate-900 truncate">{u.RoleArabic.split(' ')[0]} {u.RoleArabic.split(' ')[1] || ''}</div>
                    <div className="text-[9px] text-slate-500 font-mono font-semibold">User: {u.Username}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

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
