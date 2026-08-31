import {
  User,
  Citizen,
  OfficeRequest,
  Interview,
  OrganizationRecord,
  DropdownItem,
  AuditLog,
  DynamicField,
  DocumentArchiveItem,
  WhatsAppTemplate,
  SystemSettings
} from '../types';

export const INITIAL_SETTINGS: SystemSettings = {
  appName: 'برنامج مكتب النائب علا الناشي',
  deputyName: 'النائب المهندسة علا عودة الناشي',
  deputyTitle: 'عضو مجلس النواب العراقي - الدورة الخامسة',
  province: 'محافظة ذي قار',
  officeAddress: 'الناصرية - شارع المحافظة القديم - مقابل ديوان المحافظة',
  hotline: '07801234567',
  logoUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&auto=format&fit=crop&q=80',
  parliamentEmblemUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Coat_of_arms_of_Iraq_%282008%E2%80%93present%29.svg/200px-Coat_of_arms_of_Iraq_%282008%E2%80%93present%29.svg.png',
  maintenanceMode: false,
  tickerNews: [
    'المكتب يستقبل المراجعين يومياً من الساعة 9 صباحاً وحتى 2 ظهراً',
    'تم إنجاز أكثر من 1,420 معاملة خلال الشهر الحالي في مختلف الدوائر والوزارات',
    'مقابلات النائب المباشرة يومي الاثنين والخميس حسب جدول الحجوزات المعتمد',
    'نظام الأرشفة الإلكتروني والربط السحابي قيد التشغيل المباشر لخدمة أهالي ذي قار'
  ],
  googleSheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  googleDriveFolderId: '1cpO4KynQ524Or32Xg2Es8WYA3VrhlUMc',
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycbz_sample_mock_api/exec',
  primaryThemeColor: 'amber'
};

export const INITIAL_USERS: User[] = [
  {
    User_ID: 'USR-001',
    Username: 'developer',
    Password: '123',
    Role: 'developer',
    RoleArabic: 'مطور النظام (صلاحية مطلقة)',
    Status: 'active',
    FullName: 'م. حيدر العراقي (مطور المنظومة)',
    Department: 'قسم تكنولوجيا المعلومات والبرمجة',
    CreatedAt: '2026-01-01'
  },
  {
    User_ID: 'USR-002',
    Username: 'director',
    Password: '123',
    Role: 'director',
    RoleArabic: 'مدير المكتب التنفيذي',
    Status: 'active',
    FullName: 'أ. صادق عبد الحسن الناشي',
    Department: 'إدارة مكتب النائب',
    CreatedAt: '2026-01-05'
  },
  {
    User_ID: 'USR-003',
    Username: 'admin',
    Password: '123',
    Role: 'admin',
    RoleArabic: 'مسؤول قسم الإدارة والمعاملات',
    Status: 'active',
    FullName: 'أ. أحمد حامد السعدون',
    Department: 'قسم الإدارة والمتابعة الحكومية',
    CreatedAt: '2026-01-10'
  },
  {
    User_ID: 'USR-004',
    Username: 'reception',
    Password: '123',
    Role: 'reception',
    RoleArabic: 'مسؤول قسم الاستعلامات والاستقبال',
    Status: 'active',
    FullName: 'م. كرار جبار الخفاجي',
    Department: 'قسم الاستعلامات والمراجعين',
    CreatedAt: '2026-01-12'
  },
  {
    User_ID: 'USR-005',
    Username: 'deputy',
    Password: '123',
    Role: 'deputy',
    RoleArabic: 'النائب علا الناشي',
    Status: 'active',
    FullName: 'النائب المهندسة علا عودة الناشي',
    Department: 'المكتب البرلماني المستقل',
    CreatedAt: '2026-01-01'
  },
  {
    User_ID: 'USR-006',
    Username: 'organization',
    Password: '123',
    Role: 'organization',
    RoleArabic: 'مسؤول قسم التنظيم والجمهور',
    Status: 'active',
    FullName: 'أ. حسين علي الموسوي',
    Department: 'قسم العلاقات والتنظيم',
    CreatedAt: '2026-01-15'
  },
  {
    User_ID: 'USR-007',
    Username: 'audit',
    Password: '123',
    Role: 'audit',
    RoleArabic: 'مسؤول قسم الرقابة والتشريع',
    Status: 'active',
    FullName: 'الحقوقي مصطفى ثامر الزيدي',
    Department: 'قسم الرقابة والتدقيق القانوني',
    CreatedAt: '2026-01-18'
  },
  {
    User_ID: 'USR-008',
    Username: 'machine',
    Password: '123',
    Role: 'machine',
    RoleArabic: 'مدير مكنة المكتب والطباعة',
    Status: 'active',
    FullName: 'م. سجاد كاظم البدري',
    Department: 'قسم مكنة وطباعة الكتب والمخاطبات',
    CreatedAt: '2026-01-20'
  }
];

