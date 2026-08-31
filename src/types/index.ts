export type UserRole = 
  | 'developer'          // مطور النظام
  | 'director'           // مدير المكتب
  | 'admin'              // موظف الإدارة
  | 'reception'          // موظف الاستعلامات
  | 'deputy'             // النائب
  | 'organization'       // موظف التنظيم
  | 'machine'            // مدير مكنة المكتب
  | 'archive'            // مسؤول الأرشيف
  | 'audit'              // مسؤول الرقابة والتشريع
  | 'reception_officer'
  | 'admin_officer'
  | 'interviews_officer'
  | 'organization_officer'
  | 'machine_officer';

export interface User {
  User_ID: string;
  Username: string;
  Password?: string;
  Role: UserRole;
  RoleArabic: string;
  Status?: 'active' | 'frozen';
  Active?: boolean;
  FullName: string;
  Department: string;
  Avatar?: string;
  CreatedAt?: string;
}

export type CitizenRating = 'لائق' | 'غير لائق' | 'قلق' | 'غير محترم' | string;
export type Gender = 'ذكر' | 'أنثى';
export type OrgRating = 'مؤيد' | 'محايد' | 'ضعيف' | 'متردد' | 'معارض' | 'كادر قيادي' | 'شخصية مؤثرة' | string;

export interface Citizen {
  Citizen_ID: string;
  FirstName: string;
  FatherName: string;
  GrandFatherName: string;
  GreatGrandFatherName: string;
  Surname: string;
  FullName: string;
  Phone1: string;
  Phone2?: string;
  Job: string;
  Education: string;
  Gender: Gender;
  Rating: CitizenRating;
  District: string;
  SubDistrict: string;
  ReferralSource?: string;
  CreatedAt: string;
  CreatedBy?: string;
  CustomFields?: Record<string, string | number | boolean>;
  PhotoUrl?: string;
}

export type RequestStatus = 'مستلم' | 'غير مستلم' | 'معاد' | 'غير مستوفي للشروط' | 'خاص';
export type ProcessingStatus = 'منجز' | 'قيد التدقيق' | 'مرفوض' | 'تم الطباعة' | 'مرسل إلى الوزارة/الهيئة' | 'بانتظار الموافقة';
export type Priority = 'عاجل' | 'عام' | 'خاص جداً';

export interface OfficeRequest {
  Request_ID: string;
  Citizen_ID: string;
  CitizenName: string;
  CitizenPhone?: string;
  Entity: string; // الجهة المعنية
  RequestStatus: RequestStatus;
  ProcessingStatus: ProcessingStatus;
  Priority: Priority;
  Details: string;
  AttachmentRequest?: string;  // الطلب المقدم
  AttachmentResponse?: string; // الطلب المستلم / كتاب الإجابة
  CreatedAt: string;
  CreatedBy: string;
  DeputyNotes?: string;
  ExecutiveAction?: string;
  CustomFields?: Record<string, string | number | boolean>;
}

export type InterviewStatus = 'مجدولة' | 'تمت المقابلة' | 'مؤجلة' | 'ملغاة' | 'تمت الإحالة';
export type DeputyDirective = 'إحالة للإدارة' | 'هامش مباشر' | 'متابعة شخصية' | 'غير مستوفي للشروط' | 'توجيه للمكنة' | string;

export interface Interview {
  Interview_ID: string;
  Citizen_ID: string;
  FullName: string;
  Subject: string;
  Phone1: string;
  Phone2?: string;
  Address: string;
  Referrer?: string;
  InterviewDate: string;
  InterviewTime?: string;
  Priority: 'عادي' | 'عاجل' | 'خاص جداً';
  Status: InterviewStatus;
  DeputyNotes?: string;
  Outcome?: string;
  ConvertedToRequest?: boolean;
  CreatedAt?: string;
}

export interface OrganizationRecord {
  Org_ID?: string;
  Citizen_ID: string;
  FullName: string;
  District?: string;
  SubDistrict?: string;
  Phone1?: string;
  OrgRating: OrgRating;
  InfluenceType?: string;
  EvaluationPoints?: number;
  ElectionCenter?: string;
  StationNumber?: string;
  Notes?: string;
  Referrer?: string;
  CustomFields?: Record<string, string | number | boolean>;
  UpdatedAt?: string;
}

export type DropdownCategory = 
  | 'Surname' 
  | 'Entity' 
  | 'Rating' 
  | 'Job' 
  | 'Education' 
  | 'District' 
  | 'SubDistrict' 
  | 'ReferralSource';

export interface DropdownItem {
  id?: string;
  Category: DropdownCategory | string;
  ItemValue: string;
}

export interface AuditLog {
  Log_ID: string;
  Timestamp: string;
  UserName?: string;
  User?: string;
  ActionType?: string;
  Action?: string;
  Department?: string;
  Section?: string;
  Details: string;
  Ip?: string;
}

export interface DynamicField {
  id: string;
  section: 'reception' | 'admin' | 'interviews' | 'organization' | 'general';
  sectionArabic: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: 'text' | 'number' | 'date' | 'select' | 'file';
  options?: string[];
  required: boolean;
}

export interface DocumentRecord {
  Doc_ID: string;
  Citizen_ID: string;
  CitizenName: string;
  Title: string;
  Category: 'طلب مقدم' | 'كتاب رسمي' | 'هوية وبطاقة وطنية' | 'مستمسكات' | 'مستمسكات ثبوتية' | 'كتاب رسمي صادر' | 'أخرى' | string;
  FileUrl: string;
  FileType: 'image' | 'pdf' | 'doc' | string;
  FileSize: string;
  UploadedAt: string;
  UploadedBy: string;
}

export type DocumentArchiveItem = DocumentRecord;

export interface OfficialLetter {
  Letter_ID: string;
  LetterNumber: string;
  LetterDate: string;
  Recipient: string;
  Subject: string;
  Body: string;
  Citizen_ID?: string;
  CitizenName?: string;
  Status: string;
  ClerkName: string;
}

export interface WhatsAppTemplate {
  id: string;
  title: string;
  text: string;
  category: 'استلام طلب' | 'إنجاز معاملة' | 'تحديد مقابلة' | 'تحديث موقف' | 'تنويه عام';
}

export interface SystemSettings {
  appName: string;
  deputyName: string;
  deputyTitle: string;
  province: string;
  officeAddress: string;
  hotline: string;
  logoUrl: string;
  parliamentEmblemUrl: string;
  maintenanceMode: boolean;
  tickerNews: string[];
  googleSheetId?: string;
  activeGoogleSheetId?: string;
  activeGoogleSheetUrl?: string;
  googleDriveFolderId?: string;
  appsScriptUrl?: string;
  googleAppsScriptUrl?: string;
  primaryThemeColor?: string;
}
