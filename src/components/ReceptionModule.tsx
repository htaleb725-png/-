import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Citizen, Gender } from '../types';
import { 
  UserPlus, 
  Search, 
  CheckCircle, 
  Printer, 
  Clock, 
  ArrowLeft
} from 'lucide-react';

export const ReceptionModule: React.FC = () => {
  const { 
    citizens, 
    addCitizen, 
    getDropdownOptions, 
    setPrintableBadgeCitizen, 
    currentUser,
    setSelectedCitizenForHistory,
    addRequest
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form states for new citizen registration
  const [firstName, setFirstName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [grandFatherName, setGrandFatherName] = useState('');
  const [greatGrandFatherName, setGreatGrandFatherName] = useState('');
  const [surname, setSurname] = useState('');
  const [customSurname, setCustomSurname] = useState('');

  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [gender, setGender] = useState<Gender>('ذكر');
  const [job, setJob] = useState('كاسب');
  const [customJob, setCustomJob] = useState('');
  const [education, setEducation] = useState('إعدادية');
  const [rating, setRating] = useState('لائق');
  const [customRating, setCustomRating] = useState('');
  const [district, setDistrict] = useState('قضاء الناصرية');
  const [customDistrict, setCustomDistrict] = useState('');
  const [subDistrict, setSubDistrict] = useState('مركز القضاء');
  const [customSubDistrict, setCustomSubDistrict] = useState('');
  const [referralSource, setReferralSource] = useState('مباشر بدون معرف');
  const [customReferral, setCustomReferral] = useState('');

  // Optional on-the-spot request creation during registration
  const [initialRequestEntity, setInitialRequestEntity] = useState('وزارة العمل والشؤون الاجتماعية (شبكة الحماية)');
  const [customInitialEntity, setCustomInitialEntity] = useState('');
  const [initialRequestPriority, setInitialRequestPriority] = useState<'عاجل' | 'عام' | 'خاص جداً'>('عام');
  const [initialRequestDetails, setInitialRequestDetails] = useState('');

  // New Request Form for existing citizen
  const [reqEntity, setReqEntity] = useState('وزارة العمل والشؤون الاجتماعية (شبكة الحماية)');
  const [customEntity, setCustomEntity] = useState('');
  const [reqPriority, setReqPriority] = useState<'عاجل' | 'عام' | 'خاص جداً'>('عام');
  const [reqDetails, setReqDetails] = useState('');

  // Filtered citizens list
  const filteredCitizens = (citizens || []).filter(c => {
    if (!c) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return (
      (c.FullName && c.FullName.toLowerCase().includes(q)) ||
      (c.Citizen_ID && c.Citizen_ID.toLowerCase().includes(q)) ||
      (c.Phone1 && c.Phone1.includes(q)) ||
      (c.Phone2 && c.Phone2.includes(q)) ||
      (c.Surname && c.Surname.toLowerCase().includes(q)) ||
      (c.District && c.District.toLowerCase().includes(q))
    );
  });

  const resetForm = () => {
    setFirstName('');
    setFatherName('');
    setGrandFatherName('');
    setGreatGrandFatherName('');
    setSurname('');
    setCustomSurname('');
    setPhone1('');
    setPhone2('');
    setGender('ذكر');
    setJob('كاسب');
    setCustomJob('');
    setEducation('إعدادية');
    setRating('لائق');
    setCustomRating('');
    setDistrict('قضاء الناصرية');
    setCustomDistrict('');
    setSubDistrict('مركز القضاء');
    setCustomSubDistrict('');
    setReferralSource('مباشر بدون معرف');
    setCustomReferral('');
    setInitialRequestEntity('وزارة العمل والشؤون الاجتماعية (شبكة الحماية)');
    setCustomInitialEntity('');
    setInitialRequestPriority('عام');
    setInitialRequestDetails('');
  };

  const handleRegisterCitizen = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !fatherName.trim() || !phone1.trim()) {
      alert('يرجى ملء الحقول الأساسية: الاسم، اسم الأب، ورقم الهاتف.');
      return;
    }

    const finalSurname = surname === 'أخرى' && customSurname ? customSurname.trim() : (surname || 'عام');
    const finalJob = job === 'أخرى' && customJob ? customJob.trim() : job;
    const finalRating = rating === 'أخرى' && customRating ? customRating.trim() : rating;
    const finalDistrict = district === 'أخرى' && customDistrict ? customDistrict.trim() : district;
    const finalSubDistrict = subDistrict === 'أخرى' && customSubDistrict ? customSubDistrict.trim() : subDistrict;
    const finalReferral = referralSource === 'أخرى' && customReferral ? customReferral.trim() : referralSource;

    const newCit = addCitizen({
      FirstName: firstName.trim(),
      FatherName: fatherName.trim(),
      GrandFatherName: grandFatherName.trim(),
      GreatGrandFatherName: greatGrandFatherName.trim(),
      Surname: finalSurname,
      FullName: `${firstName.trim()} ${fatherName.trim()} ${grandFatherName.trim()} ${greatGrandFatherName.trim()} ${finalSurname}`.trim(),
      Phone1: phone1.trim(),
      Phone2: phone2.trim() || undefined,
      Gender: gender,
      Job: finalJob,
      Education: education,
      Rating: finalRating,
      District: finalDistrict,
      SubDistrict: finalSubDistrict,
      ReferralSource: finalReferral
    });

    // If initial request was provided, automatically create it and link it
    if (initialRequestDetails.trim()) {
      const finalInitialEntity = initialRequestEntity === 'أخرى' && customInitialEntity ? customInitialEntity.trim() : initialRequestEntity;
      addRequest({
        Citizen_ID: newCit.Citizen_ID,
        CitizenName: newCit.FullName,
        CitizenPhone: newCit.Phone1,
        Entity: finalInitialEntity,
        RequestStatus: 'مستلم',
        ProcessingStatus: 'قيد التدقيق',
        Priority: initialRequestPriority,
        Details: initialRequestDetails.trim(),
        CreatedBy: currentUser ? currentUser.FullName : 'قسم الاستعلامات'
      });
    }

    setShowAddModal(false);
    setSelectedCitizen(newCit);
    setSuccessMessage(`تم بنجاح تسجيل المراجع برقم تعريفي موحد (${newCit.Citizen_ID}) وظهور بياناته فوراً لمدير المكتب والإدارة.`);
    resetForm();

    // Offer to print badge immediately
    setTimeout(() => {
      setPrintableBadgeCitizen(newCit);
    }, 400);
  };

  const handleCreateNewRequestForCitizen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCitizen || !reqDetails.trim()) return;

    const finalEntity = reqEntity === 'أخرى' && customEntity ? customEntity.trim() : reqEntity;

    addRequest({
      Citizen_ID: selectedCitizen.Citizen_ID,
      CitizenName: selectedCitizen.FullName,
      CitizenPhone: selectedCitizen.Phone1,
      Entity: finalEntity,
      RequestStatus: 'مستلم',
      ProcessingStatus: 'قيد التدقيق',
      Priority: reqPriority,
      Details: reqDetails.trim(),
      CreatedBy: currentUser ? currentUser.FullName : 'قسم الاستعلامات'
    });

    setShowNewRequestModal(false);
    setReqDetails('');
    setCustomEntity('');
    setSuccessMessage(`تمت إضافة طلب جديد للمراجع ${selectedCitizen.FullName} وإحالته لقسم الإدارة.`);
  };

  return (
    <div className="space-y-4 text-right">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">قسم الاستعلامات والاستقبال</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              تسجيل موحد
            </span>
          </div>
          <p className="text-xs text-slate-500">
            توليد الرقم التعريفي الثابت (Citizen_ID)، والبحث عن المراجعين المكررين لإضافة طلبات جديدة لنفس السجل.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ تسجيل مراجع جديد (إنشاء ID)</span>
        </button>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Live Search & Filter Grid */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم الرباعي، الرقم التعريفي (ONA-XXXX)، رقم الهاتف، العشيرة، أو القضاء..."
            className="w-full pr-10 pl-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-right shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-bold"
            >
              مسح
            </button>
          )}
        </div>

        {/* Citizens Records Table */}
        <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-xs font-bold text-slate-800">
              قائمة المراجعين المسجلين بالاستعلامات ({filteredCitizens.length})
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              اضغط على أي مراجع لعرض التفاصيل أو إضافة طلب جديد
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
                <tr>
                  <th className="p-3">الرقم التعريفي (ID)</th>
                  <th className="p-3">الاسم الرباعي واللقب</th>
                  <th className="p-3">الهاتف</th>
                  <th className="p-3">السكن</th>
                  <th className="p-3">المهنة</th>
                  <th className="p-3">التقييم</th>
                  <th className="p-3">المعرّف</th>
                  <th className="p-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCitizens.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      لا يوجد مراجع يطابق بحثك. يمكنك النقر على "+ تسجيل مراجع جديد" لإنشاء رقم تعريفي فوري.
                    </td>
                  </tr>
                ) : (
                  filteredCitizens.map((citizen) => (
                    <tr 
                      key={citizen.Citizen_ID} 
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedCitizen(citizen)}
                    >
                      <td className="p-3 font-mono font-bold text-blue-700 text-[11px]">{citizen.Citizen_ID}</td>
                      <td className="p-3 font-bold text-slate-900">{citizen.FullName}</td>
                      <td className="p-3 font-mono" dir="ltr">{citizen.Phone1}</td>
                      <td className="p-3">{citizen.District} - {citizen.SubDistrict}</td>
                      <td className="p-3 text-slate-600">{citizen.Job}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {citizen.Rating}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{citizen.ReferralSource || 'مباشر'}</td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedCitizen(citizen);
                              setShowNewRequestModal(true);
                            }}
                            className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold transition-colors cursor-pointer"
                            title="إضافة طلب جديد لنفس المراجع"
                          >
                            + إضافة طلب
                          </button>

                          <button
                            onClick={() => setPrintableBadgeCitizen(citizen)}
                            className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                            title="طباعة وصل مراجعة / باج"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setSelectedCitizenForHistory(citizen)}
                            className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-amber-700 transition-colors cursor-pointer"
                            title="السجل التراكمي للمراجع"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white text-slate-800 rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">تسجيل مراجع جديد وتوليد الرقم التعريفي</h3>
                  <p className="text-xs text-slate-500">يرجى ملء الحقول المنفصلة للاسم والمعلومات الدقيقة</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterCitizen} className="space-y-4 text-right">
              {/* 4-Part Name + Surname */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">الاسم الرباعي واللقب (حقول منفصلة):</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1 font-medium">الاسم الأول *</span>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="محمد"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1 font-medium">اسم الأب *</span>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="جاسم"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1 font-medium">اسم الجد</span>
                    <input
                      type="text"
                      value={grandFatherName}
                      onChange={(e) => setGrandFatherName(e.target.value)}
                      placeholder="خلف"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1 font-medium">اسم أب الجد</span>
                    <input
                      type="text"
                      value={greatGrandFatherName}
                      onChange={(e) => setGreatGrandFatherName(e.target.value)}
                      placeholder="علي"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1 font-medium">العشيرة / اللقب</span>
                    <select
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">-- اختر اللقب --</option>
                      {getDropdownOptions('Surname').map((s, idx) => (
                        <option key={idx} value={s}>{s}</option>
                      ))}
                      <option value="أخرى">+ أخرى (إضافة لقب جديد)</option>
                    </select>
                  </div>
                </div>

                {surname === 'أخرى' && (
                  <div className="pt-1.5">
                    <span className="text-[11px] text-blue-700 font-bold block mb-1">اكتب اللقب الجديد:</span>
                    <input
                      type="text"
                      value={customSurname}
                      onChange={(e) => setCustomSurname(e.target.value)}
                      placeholder="مثال: الخفاجي، السعدون..."
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-blue-400 text-slate-900 text-xs text-right outline-none"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Phones & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف الأول *</label>
                  <input
                    type="tel"
                    value={phone1}
                    onChange={(e) => setPhone1(e.target.value)}
                    placeholder="078XXXXXXXX"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-left font-mono focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف الثاني (إن وجد)</label>
                  <input
                    type="tel"
                    value={phone2}
                    onChange={(e) => setPhone2(e.target.value)}
                    placeholder="077XXXXXXXX"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-left font-mono focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الجنس</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                  </select>
                </div>
              </div>

              {/* Social Info & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المهنة</label>
                  <select
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {getDropdownOptions('Job').map((j, idx) => (
                      <option key={idx} value={j}>{j}</option>
                    ))}
                    <option value="أخرى">+ أخرى (إضافة مهنة جديدة)</option>
                  </select>
                  {job === 'أخرى' && (
                    <input
                      type="text"
                      value={customJob}
                      onChange={(e) => setCustomJob(e.target.value)}
                      placeholder="اكتب المهنة الجديدة..."
                      className="w-full mt-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-400 text-slate-900 text-xs text-right"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">التحصيل الدراسي</label>
                  <select
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {getDropdownOptions('Education').map((ed, idx) => (
                      <option key={idx} value={ed}>{ed}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">التقييم الأولي</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-amber-700"
                  >
                    {getDropdownOptions('Rating').map((r, idx) => (
                      <option key={idx} value={r}>{r}</option>
                    ))}
                    <option value="أخرى">+ أخرى</option>
                  </select>
                  {rating === 'أخرى' && (
                    <input
                      type="text"
                      value={customRating}
                      onChange={(e) => setCustomRating(e.target.value)}
                      placeholder="اكتب التقييم الجديد..."
                      className="w-full mt-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-400 text-slate-900 text-xs text-right"
                    />
                  )}
                </div>
              </div>

              {/* District & SubDistrict & Referral */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">السكن (القضاء)</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {getDropdownOptions('District').map((d, idx) => (
                      <option key={idx} value={d}>{d}</option>
                    ))}
                    <option value="أخرى">+ أخرى</option>
                  </select>
                  {district === 'أخرى' && (
                    <input
                      type="text"
                      value={customDistrict}
                      onChange={(e) => setCustomDistrict(e.target.value)}
                      placeholder="اكتب القضاء الجديد..."
                      className="w-full mt-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-400 text-slate-900 text-xs text-right"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الناحية / الحي</label>
                  <select
                    value={subDistrict}
                    onChange={(e) => setSubDistrict(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {getDropdownOptions('SubDistrict').map((sd, idx) => (
                      <option key={idx} value={sd}>{sd}</option>
                    ))}
                    <option value="أخرى">+ أخرى</option>
                  </select>
                  {subDistrict === 'أخرى' && (
                    <input
                      type="text"
                      value={customSubDistrict}
                      onChange={(e) => setCustomSubDistrict(e.target.value)}
                      placeholder="اكتب الناحية أو الحي..."
                      className="w-full mt-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-400 text-slate-900 text-xs text-right"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المعرّف / المصرّح</label>
                  <select
                    value={referralSource}
                    onChange={(e) => setReferralSource(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {getDropdownOptions('ReferralSource').map((ref, idx) => (
                      <option key={idx} value={ref}>{ref}</option>
                    ))}
                    <option value="أخرى">+ أخرى</option>
                  </select>
                  {referralSource === 'أخرى' && (
                    <input
                      type="text"
                      value={customReferral}
                      onChange={(e) => setCustomReferral(e.target.value)}
                      placeholder="اسم الشيخ أو المصرّح..."
                      className="w-full mt-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-400 text-slate-900 text-xs text-right"
                    />
                  )}
                </div>
              </div>

              {/* Direct Request / Visit Cause Section (Auto forwards to Director and Admin) */}
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2.5 text-right">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <span>📌 سبب الزيارة أو تفاصيل الطلب الأولي (يظهر فوراً لمدير المكتب ومسؤول الإدارة)</span>
                  </span>
                  <span className="text-[10px] text-blue-700 font-semibold bg-white px-2 py-0.5 rounded border border-blue-200">
                    مزامنة فورية
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">الجهة الحكومية الموجه إليها الطلب</label>
                    <select
                      value={initialRequestEntity}
                      onChange={(e) => setInitialRequestEntity(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs text-right outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {getDropdownOptions('Entity').map((ent, idx) => (
                        <option key={idx} value={ent}>{ent}</option>
                      ))}
                      <option value="أخرى">+ أخرى</option>
                    </select>
                    {initialRequestEntity === 'أخرى' && (
                      <input
                        type="text"
                        value={customInitialEntity}
                        onChange={(e) => setCustomInitialEntity(e.target.value)}
                        placeholder="اكتب الجهة..."
                        className="w-full mt-1 px-2.5 py-1 rounded bg-white border border-blue-300 text-xs"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">درجة الأهمية / الأولوية</label>
                    <select
                      value={initialRequestPriority}
                      onChange={(e) => setInitialRequestPriority(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs text-right outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="عام">عام (اعتيادي)</option>
                      <option value="عاجل">🚨 عاجل (إشعار فوري)</option>
                      <option value="خاص جداً">⭐ خاص جداً (عالي الأهمية)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">تفاصيل وموضوع الطلب أو الشكوى</label>
                  <textarea
                    value={initialRequestDetails}
                    onChange={(e) => setInitialRequestDetails(e.target.value)}
                    placeholder="اكتب تفاصيل طلب المواطن أو سبب حضوره للمكتب ليتم إحالته مباشرة للمدير والإدارة..."
                    rows={2}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs text-right outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>حفظ وتوليد الرقم التعريفي والباج</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Request Modal for Selected Citizen */}
      {showNewRequestModal && selectedCitizen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white text-slate-800 rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">إضافة طلب جديد لنفس المواطن</h3>
                <p className="text-xs text-blue-700 font-bold">
                  {selectedCitizen.FullName} ({selectedCitizen.Citizen_ID})
                </p>
              </div>
              <button
                onClick={() => setShowNewRequestModal(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewRequestForCitizen} className="space-y-3.5 text-right">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الجهة المعنية *</label>
                <select
                  value={reqEntity}
                  onChange={(e) => setReqEntity(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {getDropdownOptions('Entity').map((ent, idx) => (
                    <option key={idx} value={ent}>{ent}</option>
                  ))}
                  <option value="أخرى">+ أخرى (إضافة جهة جديدة)</option>
                </select>
                {reqEntity === 'أخرى' && (
                  <input
                    type="text"
                    value={customEntity}
                    onChange={(e) => setCustomEntity(e.target.value)}
                    placeholder="اكتب اسم الوزارة أو الدائرة..."
                    className="w-full mt-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-400 text-slate-900 text-xs text-right"
                    required
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">درجة الأولوية</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['عام', 'عاجل', 'خاص جداً'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setReqPriority(p)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        reqPriority === p
                          ? p === 'عاجل' || p === 'خاص جداً'
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">شرح وتفاصيل الطلب *</label>
                <textarea
                  value={reqDetails}
                  onChange={(e) => setReqDetails(e.target.value)}
                  rows={3}
                  placeholder="اكتب تفاصيل الطلب المقدم من المواطن والإجراء المطلوب..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs text-right focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewRequestModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  ترحيل الطلب لقسم الإدارة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
