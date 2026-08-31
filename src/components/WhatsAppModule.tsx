import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  Send, 
  Copy, 
  Check
} from 'lucide-react';

export const WhatsAppModule: React.FC = () => {
  const { citizens, requests, interviews, addAuditLog } = useApp();

  const [selectedCitizenId, setSelectedCitizenId] = useState(citizens[0]?.Citizen_ID || '');
  const [selectedTemplate, setSelectedTemplate] = useState('completed');
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const citizen = citizens.find(c => c.Citizen_ID === selectedCitizenId);
  const citizenRequests = requests.filter(r => r.Citizen_ID === selectedCitizenId);
  const citizenInterviews = interviews.filter(i => i.Citizen_ID === selectedCitizenId);

  const getTemplateMessage = () => {
    if (!citizen) return '';

    const latestReq = citizenRequests[0];
    const latestIntv = citizenInterviews[0];

    switch (selectedTemplate) {
      case 'completed':
        return `السلام عليكم ورحمة الله وبركاته،\nالأخ/الأخت الكريم/ة: ${citizen.FullName}\n\nنود إعلامكم من مكتب النائب المهندسة علا عودة الناشي بأنه تم بحمد الله إنجاز طلبكم (${latestReq ? latestReq.Entity : 'المعاملة الحكومية'})، ويرجى مراجعة مكتبنا في الناصرية لاستلام الكتاب الرسمي.\n\nالرقم التعريفي: ${citizen.Citizen_ID}\nمع خالص التقدير،\nمكتب النائب علا الناشي`;

      case 'interview':
        return `السلام عليكم ورحمة الله وبركاته،\nالأخ/الأخت الكريم/ة: ${citizen.FullName}\n\nتحية طيبة، يسرنا إعلامكم بتحديد موعد مقابلتكم المباشرة مع النائب المهندسة علا عودة الناشي يوم (${latestIntv?.InterviewDate || 'الخميس القادم'}) في تمام الساعة (${latestIntv?.InterviewTime || '11:00 صباحاً'}).\n\nيرجى جلب الأوليات والمستمسكات الثبوتية وإبراز الرقم التعريفي (${citizen.Citizen_ID}) عند الاستعلامات.\n\nمكتب النائب علا الناشي`;

      case 'in_progress':
        return `السلام عليكم ورحمة الله وبركاته،\nالأخ/الأخت الكريم/ة: ${citizen.FullName}\n\nنحيطكم علماً بأن معاملتكم المحالة إلى (${latestReq?.Entity || 'الوزارة المعنية'}) قيد المتابعة الحثيثة والتنسيق من قبل كادر مكتب النائب علا الناشي، وسنوافيكم فور صدور الإجابة الرسمية.\n\nالرقم التعريفي: ${citizen.Citizen_ID}\nمكتب النائب علا الناشي`;

      case 'documents_required':
        return `السلام عليكم ورحمة الله وبركاته،\nالأخ/الأخت: ${citizen.FullName}\n\nيرجى التفضل بمراجعة مكتب النائب علا الناشي أو تزويدنا بالمستمسكات الثبوتية التكميلية لغرض استكمال مفاتحة الدائرة المعنية بطلبكم.\n\nالرقم التعريفي: ${citizen.Citizen_ID}\nمكتب النائب علا الناشي`;

      case 'custom':
        return customMessage;

      default:
        return '';
    }
  };

  const messageText = selectedTemplate === 'custom' ? customMessage : getTemplateMessage();

  const handleSendWhatsApp = () => {
    if (!citizen || !citizen.Phone1) {
      alert('يرجى اختيار مراجع يمتلك رقم هاتف مسجل.');
      return;
    }

    // Clean phone number for Iraq WhatsApp international code +964
    let cleanPhone = citizen.Phone1.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '964' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('964')) {
      cleanPhone = '964' + cleanPhone;
    }

    const encodedMsg = encodeURIComponent(messageText);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

    addAuditLog(
      'إرسال رسالة واتساب',
      'قسم الواتساب',
      `إرسال رسالة واتساب للمواطن ${citizen.FullName} على الرقم ${cleanPhone}`
    );

    window.open(waUrl, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">قسم تراسل الواتساب والمتابعة الفورية</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              تواصل رقمي سريع
            </span>
          </div>
          <p className="text-xs text-slate-500">
            إشعار المراجعين بموقف طلباتهم ومواعيد مقابلات النائب عبر رسائل WhatsApp الرسمية المباشرة.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Configuration & Templates (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Select Citizen */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <label className="block text-xs font-bold text-slate-800">1. اختيار المواطن والمستلم:</label>
            <select
              value={selectedCitizenId}
              onChange={(e) => setSelectedCitizenId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-right focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {citizens.map((c) => (
                <option key={c.Citizen_ID} value={c.Citizen_ID}>
                  {c.FullName} ({c.Citizen_ID}) - هاتف: {c.Phone1}
                </option>
              ))}
            </select>
          </div>

          {/* Template Selection */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-xs">
            <label className="block text-xs font-bold text-emerald-700">2. اختيار قالب الرسالة الرسمي:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { id: 'completed', label: 'إنجاز المعاملة واستلام الكتاب' },
                { id: 'interview', label: 'تحديد موعد مقابلة مع النائب' },
                { id: 'in_progress', label: 'إشعار متابعة وقيد الإجراء بالوزارة' },
                { id: 'documents_required', label: 'طلب مستمسكات أو أوليات تكميلية' },
                { id: 'custom', label: 'رسالة مخصصة (نص حر)' }
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`p-2.5 rounded-lg text-right font-semibold transition-all cursor-pointer border text-xs ${
                    selectedTemplate === tmpl.id
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>

            {selectedTemplate === 'custom' && (
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">اكتب نص الرسالة:</label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                  placeholder="اكتب الرسالة المخصصة للمواطن..."
                  className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs text-right outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: Interactive Message Preview (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-xs text-slate-900">معاينة الرسالة قبل الإرسال</h4>
              </div>
              <span className="text-xs font-mono text-emerald-700 font-bold" dir="ltr">
                {citizen?.Phone1}
              </span>
            </div>

            {/* WhatsApp Chat Bubble Mockup */}
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs leading-relaxed whitespace-pre-line text-right font-sans">
              {messageText}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleSendWhatsApp}
                className="flex-1 py-2 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>فتح محادثة واتساب والإرسال الفوري</span>
              </button>

              <button
                onClick={handleCopy}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                title="نسخ النص"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