export const INITIAL_DROPDOWNS: DropdownItem[] = [
  // Surnames / Clans (العشائر والألقاب)
  { Category: 'Surname', ItemValue: 'الناشي' },
  { Category: 'Surname', ItemValue: 'الخفاجي' },
  { Category: 'Surname', ItemValue: 'الحسيني' },
  { Category: 'Surname', ItemValue: 'السعدون' },
  { Category: 'Surname', ItemValue: 'الإبراهيمي' },
  { Category: 'Surname', ItemValue: 'الجابري' },
  { Category: 'Surname', ItemValue: 'التميمي' },
  { Category: 'Surname', ItemValue: 'الزيدي' },
  { Category: 'Surname', ItemValue: 'الساعدي' },
  { Category: 'Surname', ItemValue: 'العبادي' },
  { Category: 'Surname', ItemValue: 'الأسدي' },
  { Category: 'Surname', ItemValue: 'الشمري' },
  { Category: 'Surname', ItemValue: 'الكعبي' },
  { Category: 'Surname', ItemValue: 'المالكي' },
  { Category: 'Surname', ItemValue: 'البدري' },
  { Category: 'Surname', ItemValue: 'الموسوي' },
  { Category: 'Surname', ItemValue: 'الغزي' },
  { Category: 'Surname', ItemValue: 'العسكري' },

  // Entities (الجهات والوزارات المعنية)
  { Category: 'Entity', ItemValue: 'وزارة الداخلية' },
  { Category: 'Entity', ItemValue: 'هيئة الحشد الشعبي' },
  { Category: 'Entity', ItemValue: 'مدير ماء ذي قار' },
  { Category: 'Entity', ItemValue: 'محافظ ذي قار' },
  { Category: 'Entity', ItemValue: 'وزارة التربية' },
  { Category: 'Entity', ItemValue: 'وزارة الصحة / دائرة صحة ذي قار' },
  { Category: 'Entity', ItemValue: 'وزارة العمل والشؤون الاجتماعية (شبكة الحماية)' },
  { Category: 'Entity', ItemValue: 'وزارة النفط / شركة نفط ذي قار' },
  { Category: 'Entity', ItemValue: 'مؤسسة الشهداء' },
  { Category: 'Entity', ItemValue: 'مؤسسة السجناء السياسيين' },
  { Category: 'Entity', ItemValue: 'وزارة الدفاع' },
  { Category: 'Entity', ItemValue: 'مديرية مجاري ذي قار' },
  { Category: 'Entity', ItemValue: 'مديرية توزيع كهرباء ذي قار' },
  { Category: 'Entity', ItemValue: 'مديرية بلدية الناصرية' },
  { Category: 'Entity', ItemValue: 'مديرية زراعة ذي قار' },
  { Category: 'Entity', ItemValue: 'دائرة الرعاية الاجتماعية' },
  { Category: 'Entity', ItemValue: 'وزارة التعليم العالي / جامعة ذي قار' },

  // Ratings
  { Category: 'Rating', ItemValue: 'لائق' },
  { Category: 'Rating', ItemValue: 'غير لائق' },
  { Category: 'Rating', ItemValue: 'قلق' },
  { Category: 'Rating', ItemValue: 'غير محترم' },

  // Education
  { Category: 'Education', ItemValue: 'أمي / يقرأ ويكتب' },
  { Category: 'Education', ItemValue: 'ابتدائية' },
  { Category: 'Education', ItemValue: 'متوسطة' },
  { Category: 'Education', ItemValue: 'إعدادية' },
  { Category: 'Education', ItemValue: 'دبلوم فني' },
  { Category: 'Education', ItemValue: 'بكالوريوس' },
  { Category: 'Education', ItemValue: 'دبلوم عالي / ماجستير' },
  { Category: 'Education', ItemValue: 'دكتوراه' },

  // Jobs / Social segments
  { Category: 'Job', ItemValue: 'عاطل عن العمل' },
  { Category: 'Job', ItemValue: 'كاسب' },
  { Category: 'Job', ItemValue: 'موظف حكومي' },
  { Category: 'Job', ItemValue: 'متقاعد' },
  { Category: 'Job', ItemValue: 'طالب' },
  { Category: 'Job', ItemValue: 'كوادر طبية / صحية' },
  { Category: 'Job', ItemValue: 'معلم / تدريسي' },
  { Category: 'Job', ItemValue: 'مهندس' },
  { Category: 'Job', ItemValue: 'منتسب أمني / عسكري' },
  { Category: 'Job', ItemValue: 'ربة بيت' },
  { Category: 'Job', ItemValue: 'فلاح / مزارع' },

  // Districts (الأقضية)
  { Category: 'District', ItemValue: 'قضاء الناصرية' },
  { Category: 'District', ItemValue: 'قضاء الشطرة' },
  { Category: 'District', ItemValue: 'قضاء الرفاعي' },
  { Category: 'District', ItemValue: 'قضاء سوق الشيوخ' },
  { Category: 'District', ItemValue: 'قضاء الجبايش' },
  { Category: 'District', ItemValue: 'قضاء قلعة سكر' },
  { Category: 'District', ItemValue: 'قضاء الغراف' },
  { Category: 'District', ItemValue: 'قضاء الدواية' },
  { Category: 'District', ItemValue: 'قضاء الفهود' },
  { Category: 'District', ItemValue: 'قضاء الإصلاح' },
  { Category: 'District', ItemValue: 'قضاء البطحاء' },
  { Category: 'District', ItemValue: 'قضاء النصر' },
  { Category: 'District', ItemValue: 'قضاء سيد دخيل' },

  // Sub-Districts (النواحي والأحياء)
  { Category: 'SubDistrict', ItemValue: 'حي أور' },
  { Category: 'SubDistrict', ItemValue: 'حي الحسين' },
  { Category: 'SubDistrict', ItemValue: 'حي سومر' },
  { Category: 'SubDistrict', ItemValue: 'حي الشهداء' },
  { Category: 'SubDistrict', ItemValue: 'ناحية أور' },
  { Category: 'SubDistrict', ItemValue: 'ناحية الفضلية' },
  { Category: 'SubDistrict', ItemValue: 'ناحية المنار' },
  { Category: 'SubDistrict', ItemValue: 'ناحية كرمة بني سعيد' },
  { Category: 'SubDistrict', ItemValue: 'ناحية العكيكة' },
  { Category: 'SubDistrict', ItemValue: 'ناحية الطار' },
  { Category: 'SubDistrict', ItemValue: 'مركز القضاء' },
  { Category: 'SubDistrict', ItemValue: 'المنطقة الزراعية' },

  // Referral Sources (المصرح / المعرف)
  { Category: 'ReferralSource', ItemValue: 'مباشر بدون معرف' },
  { Category: 'ReferralSource', ItemValue: 'الشيخ أبو أحمد الخفاجي' },
  { Category: 'ReferralSource', ItemValue: 'الناشط الإعلامي حيدر السعدي' },
  { Category: 'ReferralSource', ItemValue: 'مكتب الشطرة الفرعي' },
  { Category: 'ReferralSource', ItemValue: 'رابطة شباب سوق الشيوخ' },
  { Category: 'ReferralSource', ItemValue: 'الحاج أبو علي الناشي' }
];

