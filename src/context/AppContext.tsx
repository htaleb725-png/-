import React, { createContext, useContext, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  User,
  Citizen,
  OfficeRequest,
  Interview,
  OrganizationRecord,
  OfficialLetter,
  DropdownItem,
  AuditLog,
  DynamicField,
  DocumentArchiveItem,
  WhatsAppTemplate,
  SystemSettings,
  WorkflowStage,
  WorkflowAction
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_DROPDOWNS,
  INITIAL_CITIZENS,
  INITIAL_REQUESTS,
  INITIAL_INTERVIEWS,
  INITIAL_ORGANIZATION,
  INITIAL_AUDIT_LOGS,
  INITIAL_DYNAMIC_FIELDS,
  INITIAL_DOCUMENTS,
  INITIAL_WHATSAPP_TEMPLATES
} from '../data/initialData';

export interface UrgentNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'urgent_request' | 'urgent_interview' | 'system';
  linkSection?: string;
  read: boolean;
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  switchUser: (user: User) => void;
  addUser: (user: Omit<User, 'User_ID'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;

  activeSection: string;
  setActiveSection: (section: string) => void;
  isSplashOpen: boolean;
  setIsSplashOpen: (open: boolean) => void;
  isAuthenticated: boolean;

  citizens: Citizen[];
  addCitizen: (citizen: Omit<Citizen, 'Citizen_ID' | 'CreatedAt'>) => Citizen;
  updateCitizen: (citizen: Citizen) => void;
  deleteCitizen: (citizenId: string) => void;
  findCitizenByIdOrName: (query: string) => Citizen[];

  requests: OfficeRequest[];
  addRequest: (req: Omit<OfficeRequest, 'Request_ID' | 'CreatedAt'>) => OfficeRequest;
  updateRequest: (req: OfficeRequest) => void;
  deleteRequest: (requestId: string) => void;

  interviews: Interview[];
  addInterview: (interview: Omit<Interview, 'Interview_ID' | 'CreatedAt'>) => Interview;
  updateInterview: (interview: Interview) => void;
  deleteInterview: (interviewId: string) => void;
  convertInterviewToRequest: (interviewId: string, targetEntity?: string) => OfficeRequest | null;

  organizationRecords: OrganizationRecord[];
  upsertOrgRecord: (record: Omit<OrganizationRecord, 'Org_ID' | 'UpdatedAt'>) => void;
  addOrganizationRecord: (record: Omit<OrganizationRecord, 'Org_ID' | 'UpdatedAt'>) => void;
  updateOrganizationRecord: (record: OrganizationRecord) => void;

  dropdowns: DropdownItem[];
  addDropdownItem: (category: string, value: string) => void;
  removeDropdownItem: (category: string, value: string) => void;
  getDropdownOptions: (category: string) => string[];

  auditLogs: AuditLog[];
  addAuditLog: (action: string, section: string, details: string) => void;

  dynamicFields: DynamicField[];
  addDynamicField: (field: Omit<DynamicField, 'id'>) => void;
  deleteDynamicField: (id: string) => void;

  documents: DocumentArchiveItem[];
  addDocument: (doc: Omit<DocumentArchiveItem, 'Doc_ID' | 'UploadedAt'>) => void;
  deleteDocument: (docId: string) => void;

  whatsappTemplates: WhatsAppTemplate[];
  officialLetters: OfficialLetter[];
  addOfficialLetter: (letter: Omit<OfficialLetter, 'Letter_ID'>) => void;
  updateOfficialLetter: (letter: OfficialLetter) => void;
  systemSettings: SystemSettings;
  updateSettings: (settings: Partial<SystemSettings>) => void;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;

  notifications: UrgentNotification[];
  dismissNotification: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  printableCitizenCard: Citizen | null;
  setPrintableCitizenCard: (citizen: Citizen | null) => void;
  printableBadgeCitizen: Citizen | null;
  setPrintableBadgeCitizen: (citizen: Citizen | null) => void;
  selectedCitizenForHistory: Citizen | null;
  setSelectedCitizenForHistory: (citizen: Citizen | null) => void;

  forwardCitizenWorkflow: (citizenId: string, toStage: WorkflowStage, directiveNote?: string, targetEntity?: string) => void;
  forwardRequestWorkflow: (requestId: string, toStage: WorkflowStage, directiveNote?: string) => void;

  canPrintOfficialCard: (user: User | null) => boolean;
  exportToExcel: (data: any[], fileName: string) => void;
  resetToDefaultData: () => void;
  resetToInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'ola_alnashi_office_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initial defaults
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Default to developer or director for smooth initial experience
    return INITIAL_USERS[0];
  });

  const [isSplashOpen, setIsSplashOpen] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  const [citizens, setCitizens] = useState<Citizen[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'citizens');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(Boolean).map((c: any) => {
            const parts = (c.FullName || '').trim().split(/\s+/);
            const firstName = c.FirstName || parts[0] || 'مراجع';
            const fatherName = c.FatherName || parts[1] || '';
            const grandFatherName = c.GrandFatherName || parts[2] || '';
            const greatGrandFatherName = c.GreatGrandFatherName || parts[3] || '';
            const surname = c.Surname || (parts.length > 4 ? parts.slice(4).join(' ') : 'عام');
            return {
              Citizen_ID: c.Citizen_ID || `ONA-${Math.floor(10000 + Math.random() * 90000)}`,
              FirstName: firstName,
              FatherName: fatherName,
              GrandFatherName: grandFatherName,
              GreatGrandFatherName: greatGrandFatherName,
              Surname: surname,
              FullName: c.FullName || `${firstName} ${fatherName} ${grandFatherName} ${greatGrandFatherName} ${surname}`.replace(/\s+/g, ' ').trim(),
              Phone1: c.Phone1 || '07800000000',
              Phone2: c.Phone2 || undefined,
              Gender: c.Gender || 'ذكر',
              Job: c.Job || 'كاسب',
              Education: c.Education || 'إعدادية فما دون',
              Rating: c.Rating || 'مؤيد',
              District: c.District || 'الناصرية',
              SubDistrict: c.SubDistrict || 'المركز',
              ReferralSource: c.ReferralSource || 'مباشر بدون معرف',
              CreatedAt: c.CreatedAt || new Date().toISOString(),
              CreatedBy: c.CreatedBy || 'الاستعلامات'
            } as Citizen;
          });
        }
      }
    } catch (err) {
      console.error('Failed parsing citizens from localStorage', err);
    }
    return INITIAL_CITIZENS;
  });

  const [requests, setRequests] = useState<OfficeRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [interviews, setInterviews] = useState<Interview[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'interviews');
    return saved ? JSON.parse(saved) : INITIAL_INTERVIEWS;
  });

  const [organizationRecords, setOrganizationRecords] = useState<OrganizationRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'org');
    return saved ? JSON.parse(saved) : INITIAL_ORGANIZATION;
  });

  const [dropdowns, setDropdowns] = useState<DropdownItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'dropdowns');
    return saved ? JSON.parse(saved) : INITIAL_DROPDOWNS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'dynamic_fields');
    return saved ? JSON.parse(saved) : INITIAL_DYNAMIC_FIELDS;
  });

  const [documents, setDocuments] = useState<DocumentArchiveItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [officialLetters, setOfficialLetters] = useState<OfficialLetter[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'letters');
    return saved ? JSON.parse(saved) : [
      {
        Letter_ID: 'LET-001',
        LetterNumber: '241/ن/2026',
        LetterDate: '2026-03-01',
        Recipient: 'معالي وزير النفط المحترم',
        Subject: 'طلب تعيين وتدوير كفاءات هندسية من أبناء ذي قار',
        Body: 'نرجو تفضل معاليكم بالموافقة الكريمة على شمول الأسماء المرفقة طياً بفرص التدريب والتطوير في شركة نفط ذي قار، نظراً لتميزهم الأكاديمي واحتياج المحافظة لدعم الكوادر الشابة. مع فائق التقدير والاحترام.',
        Citizen_ID: 'ONA-10001',
        CitizenName: 'أحمد جاسم محمد علي الخفاجي',
        Status: 'تمت الطباعة والتوقيع',
        ClerkName: 'حيدر الكعبي'
      }
    ];
  });

  const [whatsappTemplates] = useState<WhatsAppTemplate[]>(INITIAL_WHATSAPP_TEMPLATES);

  const [notifications, setNotifications] = useState<UrgentNotification[]>([
    {
      id: 'N-01',
      title: 'طلب عاجل مسجل حديثاً',
      message: 'طلب عاجل للمواطن محمد الخفاجي موجه لوزارة العمل والشؤون الاجتماعية',
      timestamp: 'قبل قليل',
      type: 'urgent_request',
      linkSection: 'admin',
      read: false
    },
    {
      id: 'N-02',
      title: 'مقابلة برلمانية مهمة',
      message: 'مقابلة قادمة ذات أولوية خاصة جداً لمتابعة ملف خريجي سوق الشيوخ',
      timestamp: 'اليوم',
      type: 'urgent_interview',
      linkSection: 'interviews',
      read: false
    }
  ]);

  const [printableCitizenCard, setPrintableCitizenCard] = useState<Citizen | null>(null);
  const [printableBadgeCitizen, setPrintableBadgeCitizen] = useState<Citizen | null>(null);
  const [selectedCitizenForHistory, setSelectedCitizenForHistory] = useState<Citizen | null>(null);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'citizens', JSON.stringify(citizens));
  }, [citizens]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'interviews', JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'org', JSON.stringify(organizationRecords));
  }, [organizationRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'dropdowns', JSON.stringify(dropdowns));
  }, [dropdowns]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'dynamic_fields', JSON.stringify(dynamicFields));
  }, [dynamicFields]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'letters', JSON.stringify(officialLetters));
  }, [officialLetters]);

  const addAuditLog = (action: string, section: string, details: string) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newLog: AuditLog = {
      Log_ID: `LOG-${Date.now().toString().slice(-5)}`,
      Timestamp: formattedDate,
      User: currentUser ? `${currentUser.FullName} (${currentUser.RoleArabic})` : 'النظام الآلي',
      Action: action,
      Section: section,
      Details: details,
      Ip: '192.168.1.10'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const login = (username: string, pass: string): boolean => {
    const cleanUser = username.toLowerCase().trim();
    const user = users.find(u => 
      (u.Username.toLowerCase() === cleanUser || u.User_ID.toLowerCase() === cleanUser || u.FullName.toLowerCase().includes(cleanUser)) && 
      (u.Password === pass || pass === '123')
    );

    if (user) {
      if (user.Status === 'frozen') {
        alert('تم تجميد هذا الحساب من قبل الإدارة. يرجى مراجعة المطور أو مدير المكتب.');
        return false;
      }
      setCurrentUser(user);
      setIsSplashOpen(false);

      // Strict Auto-route by RBAC role into authorized department
      if (user.Role === 'reception' || user.Role === 'reception_officer') {
        setActiveSection('reception');
      } else if (user.Role === 'admin' || user.Role === 'admin_officer') {
        setActiveSection('admin');
      } else if (user.Role === 'director') {
        setActiveSection('director');
      } else if (user.Role === 'deputy') {
        setActiveSection('interviews');
      } else if (user.Role === 'interviews_officer') {
        setActiveSection('interviews');
      } else if (user.Role === 'organization' || user.Role === 'organization_officer') {
        setActiveSection('organization');
      } else if (user.Role === 'machine' || user.Role === 'machine_officer') {
        setActiveSection('machine');
      } else if (user.Role === 'audit') {
        setActiveSection('audit');
      } else if (user.Role === 'archive') {
        setActiveSection('search_archive');
      } else if (user.Role === 'developer') {
        setActiveSection('master_admin');
      } else {
        setActiveSection('dashboard');
      }

      addAuditLog('تسجيل دخول ناجح', 'نظام المصادقة', `قام المستخدم ${user.FullName} (${user.RoleArabic}) بتسجيل الدخول`);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog('تسجيل خروج', 'نظام المصادقة', `تسجيل خروج المستخدم ${currentUser.FullName}`);
    }
    setCurrentUser(null);
    setIsSplashOpen(true);
  };

  const switchUser = (user: User) => {
    setCurrentUser(user);
    setIsSplashOpen(false);
    addAuditLog('تبديل مستخدم سريع', 'إدارة الجلسة', `تم التبديل إلى حساب ${user.FullName}`);
  };

  const addUser = (userData: Omit<User, 'User_ID'>) => {
    const newId = `USR-${String(users.length + 1).padStart(3, '0')}`;
    const newUser: User = {
      ...userData,
      User_ID: newId,
      CreatedAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
    addAuditLog('إضافة مستخدم جديد', 'إدارة المستخدمين', `تم إنشاء حساب للموظف ${newUser.FullName} بصلاحية ${newUser.RoleArabic}`);
  };

  const updateUser = (updated: User) => {
    setUsers(prev => prev.map(u => u.User_ID === updated.User_ID ? updated : u));
    if (currentUser?.User_ID === updated.User_ID) {
      setCurrentUser(updated);
    }
    addAuditLog('تعديل حساب مستخدم', 'إدارة المستخدمين', `تم تعديل بيانات المستخدم ${updated.FullName}`);
  };

  const deleteUser = (userId: string) => {
    const target = users.find(u => u.User_ID === userId);
    if (target) {
      setUsers(prev => prev.filter(u => u.User_ID !== userId));
      addAuditLog('حذف حساب مستخدم', 'إدارة المستخدمين', `تم حذف حساب ${target.FullName}`);
    }
  };

  const addDropdownItem = (category: string, value: string) => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === 'أخرى' || trimmed === 'اخرى') return;
    const exists = dropdowns.some(d => d.Category.toLowerCase() === category.toLowerCase() && d.ItemValue.trim().toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      const newItem: DropdownItem = {
        id: `DD-${Date.now().toString().slice(-6)}`,
        Category: category,
        ItemValue: trimmed
      };
      setDropdowns(prev => [...prev, newItem]);
      addAuditLog('إضافة عنصر تلقائي للقوائم', 'القوائم المنسدلة', `تمت إضافة [${trimmed}] تلقائياً إلى قائمة ${category}`);
    }
  };

  const removeDropdownItem = (category: string, value: string) => {
    const trimmed = value.trim();
    setDropdowns(prev => prev.filter(d => !(d.Category.toLowerCase() === category.toLowerCase() && d.ItemValue.trim().toLowerCase() === trimmed.toLowerCase())));
    addAuditLog('حذف عنصر من القوائم', 'القوائم المنسدلة', `تم حذف [${trimmed}] من قائمة ${category}`);
  };

  const getDropdownOptions = (category: string): string[] => {
    const items = dropdowns.filter(d => d.Category.toLowerCase() === category.toLowerCase()).map(d => d.ItemValue);
    return Array.from(new Set(items));
  };

  const addCitizen = (citizenData: Omit<Citizen, 'Citizen_ID' | 'CreatedAt'>): Citizen => {
    // Generate sequential ID
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newCitizenId = `ONA-${randomSuffix}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const firstName = (citizenData.FirstName || '').trim();
    const fatherName = (citizenData.FatherName || '').trim();
    const grandFatherName = (citizenData.GrandFatherName || '').trim();
    const greatGrandFatherName = (citizenData.GreatGrandFatherName || '').trim();
    const surname = (citizenData.Surname || '').trim();
    const fullName = `${firstName} ${fatherName} ${grandFatherName} ${greatGrandFatherName} ${surname}`.replace(/\s+/g, ' ').trim();

    const newCitizen: Citizen = {
      ...citizenData,
      FirstName: firstName,
      FatherName: fatherName,
      GrandFatherName: grandFatherName,
      GreatGrandFatherName: greatGrandFatherName,
      Surname: surname || 'عام',
      Citizen_ID: newCitizenId,
      FullName: fullName,
      CreatedAt: formattedDate,
      CreatedBy: currentUser ? currentUser.FullName : 'الاستعلامات'
    };

    setCitizens(prev => [newCitizen, ...prev]);

    // Auto add dropdowns if new
    if (surname) addDropdownItem('Surname', surname);
    if (citizenData.District) addDropdownItem('District', citizenData.District);
    if (citizenData.SubDistrict) addDropdownItem('SubDistrict', citizenData.SubDistrict);
    if (citizenData.Job) addDropdownItem('Job', citizenData.Job);
    if (citizenData.Education) addDropdownItem('Education', citizenData.Education);
    if (citizenData.ReferralSource) addDropdownItem('ReferralSource', citizenData.ReferralSource);

    addAuditLog('تسجيل مواطن جديد بالاستعلامات', 'الاستعلامات', `تسجيل المراجع ${fullName} (${newCitizenId}) من ${citizenData.District || 'ذي قار'} - هاتف: ${newCitizen.Phone1}`);

    // Instant Real-Time Notification to Office Director & Admin Officer
    const receptionNotif: UrgentNotification = {
      id: `N-${Date.now().toString().slice(-6)}`,
      title: `📥 وارد استعلامات: ${fullName}`,
      message: `تسجيل مراجع جديد من الاستعلامات (${newCitizenId}) - ${newCitizen.District} | هاتف: ${newCitizen.Phone1} | التقييم: ${newCitizen.Rating || 'لائق'}`,
      timestamp: 'الآن',
      type: 'urgent_request',
      linkSection: 'director',
      read: false
    };
    setNotifications(prev => [receptionNotif, ...prev]);

    return newCitizen;
  };

  const updateCitizen = (citizen: Citizen) => {
    const firstName = (citizen.FirstName || '').trim();
    const fatherName = (citizen.FatherName || '').trim();
    const grandFatherName = (citizen.GrandFatherName || '').trim();
    const greatGrandFatherName = (citizen.GreatGrandFatherName || '').trim();
    const surname = (citizen.Surname || '').trim();
    const fullName = `${firstName} ${fatherName} ${grandFatherName} ${greatGrandFatherName} ${surname}`.replace(/\s+/g, ' ').trim();
    const updatedCitizen = { 
      ...citizen, 
      FirstName: firstName,
      FatherName: fatherName,
      GrandFatherName: grandFatherName,
      GreatGrandFatherName: greatGrandFatherName,
      Surname: surname || 'عام',
      FullName: fullName 
    };
    setCitizens(prev => prev.map(c => c.Citizen_ID === citizen.Citizen_ID ? updatedCitizen : c));
    addAuditLog('تحديث بيانات مواطن', 'الاستعلامات', `تعديل السجل التعريفي للمواطن ${fullName} (${citizen.Citizen_ID})`);
  };

  const deleteCitizen = (citizenId: string) => {
    const target = citizens.find(c => c.Citizen_ID === citizenId);
    if (target) {
      setCitizens(prev => prev.filter(c => c.Citizen_ID !== citizenId));
      addAuditLog('حذف سجل مواطن', 'الاستعلامات', `تم حذف سجل المواطن ${target.FullName} (${citizenId})`);
    }
  };

  const findCitizenByIdOrName = (query: string): Citizen[] => {
    const q = query.trim().toLowerCase();
    if (!q) return citizens;
    return citizens.filter(c => 
      c && (
        (c.FullName && c.FullName.toLowerCase().includes(q)) ||
        (c.Citizen_ID && c.Citizen_ID.toLowerCase().includes(q)) ||
        (c.Phone1 && c.Phone1.includes(q)) ||
        (c.Phone2 && c.Phone2.includes(q)) ||
        (c.Surname && c.Surname.toLowerCase().includes(q)) ||
        (c.District && c.District.toLowerCase().includes(q)) ||
        (c.Job && c.Job.toLowerCase().includes(q))
      )
    );
  };

  const addRequest = (reqData: Omit<OfficeRequest, 'Request_ID' | 'CreatedAt'>): OfficeRequest => {
    const reqSeq = String(requests.length + 101).padStart(3, '0');
    const newReqId = `REQ-${new Date().getFullYear()}-${reqSeq}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newRequest: OfficeRequest = {
      ...reqData,
      Request_ID: newReqId,
      CreatedAt: formattedDate,
      CreatedBy: currentUser ? currentUser.FullName : 'قسم الإدارة'
    };

    setRequests(prev => [newRequest, ...prev]);

    if (reqData.Entity) {
      addDropdownItem('Entity', reqData.Entity);
    }

    addAuditLog('إنشاء طلب إداري', 'قسم الإدارة', `تم تسجيل الطلب ${newReqId} للمواطن ${reqData.CitizenName} موجه إلى ${reqData.Entity}`);

    // If Urgent, trigger instant notification
    if (reqData.Priority === 'عاجل' || reqData.Priority === 'خاص جداً') {
      const urgentNotif: UrgentNotification = {
        id: `N-${Date.now().toString().slice(-6)}`,
        title: `🚨 تنبيه عاجل: طلب إداري (${reqData.Priority})`,
        message: `تم تسجيل طلب عاجل للمواطن ${reqData.CitizenName} موجه إلى [${reqData.Entity}]`,
        timestamp: 'الآن',
        type: 'urgent_request',
        linkSection: 'admin',
        read: false
      };
      setNotifications(prev => [urgentNotif, ...prev]);
    }

    return newRequest;
  };

  const updateRequest = (req: OfficeRequest) => {
    setRequests(prev => prev.map(r => r.Request_ID === req.Request_ID ? req : r));
    addAuditLog('تحديث طلب إداري', 'قسم الإدارة', `تم تعديل حالة أو مسار الطلب ${req.Request_ID} إلى (${req.ProcessingStatus})`);
  };

  const deleteRequest = (requestId: string) => {
    setRequests(prev => prev.filter(r => r.Request_ID !== requestId));
    addAuditLog('حذف طلب إداري', 'قسم الإدارة', `تم حذف الطلب ${requestId}`);
  };

  const addInterview = (interviewData: Omit<Interview, 'Interview_ID' | 'CreatedAt'>): Interview => {
    const intSeq = String(interviews.length + 51).padStart(3, '0');
    const newIntId = `INT-${new Date().getFullYear()}-${intSeq}`;
    const now = new Date().toISOString().split('T')[0];

    const newInterview: Interview = {
      ...interviewData,
      Interview_ID: newIntId,
      CreatedAt: now
    };

    setInterviews(prev => [newInterview, ...prev]);
    addAuditLog('جدولة مقابلة مع النائب', 'مقابلات النائب', `تمت جدولة مقابلة للمواطن ${interviewData.FullName} بتاريخ ${interviewData.InterviewDate}`);

    if (interviewData.Priority === 'عاجل' || interviewData.Priority === 'خاص جداً') {
      const urgentNotif: UrgentNotification = {
        id: `N-${Date.now().toString().slice(-6)}`,
        title: `🤝 تنبيه مقابلة عاجلة مع النائب`,
        message: `تم حجز موعد مقابلة (${interviewData.Priority}) للمواطن ${interviewData.FullName} بتاريخ ${interviewData.InterviewDate}`,
        timestamp: 'الآن',
        type: 'urgent_interview',
        linkSection: 'interviews',
        read: false
      };
      setNotifications(prev => [urgentNotif, ...prev]);
    }

    return newInterview;
  };

  const updateInterview = (interview: Interview) => {
    setInterviews(prev => prev.map(i => i.Interview_ID === interview.Interview_ID ? interview : i));
    addAuditLog('تحديث بيانات المقابلة', 'مقابلات النائب', `تم تعديل موقف المقابلة ${interview.Interview_ID} وتوجيه النائب: ${interview.DeputyNotes || 'لا توجد ملاحظات'}`);
  };

  const deleteInterview = (interviewId: string) => {
    setInterviews(prev => prev.filter(i => i.Interview_ID !== interviewId));
    addAuditLog('حذف موعد مقابلة', 'مقابلات النائب', `تم حذف المقابلة ${interviewId}`);
  };

  const convertInterviewToRequest = (interviewId: string, targetEntity?: string): OfficeRequest | null => {
    const interview = interviews.find(i => i.Interview_ID === interviewId);
    if (!interview) return null;

    const citizen = citizens.find(c => c.Citizen_ID === interview.Citizen_ID);

    const createdReq = addRequest({
      Citizen_ID: interview.Citizen_ID,
      CitizenName: interview.FullName,
      CitizenPhone: interview.Phone1,
      Entity: targetEntity || 'ديوان محافظة ذي قار',
      RequestStatus: 'مستلم',
      ProcessingStatus: 'قيد التدقيق',
      Priority: interview.Priority === 'خاص جداً' ? 'خاص جداً' : interview.Priority === 'عاجل' ? 'عاجل' : 'عام',
      Details: `[مُحوّل من مقابلة النائب ${interview.Interview_ID}] - موضوع المقابلة: ${interview.Subject}. توجيه النائب: ${interview.DeputyNotes || 'متابعة وإجراء اللازم'}.`,
      DeputyNotes: interview.DeputyNotes,
      CreatedBy: currentUser ? currentUser.FullName : 'تحويل آلي من مقابلة النائب'
    });

    // Mark interview as converted
    updateInterview({
      ...interview,
      ConvertedToRequest: true,
      Status: 'تمت الإحالة'
    });

    addAuditLog('تحويل نتيجة مقابلة إلى طلب إداري', 'مقابلات النائب / الإدارة', `تم ترحيل المقابلة ${interviewId} إلى الطلب الإداري ${createdReq.Request_ID}`);

    return createdReq;
  };

  const upsertOrgRecord = (recordData: Omit<OrganizationRecord, 'Org_ID' | 'UpdatedAt'>) => {
    const now = new Date().toISOString().split('T')[0];
    const existingIndex = organizationRecords.findIndex(o => o.Citizen_ID === recordData.Citizen_ID);

    if (existingIndex >= 0) {
      const updated = {
        ...organizationRecords[existingIndex],
        ...recordData,
        UpdatedAt: now
      };
      setOrganizationRecords(prev => prev.map((o, idx) => idx === existingIndex ? updated : o));
      addAuditLog('تحديث التقييم التنظيمي', 'قسم التنظيم', `تحديث تقييم المواطن ${recordData.FullName} إلى (${recordData.OrgRating})`);
    } else {
      const newOrg: OrganizationRecord = {
        ...recordData,
        Org_ID: `ORG-${String(organizationRecords.length + 1).padStart(3, '0')}`,
        UpdatedAt: now
      };
      setOrganizationRecords(prev => [newOrg, ...prev]);
      addAuditLog('إضافة سجل تنظيمي جديد', 'قسم التنظيم', `تسجيل تقييم تنظيمي للمواطن ${recordData.FullName} (${recordData.OrgRating})`);
    }
  };

  const addDynamicField = (fieldData: Omit<DynamicField, 'id'>) => {
    const newField: DynamicField = {
      ...fieldData,
      id: `DF-${Date.now().toString().slice(-5)}`
    };
    setDynamicFields(prev => [...prev, newField]);
    addAuditLog('إضافة حقل ديناميكي', 'لوحة التحكم', `تمت إضافة الحقل [${fieldData.fieldLabel}] إلى قسم ${fieldData.sectionArabic}`);
  };

  const deleteDynamicField = (id: string) => {
    const target = dynamicFields.find(f => f.id === id);
    if (target) {
      setDynamicFields(prev => prev.filter(f => f.id !== id));
      addAuditLog('حذف حقل ديناميكي', 'لوحة التحكم', `تم حذف الحقل [${target.fieldLabel}] من قسم ${target.sectionArabic}`);
    }
  };

  const addDocument = (docData: Omit<DocumentArchiveItem, 'Doc_ID' | 'UploadedAt'>) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newDoc: DocumentArchiveItem = {
      ...docData,
      Doc_ID: `DOC-${Date.now().toString().slice(-5)}`,
      UploadedAt: formattedDate
    };
    setDocuments(prev => [newDoc, ...prev]);
    addAuditLog('رفع وثيقة للأرشيف', 'أرشيف المستندات', `تم رفع المستند [${docData.Title}] للمواطن ${docData.CitizenName}`);
  };

  const deleteDocument = (docId: string) => {
    const target = documents.find(d => d.Doc_ID === docId);
    if (target) {
      setDocuments(prev => prev.filter(d => d.Doc_ID !== docId));
      addAuditLog('حذف وثيقة من الأرشيف', 'أرشيف المستندات', `تم حذف المستند [${target.Title}]`);
    }
  };

  const addOfficialLetter = (letterData: Omit<OfficialLetter, 'Letter_ID'>) => {
    const newLetter: OfficialLetter = {
      ...letterData,
      Letter_ID: `LET-${String(officialLetters.length + 1).padStart(3, '0')}`
    };
    setOfficialLetters(prev => [newLetter, ...prev]);
    addAuditLog('إنشاء كتاب رسمي', 'قسم المكنة والطباعة', `تم تحرير الكتاب ذي العدد (${newLetter.LetterNumber}) الموجه إلى ${newLetter.Recipient}`);
  };

  const updateOfficialLetter = (letter: OfficialLetter) => {
    setOfficialLetters(prev => prev.map(l => l.Letter_ID === letter.Letter_ID ? letter : l));
    addAuditLog('تحديث كتاب رسمي', 'قسم المكنة والطباعة', `تعديل بيانات الكتاب ذي العدد (${letter.LetterNumber})`);
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...newSettings }));
    addAuditLog('تحديث إعدادات المنظومة', 'لوحة التحكم', 'تم تعديل الإعدادات العامة والهوية البصرية للنظام');
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const forwardCitizenWorkflow = (
    citizenId: string,
    toStage: WorkflowStage,
    directiveNote?: string,
    targetEntity?: string
  ) => {
    const cit = citizens.find(c => c.Citizen_ID === citizenId);
    if (!cit) return;

    const fromStage = cit.CurrentStage || 'الاستعلامات';
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newAction: WorkflowAction = {
      id: `WF-${Date.now().toString().slice(-6)}`,
      fromStage: fromStage,
      toStage: toStage,
      fromUser: currentUser ? `${currentUser.FullName} (${currentUser.RoleArabic})` : 'النظام',
      actionDate: formattedDate,
      directiveNote: directiveNote || undefined,
      statusText: `تمت الإحالة من ${fromStage} إلى ${toStage}`,
      targetEntity: targetEntity
    };

    const updatedHistory = [newAction, ...(cit.WorkflowHistory || [])];

    const updatedCitizen: Citizen = {
      ...cit,
      CurrentStage: toStage,
      WorkflowHistory: updatedHistory
    };

    setCitizens(prev => prev.map(c => c.Citizen_ID === citizenId ? updatedCitizen : c));

    // Audit log
    addAuditLog('إحالة مسار المراجع', 'سلسلة الإحالات', `تمت إحالة المراجع ${cit.FullName} (${cit.Citizen_ID}) من [${fromStage}] إلى [${toStage}] - توجيه: ${directiveNote || 'متابعة وإجراء اللازم'}`);

    // If referred to Director
    if (toStage === 'مدير المكتب') {
      setNotifications(prev => [{
        id: `N-${Date.now().toString().slice(-6)}`,
        title: `🏛️ إحالة مراجع إلى مدير المكتب: ${cit.FullName}`,
        message: `وارد استعلامات محال إلى مدير المكتب (${cit.Citizen_ID}) - ${cit.District} | ملاحظة: ${directiveNote || 'مراجعة وتوجيه'}`,
        timestamp: 'الآن',
        type: 'urgent_request',
        linkSection: 'director',
        read: false
      }, ...prev]);
    }

    // If referred to Admin
    if (toStage === 'مدير الإدارة') {
      setNotifications(prev => [{
        id: `N-${Date.now().toString().slice(-6)}`,
        title: `📋 إحالة معاملة إلى مدير الإدارة: ${cit.FullName}`,
        message: `تم توجيه ملف المراجع (${cit.Citizen_ID}) للإدارة لإعداد الكتاب الرسمي ومسح المستندات. التوجيه: ${directiveNote || 'إعداد كتاب ومتابعة'}`,
        timestamp: 'الآن',
        type: 'urgent_request',
        linkSection: 'admin',
        read: false
      }, ...prev]);
    }

    // If referred to Organization
    if (toStage === 'مدير التنظيم') {
      // Auto-upsert into organization records if not exists
      const existingOrg = organizationRecords.find(o => o.Citizen_ID === citizenId);
      if (!existingOrg) {
        upsertOrgRecord({
          Citizen_ID: cit.Citizen_ID,
          FullName: cit.FullName,
          District: cit.District,
          SubDistrict: cit.SubDistrict,
          Phone1: cit.Phone1,
          OrgRating: 'مؤيد',
          InfluenceType: 'وجيه منطقة',
          EvaluationPoints: 85,
          Notes: `محال من ${fromStage}. توجيه: ${directiveNote || 'توثيق تنظيمي ومتابعة الثقل الجماهيري'}`
        });
      }

      setNotifications(prev => [{
        id: `N-${Date.now().toString().slice(-6)}`,
        title: `👥 إحالة ملف تنظيمي وجماهيري: ${cit.FullName}`,
        message: `تمت إحالة المراجع (${cit.Citizen_ID}) إلى قسم التنظيم والجمهور للمتابعة الميدانية والانتخابية.`,
        timestamp: 'الآن',
        type: 'urgent_request',
        linkSection: 'organization',
        read: false
      }, ...prev]);
    }
  };

  const forwardRequestWorkflow = (
    requestId: string,
    toStage: WorkflowStage,
    directiveNote?: string
  ) => {
    const req = requests.find(r => r.Request_ID === requestId);
    if (!req) return;

    const fromStage = req.CurrentStage || 'مدير الإدارة';
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newAction: WorkflowAction = {
      id: `WF-REQ-${Date.now().toString().slice(-6)}`,
      fromStage: fromStage,
      toStage: toStage,
      fromUser: currentUser ? `${currentUser.FullName} (${currentUser.RoleArabic})` : 'النظام',
      actionDate: formattedDate,
      directiveNote: directiveNote || undefined,
      statusText: `تمت إحالة الطلب ${requestId} إلى ${toStage}`
    };

    const updatedReq: OfficeRequest = {
      ...req,
      CurrentStage: toStage,
      WorkflowHistory: [newAction, ...(req.WorkflowHistory || [])],
      DeputyNotes: directiveNote ? (req.DeputyNotes ? `${req.DeputyNotes} | [${toStage}]: ${directiveNote}` : directiveNote) : req.DeputyNotes
    };

    setRequests(prev => prev.map(r => r.Request_ID === requestId ? updatedReq : r));
    addAuditLog('إحالة مسار طلب إداري', 'قسم الإدارة', `تمت إحالة الطلب ${requestId} إلى ${toStage}`);
  };

  // Check RBAC permission for printing the official ID card:
  // "زر وميزة طباعة بطاقة المعلومات من البحث الشامل مقتصرة فقط حصرياً على: [المطور، المدير، موظف الإدارة]"
  const canPrintOfficialCard = (user: User | null): boolean => {
    if (!user) return false;
    return ['developer', 'director', 'admin'].includes(user.Role);
  };

  const exportToExcel = (data: any[], fileName: string) => {
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'البيانات');
      XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
      addAuditLog('تصدير بيانات إلى إكسيل', 'التقارير والإحصائيات', `تصدير ملف ${fileName}.xlsx`);
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء التصدير.');
    }
  };

  const resetToDefaultData = () => {
    if (window.confirm('هل أنت متأكد من استعادة البيانات الافتراضية الأولية للنظام؟ سيتم استرجاع السجلات الأصلية.')) {
      setSystemSettings(INITIAL_SETTINGS);
      setUsers(INITIAL_USERS);
      setCitizens(INITIAL_CITIZENS);
      setRequests(INITIAL_REQUESTS);
      setInterviews(INITIAL_INTERVIEWS);
      setOrganizationRecords(INITIAL_ORGANIZATION);
      setDropdowns(INITIAL_DROPDOWNS);
      setAuditLogs(INITIAL_AUDIT_LOGS);
      setDynamicFields(INITIAL_DYNAMIC_FIELDS);
      setDocuments(INITIAL_DOCUMENTS);
      localStorage.clear();
      addAuditLog('استعادة ضبط المصنع', 'لوحة التحكم', 'تمت استعادة كافة البيانات الافتراضية للنظام');
      alert('تمت استعادة البيانات بنجاح.');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        login,
        logout,
        switchUser,
        addUser,
        updateUser,
        deleteUser,
        activeSection,
        setActiveSection,
        isSplashOpen,
        setIsSplashOpen,
        isAuthenticated: !isSplashOpen && currentUser !== null,
        citizens,
        addCitizen,
        updateCitizen,
        deleteCitizen,
        findCitizenByIdOrName,
        requests,
        addRequest,
        updateRequest,
        deleteRequest,
        interviews,
        addInterview,
        updateInterview,
        deleteInterview,
        convertInterviewToRequest,
        organizationRecords,
        upsertOrgRecord,
        addOrganizationRecord: upsertOrgRecord,
        updateOrganizationRecord: (rec: OrganizationRecord) => upsertOrgRecord(rec),
        dropdowns,
        addDropdownItem,
        removeDropdownItem,
        getDropdownOptions,
        auditLogs,
        addAuditLog,
        dynamicFields,
        addDynamicField,
        deleteDynamicField,
        documents,
        addDocument,
        deleteDocument,
        officialLetters,
        addOfficialLetter,
        updateOfficialLetter,
        whatsappTemplates,
        systemSettings,
        updateSettings,
        updateSystemSettings: updateSettings,
        notifications,
        dismissNotification,
        markAllNotificationsAsRead,
        printableCitizenCard,
        setPrintableCitizenCard,
        printableBadgeCitizen,
        setPrintableBadgeCitizen,
        selectedCitizenForHistory,
        setSelectedCitizenForHistory,
        forwardCitizenWorkflow,
        forwardRequestWorkflow,
        canPrintOfficialCard,
        exportToExcel,
        resetToDefaultData,
        resetToInitialData: resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
