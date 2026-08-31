import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Bell, 
  LogOut, 
  ShieldAlert, 
  ChevronDown, 
  Check, 
  Search,
  UserPlus,
  FileSpreadsheet
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    systemSettings, 
    currentUser, 
    logout, 
    users, 
    switchUser, 
    notifications, 
    markAllNotificationsAsRead,
    setActiveSection 
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSection('search_archive');
  };

  return (
    <header className="no-print sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-xs">
      <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Right (in RTL): Search Bar & Quick Switcher */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="بحث شامل في المنظومة (اسم، هاتف، ID)..."
              className="w-full h-9 pr-9 pl-3 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          </form>
        </div>

        {/* Left (in RTL): Action CTA & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Google Sheets Sync Link */}
          <button
            onClick={() => setActiveSection('apps_script')}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            title="مزامنة وتكامل Google Sheets"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Google Sheets</span>
          </button>

          {/* Quick Action Button: New Citizen */}
          <button
            onClick={() => setActiveSection('reception')}
            className="hidden sm:inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ مراجع جديد</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowRoleDropdown(false);
              }}
              className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="الإشعارات والتنبيهات العاجلة"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute left-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-slate-200 shadow-xl p-4 space-y-3 z-50 text-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-900">التنبيهات الإدارية العاجلة</h4>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                    >
                      تحديد الكل كمقروء
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">لا توجد إشعارات جديدة حالياً.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (n.linkSection) setActiveSection(n.linkSection);
                          setShowNotifDropdown(false);
                        }}
                        className={`p-2.5 rounded-lg border text-right transition-colors cursor-pointer ${
                          n.read ? 'bg-slate-50 border-slate-100 text-slate-600' : 'bg-blue-50/70 border-blue-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className="text-slate-900">{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowNotifDropdown(false);
              }}
              className="flex items-center gap-2.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer text-right"
            >
              <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                {currentUser?.FullName.slice(0, 1)}
              </div>
              <div className="hidden md:block text-right">
                <div className="text-xs font-bold text-slate-800">{currentUser?.FullName}</div>
                <div className="text-[10px] text-slate-500">{currentUser?.RoleArabic}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute left-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-xl p-3 space-y-2 z-50 text-right text-slate-800">
                <div className="px-2 py-1 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 block">التبديل السريع بين الأدوار (RBAC):</span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1">
                  {users.map((u) => (
                    <div
                      key={u.User_ID}
                      onClick={() => {
                        switchUser(u);
                        setShowRoleDropdown(false);
                      }}
                      className={`p-2 rounded-lg flex items-center justify-between text-xs cursor-pointer transition-colors ${
                        currentUser?.User_ID === u.User_ID ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{u.FullName}</div>
                        <div className="text-[10px] text-slate-500">{u.RoleArabic}</div>
                      </div>
                      {currentUser?.User_ID === u.User_ID && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      logout();
                      setShowRoleDropdown(false);
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-red-200"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>تسجيل الخروج من النظام</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Maintenance Mode Banner if active */}
      {systemSettings.maintenanceMode && (
        <div className="bg-red-600 text-white px-4 py-1 text-center text-xs font-bold flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-white animate-pulse" />
          <span>وضع الصيانة مفعل حالياً من قبل الإدارة العليا (Maintenance Mode)</span>
        </div>
      )}
    </header>
  );
};