export const INITIAL_CITIZENS: Citizen[] = [
  {
    Citizen_ID: 'ONA-10492',
    FirstName: 'محمد',
    FatherName: 'جاسم',
    GrandFatherName: 'خلف',
    GreatGrandFatherName: 'علي',
    Surname: 'الخفاجي',
    FullName: 'محمد جاسم خلف علي الخفاجي',
    Phone1: '07812345678',
    Phone2: '07709876543',
    Job: 'كاسب',
    Education: 'دبلوم فني',
    Gender: 'ذكر',
    Rating: 'لائق',
    District: 'قضاء الناصرية',
    SubDistrict: 'حي سومر',
    ReferralSource: 'الشيخ أبو أحمد الخفاجي',
    CreatedAt: '2026-01-15 10:30',
    CreatedBy: 'موظف الاستعلامات (م. كرار)'
  },
  {
    Citizen_ID: 'ONA-10493',
    FirstName: 'فاطمة',
    FatherName: 'كريم',
    GrandFatherName: 'محسن',
    GreatGrandFatherName: 'راضي',
    Surname: 'الساعدي',
    FullName: 'فاطمة كريم محسن راضي الساعدي',
    Phone1: '07802345671',
    Job: 'معلم / تدريسي',
    Education: 'بكالوريوس',
    Gender: 'أنثى',
    Rating: 'لائق',
    District: 'قضاء الشطرة',
    SubDistrict: 'مركز القضاء',
    ReferralSource: 'مكتب الشطرة الفرعي',
    CreatedAt: '2026-01-18 11:15',
    CreatedBy: 'موظف الاستعلامات (م. كرار)'
  },
  {
    Citizen_ID: 'ONA-10494',
    FirstName: 'حسين',
    FatherName: 'فاضل',
    GrandFatherName: 'عباس',
    GreatGrandFatherName: 'طاهر',
    Surname: 'التميمي',
    FullName: 'حسين فاضل عباس طاهر التميمي',
    Phone1: '07712398765',
    Phone2: '07823344556',
    Job: 'عاطل عن العمل',
    Education: 'إعدادية',
    Gender: 'ذكر',
    Rating: 'لائق',
    District: 'قضاء سوق الشيوخ',
    SubDistrict: 'ناحية الفضلية',
    ReferralSource: 'رابطة شباب سوق الشيوخ',
    CreatedAt: '2026-01-20 09:45',
    CreatedBy: 'موظف الاستعلامات (م. كرار)'
  },
  {
    Citizen_ID: 'ONA-10495',
    FirstName: 'عمار',
    FatherName: 'نعيم',
    GrandFatherName: 'شاكر',
    GreatGrandFatherName: 'مهدي',
    Surname: 'الزيدي',
    FullName: 'عمار نعيم شاكر مهدي الزيدي',
    Phone1: '07809988776',
    Job: 'موظف حكومي',
    Education: 'بكالوريوس',
    Gender: 'ذكر',
    Rating: 'قلق',
    District: 'قضاء الرفاعي',
    SubDistrict: 'مركز القضاء',
    ReferralSource: 'مباشر بدون معرف',
    CreatedAt: '2026-01-22 12:00',
    CreatedBy: 'موظف الاستعلامات (م. كرار)'
  },
  {
    Citizen_ID: 'ONA-10496',
    FirstName: 'زينب',
    FatherName: 'رحيم',
    GrandFatherName: 'عبد',
    GreatGrandFatherName: 'سلمان',
    Surname: 'الجبوري',
    FullName: 'زينب رحيم عبد سلمان الجبوري',
    Phone1: '07723456789',
    Job: 'ربة بيت',
    Education: 'متوسطة',
    Gender: 'أنثى',
    Rating: 'لائق',
    District: 'قضاء الجبايش',
    SubDistrict: 'ناحية المنار',
    ReferralSource: 'الحاج أبو علي الناشي',
    CreatedAt: '2026-01-25 10:00',
    CreatedBy: 'موظف الاستعلامات (م. كرار)'
  }
];

