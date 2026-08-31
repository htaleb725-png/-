import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Citizen, OfficeRequest, Interview, OrganizationRecord, OfficialLetter, AuditLog } from '../types';

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Provider with workspace scopes
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/spreadsheets.readonly');
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/drive.readonly');
provider.setCustomParameters({
  prompt: 'consent',
  access_type: 'offline'
});

let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Auth listener
export const initGoogleAuth = (
  onSuccess?: (user: User, token: string) => void,
  onFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onSuccess) onSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onFailure) onFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onFailure) onFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('لم يتم استلام مفتاح الوصول (Access Token) من حساب Google');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-in failed:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const googleSignOut = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export interface DriveSpreadsheetItem {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}

/**
 * List spreadsheets available in user's Google Drive
 */
export const listGoogleDriveSpreadsheets = async (token: string): Promise<DriveSpreadsheetItem[]> => {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
  const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime,webViewLink)&orderBy=modifiedTime desc&pageSize=30`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `فشل في استعراض ملفات Google Drive (${response.status})`);
  }

  const data = await response.json();
  return data.files || [];
};

/**
 * Create a fully structured and styled Google Spreadsheet for the office
 */
export const createOfficeGoogleSpreadsheet = async (
  token: string,
  title: string = 'قاعدة بيانات مكتب النائب علا الناشي - المركزية'
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  const sheetDefinitions = [
    { title: 'سجل_المراجعين_Citizens' },
    { title: 'طلبات_الإدارة_Requests' },
    { title: 'مقابلات_النائب_Interviews' },
    { title: 'الموقف_الجماهيري_Organization' },
    { title: 'الكتب_الرسمية_OfficialLetters' },
    { title: 'سجل_الرقابة_AuditLogs' },
    { title: 'إعدادات_القوائم_Dropdowns' }
  ];

  const requestBody = {
    properties: {
      title,
      locale: 'ar_IQ',
      autoRecalc: 'ON_CHANGE',
      defaultFormat: {
        textFormat: {
          fontFamily: 'Cairo'
        }
      }
    },
    sheets: sheetDefinitions.map(s => ({
      properties: {
        title: s.title,
        rightToLeft: true,
        gridProperties: {
          frozenRowCount: 1
        }
      }
    }))
  };

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `فشل في إنشاء جدول Google Sheets (${response.status})`);
  }

  const data = await response.json();
  return {
    spreadsheetId: data.spreadsheetId,
    spreadsheetUrl: data.spreadsheetUrl
  };
};

/**
 * Populate or update headers and data in Google Sheets
 */
export const syncAllDataToGoogleSheets = async (
  token: string,
  spreadsheetId: string,
  data: {
    citizens: Citizen[];
    requests: OfficeRequest[];
    interviews: Interview[];
    organizationRecords: OrganizationRecord[];
    officialLetters: OfficialLetter[];
    auditLogs: AuditLog[];
  }
): Promise<{ success: boolean; updatedSheets: number }> => {
  const sheetsPayload = [
    {
      range: 'سجل_المراجعين_Citizens!A1:R',
      headers: [
        'الرقم التعريفي', 'الاسم الأول', 'اسم الأب', 'اسم الجد', 'اسم والد الجد',
        'اللقب / العشيرة', 'الاسم الكامل الرباعي', 'الهاتف الرئيسي', 'الهاتف الثانوي',
        'الجنس', 'المهنة / العمل', 'التحصيل الدراسي', 'التقييم الجماهيري', 'القضاء',
        'الناحية / الحي', 'جهة التزكية / المعرف', 'تاريخ التسجيل', 'مسؤول الإدخال'
      ],
      rows: data.citizens.map(c => [
        c.Citizen_ID, c.FirstName, c.FatherName, c.GrandFatherName, c.GreatGrandFatherName,
        c.Surname, c.FullName, c.Phone1, c.Phone2 || '', c.Gender, c.Job, c.Education,
        c.Rating, c.District, c.SubDistrict, c.ReferralSource || '', c.CreatedAt, c.CreatedBy || 'الاستعلامات'
      ])
    },
    {
      range: 'طلبات_الإدارة_Requests!A1:N',
      headers: [
        'رقم الطلب', 'الرقم التعريفي للمواطن', 'اسم المواطن', 'رقم الهاتف', 'الجهة المعنية',
        'حالة المعاملة', 'المرحلة الإجرائية', 'درجة الأسبقية', 'تفاصيل الطلب',
        'مرفق كتاب الطلب', 'مرفق كتاب الإجابة', 'توجيهات وملاحظات النائب', 'تاريخ المعاملة', 'الموظف المسؤول'
      ],
      rows: data.requests.map(r => [
        r.Request_ID, r.Citizen_ID, r.CitizenName, r.CitizenPhone, r.Entity,
        r.RequestStatus, r.ProcessingStatus, r.Priority, r.Details,
        r.AttachmentRequest || '', r.AttachmentResponse || '', r.DeputyNotes || '',
        r.CreatedAt, r.CreatedBy || 'الإدارة'
      ])
    },
    {
      range: 'مقابلات_النائب_Interviews!A1:O',
      headers: [
        'رمز المقابلة', 'الرقم التعريفي', 'اسم المواطن', 'موضوع المقابلة', 'الهاتف 1', 'الهاتف 2',
        'السكن / العنوان', 'جهة التزكية', 'تاريخ المقابلة', 'الوقت', 'الأسبقية', 'حالة المقابلة',
        'توجيه النائب', 'النتيجة والإجراء المتخذ', 'تم تحويلها لطلب رسمي'
      ],
      rows: data.interviews.map(i => [
        i.Interview_ID, i.Citizen_ID, i.FullName, i.Subject, i.Phone1, i.Phone2 || '',
        i.Address, i.Referrer || '', i.InterviewDate, i.InterviewTime || '',
        i.Priority, i.Status, i.DeputyNotes || '', i.Outcome || '', i.ConvertedToRequest ? 'نعم' : 'لا'
      ])
    },
    {
      range: 'الموقف_الجماهيري_Organization!A1:L',
      headers: [
        'الرقم التعريفي', 'الاسم الكامل', 'القضاء', 'الناحية', 'رقم الهاتف',
        'التقييم الجماهيري', 'نوع التأثير والشخصية', 'نقاط التقييم', 'المركز الانتخابي',
        'رقم المحطة', 'ملاحظات المنسق', 'آخر تحديث'
      ],
      rows: data.organizationRecords.map(o => [
        o.Citizen_ID, o.FullName, o.District, o.SubDistrict, o.Phone1,
        o.OrgRating, o.InfluenceType, o.EvaluationPoints, o.ElectionCenter,
        o.StationNumber, o.Notes || '', o.UpdatedAt
      ])
    },
    {
      range: 'الكتب_الرسمية_OfficialLetters!A1:J',
      headers: [
        'رمز الكتاب', 'العدد / الرقم الإداري', 'التاريخ', 'الجهة الموجه إليها',
        'الموضوع', 'نص الكتاب والتوجيه', 'الرقم التعريفي للمواطن', 'اسم المواطن', 'الحالة', 'الطباع / المنشئ'
      ],
      rows: data.officialLetters.map(l => [
        l.Letter_ID, l.LetterNumber, l.LetterDate, l.Recipient,
        l.Subject, l.Body, l.Citizen_ID || '', l.CitizenName || '', l.Status, l.ClerkName
      ])
    },
    {
      range: 'سجل_الرقابة_AuditLogs!A1:F',
      headers: ['رمز القيد', 'التاريخ والوقت', 'اسم المستخدم', 'نوع الإجراء', 'القسم / الوحدة', 'التفاصيل'],
      rows: data.auditLogs.map(a => [
        a.Log_ID, a.Timestamp, a.UserName, a.ActionType, a.Department, a.Details
      ])
    }
  ];

  // Execute batch update of values
  const valueRanges = sheetsPayload.map(sp => ({
    range: sp.range,
    values: [sp.headers, ...sp.rows]
  }));

  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: valueRanges
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `فشل في تحديث بيانات Google Sheets (${response.status})`);
  }

  return { success: true, updatedSheets: sheetsPayload.length };
};

/**
 * Append a single row to a sheet in Google Sheets
 */
export const appendRowToGoogleSheet = async (
  token: string,
  spreadsheetId: string,
  sheetTabName: string,
  rowValues: any[]
): Promise<boolean> => {
  const encodedRange = encodeURIComponent(`${sheetTabName}!A:Z`);
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [rowValues]
      })
    }
  );

  return response.ok;
};
