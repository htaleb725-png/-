import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileSpreadsheet, 
  Copy, 
  Check, 
  FileCode, 
  Database,
  ExternalLink,
  RefreshCw,
  PlusCircle,
  FolderOpen,
  AlertTriangle,
  LogOut,
  Sparkles,
  CloudCheck,
  CheckCircle2,
  XCircle,
  TableProperties
} from 'lucide-react';
import { 
  initGoogleAuth, 
  googleSignIn, 
  googleSignOut, 
  listGoogleDriveSpreadsheets, 
  createOfficeGoogleSpreadsheet, 
  syncAllDataToGoogleSheets,
  DriveSpreadsheetItem
} from '../services/googleSheetsService';
import { User } from 'firebase/auth';

export const AppsScriptSyncModule: React.FC = () => {
  const { 
    citizens, 
    requests, 
    interviews, 
    organizationRecords, 
    officialLetters, 
    auditLogs, 
    systemSettings, 
    updateSystemSettings,
    addAuditLog 
  } = useApp();

  // Auth State
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sheets & Drive State
  const [driveSheets, setDriveSheets] = useState<DriveSpreadsheetItem[]>([]);
  const [selectedSheetId, setSelectedSheetId] = useState<string>(systemSettings.activeGoogleSheetId || '');
  const [selectedSheetUrl, setSelectedSheetUrl] = useState<string>(systemSettings.activeGoogleSheetUrl || '');
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [newSheetTitle, setNewSheetTitle] = useState('قاعدة بيانات مكتب النائب علا الناشي - المركزية');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [showConfirmSyncModal, setShowConfirmSyncModal] = useState(false);

  // Apps Script Legacy / Webhook
  const [copied, setCopied] = useState(false);
  const [webAppUrl, setWebAppUrl] = useState(systemSettings.googleAppsScriptUrl || '');
  const [isSavedUrl, setIsSavedUrl] = useState(false);

  // Active Tab inside module
  const [activeSubTab, setActiveSubTab] = useState<'direct_sheets' | 'apps_script'>('direct_sheets');

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = initGoogleAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
        fetchSpreadsheets(token);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const { user, accessToken: token } = await googleSignIn();
      setGoogleUser(user);
      setAccessToken(token);
      await fetchSpreadsheets(token);
      addAuditLog('تسجيل دخول Google Workspace', 'تكامل البيانات', `تم ربط حساب Google (${user.email}) بنجاح`);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'تعذر تسجيل الدخول بحساب Google. يرجى التحقق من الأذونات.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await googleSignOut();
    setGoogleUser(null);
    setAccessToken(null);
    setDriveSheets([]);
  };

  const fetchSpreadsheets = async (token: string) => {
    setIsLoadingSheets(true);
    try {
      const files = await listGoogleDriveSpreadsheets(token);
      setDriveSheets(files);
    } catch (err: any) {
      console.error('Failed to list sheets:', err);
    } finally {
      setIsLoadingSheets(false);
    }
  };

  const handleCreateNewSpreadsheet = async () => {
    if (!accessToken) return;
    setIsCreatingSheet(true);
    try {
      const result = await createOfficeGoogleSpreadsheet(accessToken, newSheetTitle.trim() || undefined);
      setSelectedSheetId(result.spreadsheetId);
      setSelectedSheetUrl(result.spreadsheetUrl);
      updateSystemSettings({
        activeGoogleSheetId: result.spreadsheetId,
        activeGoogleSheetUrl: result.spreadsheetUrl
      });
      setShowCreateModal(false);
      await fetchSpreadsheets(accessToken);
      
      // Auto initial sync
      await handleSyncToSheets(result.spreadsheetId);
      addAuditLog('إنشاء جدول Google Sheets', 'تكامل السحاب', `تم إنشاء الجدول المركزي ${newSheetTitle} وتهيئته`);
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء إنشاء الجدول');
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const handleSelectExistingSheet = (sheetId: string) => {
    setSelectedSheetId(sheetId);
    const selected = driveSheets.find(s => s.id === sheetId);
    const url = selected?.webViewLink || `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
    setSelectedSheetUrl(url);
    updateSystemSettings({
      activeGoogleSheetId: sheetId,
      activeGoogleSheetUrl: url
    });
  };

  // Safe sync execution with confirmation
  const handleSyncToSheets = async (targetId?: string) => {
    const sheetId = targetId || selectedSheetId;
    if (!sheetId || !accessToken) return;
    
    setIsSyncing(true);
    setSyncStatus('idle');
    setSyncMessage('جاري نقل وتحديث البيانات في Google Sheets...');
    setShowConfirmSyncModal(false);

    try {
      await syncAllDataToGoogleSheets(accessToken, sheetId, {
        citizens,
        requests,
        interviews,
        organizationRecords,
        officialLetters,
        auditLogs
      });
      setSyncStatus('success');
      setSyncMessage(`تمت المزامنة بنجاح! تم تحديث ${citizens.length} مراجع، ${requests.length} معاملة، ${interviews.length} مقابلة.`);
      addAuditLog('مزامنة سحابية كاملة', 'Google Sheets', `تحديث كافة جداول Google Sheets بنجاح (${citizens.length} مراجع)`);
    } catch (err: any) {
      console.error(err);
      setSyncStatus('error');
      setSyncMessage(err.message || 'فشلت عملية المزامنة السحابية.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings({ googleAppsScriptUrl: webAppUrl.trim() });
    setIsSavedUrl(true);
    setTimeout(() => setIsSavedUrl(false), 2500);
  };

  const appsScriptCode = `/**
 * =========================================================================
 * منظومة مكتب النائب المهندسة علا عودة الناشي - الإصدار الاحترافي السحابي
 * Google Apps Script Back-end & Google Sheets Database Engine
 * =========================================================================
 */
const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {
  const action = e.parameter.action;
  if (action === 'getCitizens') return jsonResponse(getSheetData('سجل_المراجعين_Citizens'));
  if (action === 'getRequests') return jsonResponse(getSheetData('طلبات_الإدارة_Requests'));
  if (action === 'getInterviews') return jsonResponse(getSheetData('مقابلات_النائب_Interviews'));
  return HtmlService.createHtmlOutput('<h3>منظومة مكتب النائب علا الناشي تعمل بكفاءة على Google Apps Script!</h3>');
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.action === 'addCitizen') return jsonResponse(insertCitizen(data.payload));
    if (data.action === 'addRequest') return jsonResponse(insertRequest(data.payload));
    return jsonResponse({ status: 'error', message: 'Action not found' });
  } catch (err) {
    return jsonResponse({ status: 'error', error: err.toString() });
  }
}

function getSheetData(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  const headers = values[0];
  const results = [];
  for (let i = 1; i < values.length; i++) {
    let row = values[i];
    let obj = {};
    for (let j = 0; j < headers.length; j++) obj[headers[j]] = row[j];
    results.push(obj);
  }
  return results;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
`;

  return (
    <div className="space-y-4 text-right">
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">تكامل ومزامنة Google Sheets السحابية</h2>
              <p className="text-xs text-slate-500">
                الربط المباشر مع حساب Google و Google Drive لحفظ وتحديث كافة السجلات والطلبات والمقابلات في جداول Google Sheets.
              </p>
            </div>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveSubTab('direct_sheets')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'direct_sheets'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>الربط المباشر (Google API)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('apps_script')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'apps_script'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-sky-600" />
            <span>Google Apps Script</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'direct_sheets' ? (
        <div className="space-y-4">
          {/* Google Account Authentication Section */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {googleUser ? (
                  <div className="w-10 h-10 rounded-full border-2 border-emerald-500 overflow-hidden bg-slate-100 shrink-0">
                    {googleUser.photoURL ? (
                      <img src={googleUser.photoURL} alt={googleUser.displayName || 'Google User'} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-emerald-700">
                        {googleUser.displayName?.[0] || 'G'}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">
                      {googleUser ? `الحساب المتصل: ${googleUser.displayName || googleUser.email}` : 'ربط الحساب عبر Google Sign-In'}
                    </h3>
                    {googleUser && (
                      <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200">
                        متصل ومفعل
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {googleUser 
                      ? `البريد الإلكتروني: ${googleUser.email} (أذونات Google Drive & Sheets نشطة)` 
                      : 'سجل دخولك بحساب Google للسماح للمنظومة بإنشاء وقراءة وتحديث جداول Google Sheets في حسابك.'}
                  </p>
                </div>
              </div>

              <div>
                {googleUser ? (
                  <button
                    onClick={handleGoogleLogout}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>فصل الحساب</span>
                  </button>
                ) : (
                  <button
                    onClick={handleGoogleLogin}
                    disabled={isLoggingIn}
                    className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    <span>{isLoggingIn ? 'جاري الاتصال بـ Google...' : 'تسجيل الدخول بحساب Google'}</span>
                  </button>
                )}
              </div>
            </div>

            {authError && (
              <div className="mt-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}
          </div>

          {/* Active Spreadsheet & Management */}
          {googleUser ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Main Sync Controls */}
              <div className="lg:col-span-2 space-y-4">
                {/* Active Target Card */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TableProperties className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-bold text-slate-900">جدول Google Sheets النشط للربط</h3>
                    </div>
                    {selectedSheetUrl && (
                      <a
                        href={selectedSheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <span>فتح الجدول في Google Sheets</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {selectedSheetId ? (
                    <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>الجدول متصل وجاهز للمزامنة الفورية</span>
                        </div>
                        <div className="text-[11px] text-slate-600 font-mono">
                          ID: {selectedSheetId}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowConfirmSyncModal(true)}
                          disabled={isSyncing}
                          className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                          <span>{isSyncing ? 'جاري المزامنة...' : 'مزامنة السجلات الآن'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center space-y-2">
                      <p className="text-xs text-slate-600">لم يتم تحديد جدول نشط بعد. يمكنك إنشاء جدول جديد بضغطة زر أو اختيار جدول من Google Drive.</p>
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>إنشاء جدول مركزي جديد لمكتب النائب</span>
                      </button>
                    </div>
                  )}

                  {/* Sync Status Banner */}
                  {syncStatus !== 'idle' && (
                    <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                      syncStatus === 'success' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      {syncStatus === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <XCircle className="w-4 h-4 shrink-0 text-red-600" />}
                      <span>{syncMessage}</span>
                    </div>
                  )}
                </div>

                {/* Summary of Data to Sync */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-900">حجم البيانات الجاهزة للتصدير والمزامنة السحابية:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                      <div className="text-lg font-black text-slate-900">{citizens.length}</div>
                      <div className="text-[10px] text-slate-500 font-bold">سجل مراجعين</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                      <div className="text-lg font-black text-blue-600">{requests.length}</div>
                      <div className="text-[10px] text-slate-500 font-bold">معاملة حكومية</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                      <div className="text-lg font-black text-amber-600">{interviews.length}</div>
                      <div className="text-[10px] text-slate-500 font-bold">مقابلة رسمية</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                      <div className="text-lg font-black text-purple-600">{organizationRecords.length}</div>
                      <div className="text-[10px] text-slate-500 font-bold">موقف جماهيري</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spreadsheets in Drive Picker */}
              <div className="space-y-3">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <FolderOpen className="w-4 h-4 text-amber-600" />
                      <span>جداول Google Drive ({driveSheets.length})</span>
                    </h3>
                    <button
                      onClick={() => accessToken && fetchSpreadsheets(accessToken)}
                      disabled={isLoadingSheets}
                      className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                      title="تحديث قائمة الملفات"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSheets ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full py-2 px-3 rounded-lg border border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>إنشاء جدول جديد</span>
                  </button>

                  <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
                    {isLoadingSheets ? (
                      <div className="p-4 text-center text-xs text-slate-400">جاري قراءة ملفات Google Drive...</div>
                    ) : driveSheets.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">لم يتم العثور على جداول في Drive</div>
                    ) : (
                      driveSheets.map(s => {
                        const isSelected = selectedSheetId === s.id;
                        return (
                          <div
                            key={s.id}
                            onClick={() => handleSelectExistingSheet(s.id)}
                            className={`p-2.5 rounded-lg border text-right transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-400 shadow-xs'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="text-xs font-bold text-slate-900 truncate max-w-[180px]">
                                {s.name}
                              </div>
                              {isSelected && (
                                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {s.modifiedTime ? new Date(s.modifiedTime).toLocaleDateString('ar-IQ') : ''}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white rounded-xl border border-slate-200 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CloudCheck className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-sm font-bold text-slate-900">تكامل Google Sheets المباشر</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  يتيح لك هذا القسم ربط المنظومة تلقائياً بحساب Google وإنشاء قاعدة بيانات حية ومجدولة على Google Sheets بدون الحاجة لأي إعدادات معقدة.
                </p>
              </div>
              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>ابدأ الربط السحابي مع Google Sheets</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Google Apps Script Deployment Mode */
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-sky-600" />
                <span>ربط المنظومة برابط Web App المنشور (Deployment URL)</span>
              </h4>
              {isSavedUrl && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>تم حفظ رابط الربط السحابي</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSaveUrl} className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={webAppUrl}
                onChange={(e) => setWebAppUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs text-left focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs cursor-pointer transition-colors shrink-0 shadow-xs"
              >
                حفظ الرابط وتفعيل التزامن
              </button>
            </form>
          </div>

          {/* Code Viewer Box */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md space-y-0">
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-mono font-bold text-slate-200">Code.gs (Google Apps Script)</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(appsScriptCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2500);
                }}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copied ? 'تم النسخ!' : 'نسخ الكود'}
              </button>
            </div>

            <pre className="p-4 text-xs text-sky-300 font-mono overflow-x-auto max-h-[400px] leading-relaxed text-left" dir="ltr">
              {appsScriptCode}
            </pre>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Workspace Data Mutation (MANDATORY per Workspace guidelines) */}
      {showConfirmSyncModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4 text-right">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">تأكيد المزامنة والتحديث في Google Sheets</h3>
                <p className="text-xs text-slate-500">يرجى تأكيد رغبتك في تحديث بيانات جدول Google Sheets.</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="font-bold text-slate-700">سيتم تحديث الأوراق الآتية:</div>
              <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                <li>سجل المراجعين ({citizens.length} سجل)</li>
                <li>طلبات الإدارة والمعاملات ({requests.length} معاملة)</li>
                <li>مقابلات النائب ({interviews.length} مقابلة)</li>
                <li>الموقف الجماهيري والتنظيمي ({organizationRecords.length} سجل)</li>
                <li>المكاتبات والكتب الرسمية ({officialLetters.length} كتاب)</li>
                <li>سجل الرقابة والحوكمة ({auditLogs.length} حركة)</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmSyncModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => handleSyncToSheets()}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-xs transition-colors"
              >
                تأكيد المزامنة والتحديث
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Creating New Spreadsheet */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4 text-right">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">إنشاء جدول مركزي جديد في Google Drive</h3>
                <p className="text-xs text-slate-500">سيتم إنشاء جدول Google Sheets جديد مقسم ومبوب بالكامل.</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">عنوان جدول Google Sheets:</label>
              <input
                type="text"
                value={newSheetTitle}
                onChange={(e) => setNewSheetTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                placeholder="اسم الملف في Google Drive"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleCreateNewSpreadsheet}
                disabled={isCreatingSheet}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-xs transition-colors disabled:opacity-50"
              >
                {isCreatingSheet ? 'جاري الإنشاء والتهيئة...' : 'إنشاء وتهيئة الجدول'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