export const INITIAL_REQUESTS: OfficeRequest[] = [
  {
    Request_ID: 'REQ-2026-081',
    Citizen_ID: 'ONA-10492',
    CitizenName: 'محمد جاسم خلف علي الخفاجي',
    CitizenPhone: '07812345678',
    Entity: 'وزارة العمل والشؤون الاجتماعية (شبكة الحماية)',
    RequestStatus: 'مستلم',
    ProcessingStatus: 'مرسل إلى الوزارة/الهيئة',
    Priority: 'عاجل',
    Details: 'طلب شمول ببرنامج الحماية الاجتماعية لمعيل أسرة متعففة من ذوي الدخل المحدود يعاني من عجز صحي.',
    AttachmentRequest: 'طلب_رسمي_الخفاجي_01.pdf',
    AttachmentResponse: 'كتاب_إحالة_وزارة_العمل_رقم_342.pdf',
    CreatedAt: '2026-01-15 10:40',
    CreatedBy: 'موظف الإدارة (أ. أحمد)',
    DeputyNotes: 'تم توجيه كتاب رسمي بموافقة معالي الوزير والمتابعة مع دائرة الحماية الاجتماعية بذي قار.'
  },
  {
    Request_ID: 'REQ-2026-082',
    Citizen_ID: 'ONA-10493',
    CitizenName: 'فاطمة كريم محسن راضي الساعدي',
    CitizenPhone: '07802345671',
    Entity: 'وزارة التربية',
    RequestStatus: 'مستلم',
    ProcessingStatus: 'منجز',
    Priority: 'عام',
    Details: 'طلب نقل ملاك تدريسي من تربية الشطرة إلى تربية الناصرية مراعاة للظرف العائلي والصحي الخاص.',
    AttachmentRequest: 'معاملة_نقل_الساعدي.pdf',
    AttachmentResponse: 'أمر_إداري_نقل_رقم_8892.pdf',
    CreatedAt: '2026-01-18 11:30',
    CreatedBy: 'موظف الإدارة (أ. أحمد)',
    DeputyNotes: 'تم إصدار الأمر الإداري بعد مفاتحة المدير العام لتربية ذي قار ومتابعة المكنة.'
  },
  {
    Request_ID: 'REQ-2026-083',
    Citizen_ID: 'ONA-10494',
    CitizenName: 'حسين فاضل عباس طاهر التميمي',
    CitizenPhone: '07712398765',
    Entity: 'وزارة النفط / شركة نفط ذي قار',
    RequestStatus: 'مستلم',
    ProcessingStatus: 'قيد التدقيق',
    Priority: 'عاجل',
    Details: 'طلب تشغيل خريجين في المشاريع النفطية وحقول الغراف والناصرية وفق استحقاقات قضاء سوق الشيوخ.',
    AttachmentRequest: 'طلب_تشغيل_التميمي.pdf',
    CreatedAt: '2026-01-20 10:00',
    CreatedBy: 'موظف الإدارة (أ. أحمد)',
    DeputyNotes: 'أحيل إلى شعبة المتابعة لإدراجه ضمن قوائم التشغيل المركزية.'
  },
  {
    Request_ID: 'REQ-2026-084',
    Citizen_ID: 'ONA-10495',
    CitizenName: 'عمار نعيم شاكر مهدي الزيدي',
    CitizenPhone: '07809988776',
    Entity: 'مدير ماء ذي قار',
    RequestStatus: 'مستلم',
    ProcessingStatus: 'بانتظار الموافقة',
    Priority: 'عام',
    Details: 'شكوى حول انقطاع مياه الإسالة عن مجمع سكني في قضاء الرفاعي وطلب مد شبكة مائية بديلة.',
    AttachmentRequest: 'شكوى_شبكة_الماء_الرفاعي.pdf',
    CreatedAt: '2026-01-22 12:30',
    CreatedBy: 'موظف الإدارة (أ. أحمد)',
    DeputyNotes: 'تم الاتصال هاتفياً بمدير فرع ماء الرفاعي وإرسال لجنة صيانة للموقع.'
  },
  {
    Request_ID: 'REQ-2026-085',
    Citizen_ID: 'ONA-10496',
    CitizenName: 'زينب رحيم عبد سلمان الجبوري',
    CitizenPhone: '07723456789',
    Entity: 'مؤسسة الشهداء',
    RequestStatus: 'مستلم',
    ProcessingStatus: 'تم الطباعة',
    Priority: 'خاص جداً',
    Details: 'متابعة تخصيص قطعة أرض لذوي الشهداء واستكمال الإجراءات مع بلدية الجبايش وعقارات الدولة.',
    AttachmentRequest: 'ملف_شهداء_الجبايش.pdf',
    CreatedAt: '2026-01-25 10:20',
    CreatedBy: 'موظف الإدارة (أ. أحمد)',
    DeputyNotes: 'متابعة شخصية من قبل النائب مع مدير بلدية الجبايش.'
  }
];

