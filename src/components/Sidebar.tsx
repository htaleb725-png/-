import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  UserPlus, 
  FolderKanban, 
  Handshake, 
  Users2, 
  Printer, 
  Briefcase, 
  Search, 
  MessageSquare, 
  ShieldCheck, 
  Settings, 
  BarChart3, 
  CloudDownload,
  Building2
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeSection, setActiveSection, requests, interviews, currentUser, systemSettings } = useApp();

  const urgentRequestsCount = requests.filter(r => r.Priority === 'عاجل' || r.Priority === 'خاص جداً').length;
  const pendingInterviewsCount = interviews.filter(i => i.Status === 'مجدولة').length;

  const mainNavItems = [
    {
      id: 'dashboard',
      label: 'لوحة التحكم الشاملة',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'reception',
      label: 'قسم الاستعلامات',
      icon: UserPlus,
      badge: 'الرقم التعريفي',
    },
    {
      id: 'admin',
      label: 'قسم الإدارة والمعاملات',
      icon: FolderKanban,
      badge: urgentRequestsCount > 0 ? `${urgentRequestsCount} عاجل` : null,
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    },
    {
      id: 'interviews',
      label: 'قسم مقابلات النائب',
      icon: Handshake,
      badge: pendingInterviewsCount > 0 ? `${pendingInterviewsCount} مجدولة` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'organization',
      label: 'قسم التنظيم والجماهير',
      icon: Users2,
      badge: null,
    },
    {
      id: 'machine',
      label: 'قسم مدير المكنة والطباعة',
      icon: Printer,
      badge: null,
    },
    {
      id: 'director',
      label: 'قسم مدير المكتب التنفيذي',
      icon: Briefcase,
      badge: 'إشراف شامل',
    },
  ];

  const toolsNavItems = [
    {
      id: 'search_archive',
      label: 'البحث وطباعة الهوية',
      icon: Search,
      badge: 'بطاقة رسمية',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'drive_requests',
      label: 'أرشيف طلبات Google Drive والطباعة',
      icon: Printer,
      badge: 'Drive 1cpO...',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'whatsapp',
      label: 'مراسلات واتساب',
      icon: MessageSquare,
      badge: null,
    },
    {
      id: 'audit',
      label: 'الرقابة والتشريع',
      icon: ShieldCheck,
      badge: null,
    },
    {
      id: 'reports',
      label: 'التقارير والإحصائيات',
      icon: BarChart3,
      badge: null,
    },
  ];

  const systemNavItems = [
    {
      id: 'master_admin',
      label: 'لوحة التحكم والمطور',
      icon: Settings,
      badge: 'إدارة النظام',
    },
    {
      id: 'apps_script',
      label: 'تكامل Google Sheets',
      icon: CloudDownload,
      badge: 'مزامنة السحاب',
    },
  ];

  // Helper to check if current user has permission to see this section
  const canAccessSection = (sectionId: string): boolean => {
    if (!currentUser) return false;
    const role = currentUser.Role;
    // Developer, Director, and Deputy have full access to everything
    if (role === 'developer' || role === 'director' || role === 'deputy') return true;

    // Role-specific access mappings
    switch (role) {
      case 'reception':
      case 'reception_officer':
        return ['dashboard', 'reception', 'search_archive', 'whatsapp'].includes(sectionId);
      case 'admin':
      case 'admin_officer':
        return ['dashboard', 'admin', 'drive_requests', 'search_archive', 'reports', 'whatsapp'].includes(sectionId);
      case 'interviews_officer':
        return ['dashboard', 'interviews', 'search_archive', 'whatsapp'].includes(sectionId);
      case 'organization':
      case 'organization_officer':
        return ['dashboard', 'organization', 'search_archive', 'whatsapp'].includes(sectionId);
      case 'machine':
      case 'machine_officer':
        return ['dashboard', 'machine', 'search_archive', 'reports'].includes(sectionId);
      case 'audit':
        return ['dashboard', 'audit', 'search_archive', 'reports'].includes(sectionId);
      case 'archive':
        return ['dashboard', 'search_archive', 'reports'].includes(sectionId);
      default:
        return ['dashboard', 'search_archive'].includes(sectionId);
    }
  };

  const filteredMainNavItems = mainNavItems.filter(item => canAccessSection(item.id));
  const filteredToolsNavItems = toolsNavItems.filter(item => canAccessSection(item.id));
  const filteredSystemNavItems = systemNavItems.filter(item => canAccessSection(item.id));

  const renderNavGroup = (items: typeof mainNavItems, groupTitle: string) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {groupTitle}
        </div>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer text-right group ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors shrink-0 ${
                    isActive
                      ? 'bg-blue-700 text-white border-blue-500'
                      : item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <aside className="no-print w-full md:w-64 bg-[#0F172A] text-white flex flex-col shrink-0 border-l border-slate-700 min-h-[calc(100vh-3.5rem)]">
      {/* Office Header in Sidebar */}
      <div className="p-4 border-b border-slate-700 bg-[#1E293B] shrink-0">
        <div className="flex items-center gap-3 mb-1.5">
          <div className="w-10 h-10 bg-amber-500 text-slate-950 rounded-xl flex items-center justify-center text-xl font-black shadow-sm shrink-0">
            ع
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold leading-tight text-white truncate">
              {systemSettings.appName}
            </h1>
            <p className="text-[11px] text-amber-400 font-medium truncate">
              {systemSettings.deputyTitle}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            الإصدار المحترف عالي الكثافة
          </span>
          <span className="text-[10px] px-1.5 py-0.2 bg-slate-700 text-slate-300 rounded font-mono">
            PRO
          </span>
        </div>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-4">
        {renderNavGroup(filteredMainNavItems, 'الأقسام المخصصة')}
        {renderNavGroup(filteredToolsNavItems, 'الأدوات والخدمات')}
        {renderNavGroup(filteredSystemNavItems, 'إدارة النظام والتحكم')}
      </nav>

      {/* User Role Card & Connection Status */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0 space-y-2">
        <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser?.FullName.slice(0, 1)}
            </div>
            <div className="min-w-0 text-right">
              <div className="text-xs font-bold text-white truncate">{currentUser?.FullName}</div>
              <div className="text-[10px] text-slate-400 truncate">{currentUser?.RoleArabic}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs px-1 text-slate-400">
          <div className="flex items-center gap-2 text-green-400 font-medium">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>النظام متصل</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">SECURE-SSL</span>
        </div>
      </div>
    </aside>
  );
};
