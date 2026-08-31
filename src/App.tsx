import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashLanding } from './components/SplashLanding';
import { Navbar } from './components/Navbar';
import { NewsTicker } from './components/NewsTicker';
import { Sidebar } from './components/Sidebar';
import { DashboardModule } from './components/DashboardModule';
import { ReceptionModule } from './components/ReceptionModule';
import { AdminModule } from './components/AdminModule';
import { InterviewsModule } from './components/InterviewsModule';
import { OrganizationModule } from './components/OrganizationModule';
import { MachineModule } from './components/MachineModule';
import { DirectorExecutiveModule } from './components/DirectorExecutiveModule';
import { GlobalSearchArchiveModule } from './components/GlobalSearchArchiveModule';
import { WhatsAppModule } from './components/WhatsAppModule';
import { AuditModule } from './components/AuditModule';
import { ReportsModule } from './components/ReportsModule';
import { MasterAdminModule } from './components/MasterAdminModule';
import { AppsScriptSyncModule } from './components/AppsScriptSyncModule';
import { DriveRequestsArchiveModule } from './components/DriveRequestsArchiveModule';
import { PrintableIdCard } from './components/PrintableIdCard';
import { PrintableReviewBadge } from './components/PrintableReviewBadge';
import { CitizenHistoryModal } from './components/CitizenHistoryModal';

const MainAppLayout: React.FC = () => {
  const { isAuthenticated, activeSection, currentUser, setActiveSection } = useApp();

  if (!isAuthenticated) {
    return <SplashLanding />;
  }

  // RBAC Permission Guard
  const canUserAccess = (section: string): boolean => {
    if (!currentUser) return false;
    const role = currentUser.Role;
    if (role === 'developer' || role === 'director' || role === 'deputy') return true;

    switch (role) {
      case 'reception':
      case 'reception_officer':
        return ['dashboard', 'reception', 'search_archive', 'whatsapp'].includes(section);
      case 'admin':
      case 'admin_officer':
        return ['dashboard', 'admin', 'drive_requests', 'search_archive', 'reports', 'whatsapp'].includes(section);
      case 'interviews_officer':
        return ['dashboard', 'interviews', 'search_archive', 'whatsapp'].includes(section);
      case 'organization':
      case 'organization_officer':
        return ['dashboard', 'organization', 'search_archive', 'whatsapp'].includes(section);
      case 'machine':
      case 'machine_officer':
        return ['dashboard', 'machine', 'search_archive', 'reports'].includes(section);
      case 'audit':
        return ['dashboard', 'audit', 'search_archive', 'reports'].includes(section);
      case 'archive':
        return ['dashboard', 'search_archive', 'reports'].includes(section);
      default:
        return ['dashboard', 'search_archive'].includes(section);
    }
  };

  const renderActiveModule = () => {
    // If the employee is trying to access a section outside their department/role, redirect safely
    if (!canUserAccess(activeSection)) {
      return (
        <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">هذا القسم غير متاح لصلاحية حسابك</h3>
            <p className="text-xs text-slate-500">
              أنت مسجل حالياً كـ ({currentUser?.RoleArabic}). يرجى استخدام الأقسام المخصصة لمهامك الإدارية أو التواصل مع المطور / المدير لمنحك الصلاحية.
            </p>
          </div>
          <button
            onClick={() => setActiveSection('dashboard')}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            العودة للوحة الرئيسية
          </button>
        </div>
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return <DashboardModule />;
      case 'reception':
        return <ReceptionModule />;
      case 'admin':
        return <AdminModule />;
      case 'interviews':
        return <InterviewsModule />;
      case 'organization':
        return <OrganizationModule />;
      case 'machine':
        return <MachineModule />;
      case 'director':
        return <DirectorExecutiveModule />;
      case 'drive_requests':
        return <DriveRequestsArchiveModule />;
      case 'search_archive':
        return <GlobalSearchArchiveModule />;
      case 'whatsapp':
        return <WhatsAppModule />;
      case 'audit':
        return <AuditModule />;
      case 'reports':
        return <ReportsModule />;
      case 'master_admin':
        return <MasterAdminModule />;
      case 'apps_script':
        return <AppsScriptSyncModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#1E293B] flex flex-col font-['Tajawal',sans-serif] selection:bg-blue-600 selection:text-white" dir="rtl">
      {/* Administrative Announcement Ticker */}
      <NewsTicker />

      {/* Top Header / Navbar */}
      <Navbar />

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col md:flex-row w-full min-w-0">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic Functional Viewport */}
        <main className="flex-1 min-w-0 p-4 md:p-6 overflow-y-auto bg-[#F1F5F9]">
          <div className="max-w-7xl mx-auto w-full">
            {renderActiveModule()}
          </div>
        </main>
      </div>

      {/* High-Density Executive Footer */}
      <footer className="no-print h-9 bg-white border-t border-slate-200 flex items-center justify-between px-6 shrink-0 text-[11px] text-slate-500 font-medium z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>منظومة مكتب النائب علا الناشي © {new Date().getFullYear()} - الإصدار التنفيذي عالي الكثافة (High Density)</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-slate-400">
          <span className="font-mono">DB v4.2.1-PRO</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">حالة المزامنة: متصل ولحظي ⚡</span>
        </div>
      </footer>

      {/* Print Overlays & Modal Dossiers */}
      <PrintableIdCard />
      <PrintableReviewBadge />
      <CitizenHistoryModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}