export const INITIAL_INTERVIEWS: Interview[] = [
  {
    Interview_ID: 'INT-2026-042',
    Citizen_ID: 'ONA-10492',
    FullName: 'محمد جاسم خلف علي الخفاجي',
    Subject: 'مقابلة خاصة لبحث أزمة الخدمات والمياه في قرى جنوب الناصرية ومطالب أهالي المنطقة',
    Phone1: '07812345678',
    Phone2: '07709876543',
    Address: 'قضاء الناصرية - حي سومر',
    Referrer: 'الشيخ أبو أحمد الخفاجي',
    InterviewDate: '2026-02-02',
    InterviewTime: '11:00 صباحاً',
    Priority: 'عاجل',
    Status: 'تمت المقابلة',
    DeputyNotes: 'إحالة للإدارة فوراً مع إعداد كتاب رسمي موجه للسيد المحافظ ومديرية المجاري والماء.',
    Outcome: 'تمت المقابلة بنجاح وإصدار التوجيهات اللازمة للمتابعة والتنفيذ.',
    ConvertedToRequest: true,
    CreatedAt: '2026-01-28'
  },
  {
    Interview_ID: 'INT-2026-043',
    Citizen_ID: 'ONA-10494',
    FullName: 'حسين فاضل عباس طاهر التميمي',
    Subject: 'بحث فرص تشغيل خريجي المعاهد الفنية في مشاريع محافظة ذي قار',
    Phone1: '07712398765',
    Address: 'قضاء سوق الشيوخ - ناحية الفضلية',
    Referrer: 'رابطة شباب سوق الشيوخ',
    InterviewDate: '2026-02-05',
    InterviewTime: '12:30 ظهراً',
    Priority: 'خاص جداً',
    Status: 'مجدولة',
    DeputyNotes: 'توجيه للمكنة لتجهيز قائمة بالخريجين وإرفاق السير الذاتية.',
    Outcome: 'بانتظار موعد المقابلة.',
    ConvertedToRequest: false,
    CreatedAt: '2026-01-30'
  },
  {
    Interview_ID: 'INT-2026-044',
    Citizen_ID: 'ONA-10496',
    FullName: 'زينب رحيم عبد سلمان الجبوري',
    Subject: 'استحقاقات عوائل الشهداء في قضاء الجبايش ومعاملات قطع الأراضي',
    Phone1: '07723456789',
    Address: 'قضاء الجبايش - ناحية المنار',
    Referrer: 'الحاج أبو علي الناشي',
    InterviewDate: '2026-02-09',
    InterviewTime: '10:00 صباحاً',
    Priority: 'عاجل',
    Status: 'مجدولة',
    DeputyNotes: 'متابعة شخصية من قبل النائب مع مدير بلدية الجبايش ودائرة التسجيل العقاري.',
    Outcome: 'بانتظار إجراء المقابلة.',
    ConvertedToRequest: false,
    CreatedAt: '2026-02-01'
  }
];

export const INITIAL_ORGANIZATION: OrganizationRecord[] = [
  {
    Org_ID: 'ORG-001',
    Citizen_ID: 'ONA-10492',
    FullName: 'محمد جاسم خلف علي الخفاجي',
    OrgRating: 'مؤيد',
    Notes: 'ناشط اجتماعي وله ثقل عشائري إيجابي في منطقة حي سومر، مساند للبرنامج الخدمي للنائب.',
    Referrer: 'الشيخ أبو أحمد الخفاجي',
    UpdatedAt: '2026-01-20'
  },
  {
    Org_ID: 'ORG-002',
    Citizen_ID: 'ONA-10493',
    FullName: 'فاطمة كريم محسن راضي الساعدي',
    OrgRating: 'مؤيد',
    Notes: 'ناشطة في الوسط التربوي والتعليمي بالشطرة، مؤيدة ومشاركة في الفعاليات الثقافية.',
    Referrer: 'مكتب الشطرة الفرعي',
    UpdatedAt: '2026-01-22'
  },
  {
    Org_ID: 'ORG-003',
    Citizen_ID: 'ONA-10494',
    FullName: 'حسين فاضل عباس طاهر التميمي',
    OrgRating: 'محايد',
    Notes: 'ممثل مجموعة خريجين، يحتاج إلى دعم في ملف التشغيل والتوظيف لتعزيز التفاعل الإيجابي.',
    Referrer: 'رابطة شباب سوق الشيوخ',
    UpdatedAt: '2026-01-25'
  },
  {
    Org_ID: 'ORG-004',
    Citizen_ID: 'ONA-10495',
    FullName: 'عمار نعيم شاكر مهدي الزيدي',
    OrgRating: 'ضعيف',
    Notes: 'لديه تساؤلات وملاحظات خدمية متكررة، يحتاج تواصل مباشر لشرح الإنجازات والجهود البرلمانية.',
    Referrer: 'مباشر بدون معرف',
    UpdatedAt: '2026-01-28'
  },
  {
    Org_ID: 'ORG-005',
    Citizen_ID: 'ONA-10496',
    FullName: 'زينب رحيم عبد سلمان الجبوري',
    OrgRating: 'مؤيد',
    Notes: 'من العوائل الكريمة المجاهدة في هور الجبايش، مؤيدة بقوة للمكتب والجهود المبذولة.',
    Referrer: 'الحاج أبو علي الناشي',
    UpdatedAt: '2026-02-01'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    Log_ID: 'LOG-9901',
    Timestamp: '2026-01-15 10:30:12',
    User: 'م. كرار جبار الخفاجي (استعلامات)',
    Action: 'إضافة مراجع جديد',
    Section: 'الاستعلامات',
    Details: 'تسجيل المراجع محمد جاسم خلف الخفاجي وتوليد الرقم التعريفي ONA-10492'
  },
  {
    Log_ID: 'LOG-9902',
    Timestamp: '2026-01-15 10:40:45',
    User: 'أ. أحمد حامد السعدون (إدارة)',
    Action: 'إنشاء طلب إداري عاجل',
    Section: 'الإدارة',
    Details: 'إضافة طلب REQ-2026-081 موجه إلى وزارة العمل والشؤون الاجتماعية وإطلاق تنبيه عاجل'
  },
  {
    Log_ID: 'LOG-9903',
    Timestamp: '2026-01-20 14:10:00',
    User: 'النائب المهندسة علا عودة الناشي',
    Action: 'تسجيل توجيه وملاحظات مقابلة',
    Section: 'مقابلات النائب',
    Details: 'تأشير قرار المقابلة INT-2026-042 بالإحالة الفورية للإدارة والمتابعة مع المحافظ'
  },
  {
    Log_ID: 'LOG-9904',
    Timestamp: '2026-01-22 09:15:30',
    User: 'أ. صادق عبد الحسن الناشي (مدير المكتب)',
    Action: 'طباعة بطاقة المعلومات الاحترافية',
    Section: 'البحث الشامل',
    Details: 'استخراج وطباعة بطاقة المعلومات الرسمية الشاملة للمواطن ONA-10492'
  },
  {
    Log_ID: 'LOG-9905',
    Timestamp: '2026-01-25 11:20:00',
    User: 'م. حيدر العراقي (مطور المنظومة)',
    Action: 'تحديث الحقول الديناميكية',
    Section: 'لوحة التحكم',
    Details: 'إضافة حقل ديناميكي جديد في قسم التنظيم: "رقم بطاقة الناخب"'
  }
];

export const INITIAL_DYNAMIC_FIELDS: DynamicField[] = [
  {
    id: 'DF-01',
    section: 'reception',
    sectionArabic: 'قسم الاستعلامات',
    fieldName: 'voterCardNumber',
    fieldLabel: 'رقم بطاقة الناخب البايومترية',
    fieldType: 'text',
    required: false
  },
  {
    id: 'DF-02',
    section: 'admin',
    sectionArabic: 'قسم الإدارة',
    fieldName: 'externalLetterNo',
    fieldLabel: 'رقم وتاريخ الكتاب الصادر الخارجي',
    fieldType: 'text',
    required: false
  },
  {
    id: 'DF-03',
    section: 'interviews',
    sectionArabic: 'قسم مقابلات النائب',
    fieldName: 'interviewHall',
    fieldLabel: 'قاعة المقابلة المعتمدة',
    fieldType: 'select',
    options: ['القاعة الرئيسية للمكتب', 'المقر البرلماني الفرعي - الشطرة', 'اللقاء الميداني'],
    required: false
  },
  {
    id: 'DF-04',
    section: 'organization',
    sectionArabic: 'قسم التنظيم',
    fieldName: 'volunteerCapacity',
    fieldLabel: 'استعداد العمل التطوعي الميداني',
    fieldType: 'select',
    options: ['مستعد كلياً', 'مستعد جزئياً', 'غير متفرغ'],
    required: false
  }
];

export const INITIAL_DOCUMENTS: DocumentArchiveItem[] = [
  {
    Doc_ID: 'DOC-1001',
    Citizen_ID: 'ONA-10492',
    CitizenName: 'محمد جاسم خلف علي الخفاجي',
    Title: 'الطلب المقدم لشبكة الحماية الاجتماعية مع التقارير الطبية',
    Category: 'طلب مقدم',
    FileUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=80',
    FileType: 'pdf',
    FileSize: '1.8 MB',
    UploadedAt: '2026-01-15 10:35',
    UploadedBy: 'أ. أحمد حامد السعدون'
  },
  {
    Doc_ID: 'DOC-1002',
    Citizen_ID: 'ONA-10492',
    CitizenName: 'محمد جاسم خلف علي الخفاجي',
    Title: 'كتاب الموافقة والإحالة الصادر من مكتب النائب برقم 441',
    Category: 'كتاب رسمي',
    FileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    FileType: 'pdf',
    FileSize: '2.4 MB',
    UploadedAt: '2026-01-16 12:00',
    UploadedBy: 'م. سجاد كاظم البدري (المكنة)'
  },
  {
    Doc_ID: 'DOC-1003',
    Citizen_ID: 'ONA-10493',
    CitizenName: 'فاطمة كريم محسن راضي الساعدي',
    Title: 'أمر إداري صادر عن المديرية العامة لتربية ذي قار',
    Category: 'كتاب رسمي',
    FileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    FileType: 'image',
    FileSize: '950 KB',
    UploadedAt: '2026-01-18 11:45',
    UploadedBy: 'أ. أحمد حامد السعدون'
  },
  {
    Doc_ID: 'DOC-1004',
    Citizen_ID: 'ONA-10494',
    CitizenName: 'حسين فاضل عباس طاهر التميمي',
    Title: 'وثيقة تخرج دبلوم فني وسيرة ذاتية لخريجي سوق الشيوخ',
    Category: 'مستمسكات',
    FileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    FileType: 'pdf',
    FileSize: '3.1 MB',
    UploadedAt: '2026-01-20 10:15',
    UploadedBy: 'موظف الاستعلامات'
  }
];

export const INITIAL_WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'TMP-01',
    title: 'إشعار استلام الطلب وتسجيل الرقم التعريفي',
    category: 'استلام طلب',
    text: 'الأخ/الأخت العزيز/ة {name}، تحية طيبة.\nتم بعون الله استلام وتوثيق طلبكم لدى مكتب النائب المهندسة علا عودة الناشي.\nرقمكم التعريفي الثابت: {citizen_id}\nرقم الطلب الإداري: {request_id}\nنحن في خدمتكم وستتم متابعة الإجراءات وموافاتكم بالنتائج أولاً بأول.'
  },
  {
    id: 'TMP-02',
    title: 'إشعار إنجاز المعاملة وصدور الكتاب الرسمي',
    category: 'إنجاز معاملة',
    text: 'الأخ/الأخت {name} المحترم/ة،\nيسر مكتب النائب المهندسة علا عودة الناشي إعلامكم بأنه تم إنجاز طلبكم ومفاتحة الجهة المعنية ({entity}) بنجاح.\nيرجى مراجعة المكتب أو مراجعة الجهة المعنية لاستلام النتيجة مع التقدير.'
  },
  {
    id: 'TMP-03',
    title: 'تحديد موعد مقابلة مباشرة مع النائب',
    category: 'تحديد مقابلة',
    text: 'الأخ/الأخت {name} المحترم/ة،\nنود إعلامكم بأنه تم تحديد موعد مقابلتكم المباشرة مع النائب المهندسة علا عودة الناشي.\nالموعد: {date} في تمام الساعة {time}.\nالمكان: مقر مكتب النائب - الناصرية.\nيرجى الحضور في الموعد المحدد مع جلب كافة الأوليات.'
  },
  {
    id: 'TMP-04',
    title: 'تحديث موقف المعاملة وقيد التدقيق',
    category: 'تحديث موقف',
    text: 'الأخ/الأخت {name}،\nنفيدكم علماً بأن معاملتكم المسجلة بالرقم {request_id} قيد المتابعة والتدقيق الإداري حالياً لدى الجهات الرسمية، وسنوافيكم فور صدور أي توجيه رسمي.'
  }
];
