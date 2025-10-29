const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture');
const descriptionEl = document.getElementById('description');
const languages = document.getElementById('languages');
const autoBtn = document.getElementById('auto');
const stopAutoBtn = document.getElementById('stopAuto');

let classifier = null;
let autoInterval = null;

// دوربین پشت
async function startCamera(){
  try{
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });
    video.srcObject = stream;
  }catch(err){
    descriptionEl.textContent = "خطا در دسترسی به دوربین: " + err.message;
  }
}

// بارگذاری مدل ml5 (MobileNet)
ml5.imageClassifier('MobileNet')
.then(c => {
  classifier = c;
  descriptionEl.textContent = "مدل بارگذاری شد — آماده‌اید.";
})
.catch(err => {
  descriptionEl.textContent = "بارگذاری مدل شکست: " + err.message;
});

// گرفتن فریم و تشخیص
async function captureAndDescribe(){
  if (!classifier){
    descriptionEl.textContent = "منتظر بارگذاری مدل باش...";
    return;
  }
  // اندازه بوم برابر ویدیو
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  descriptionEl.textContent = "در حال تحلیل تصویر...";

  // classify از ml5: ورودی می‌تواند ویدیو/عکس/کَنواس باشد
  classifier.classify(canvas)
  .then(results => {
    if (!results || results.length === 0){
      descriptionEl.textContent = "چیزی شناسایی نشد.";
      return;
    }
    // استفاده از ۳ نتیجهٔ برتر
    const top = results.slice(0,3).map((r,i) =>
      `${i+1}. ${r.label} — ${(r.confidence*100).toFixed(1)}%`).join("\n");

    const sentence = `من این‌ها رو دیدم:\n${top}`;
    descriptionEl.textContent = sentence;
    speak(sentence);
  })
  .catch(err => {
    descriptionEl.textContent = "خطا در تشخیص: " + err.message;
  });
}

// TTS
function speak(text){
  if (!('speechSynthesis' in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  // تنظیم زبان بر اساس انتخاب کاربر (ممکنه مرورگر صدا نداشته باشه)
  utter.lang = languages.value || 'en-US';
  // سرعت و حجم معقول
  utter.rate = 1;
  utter.pitch = 1;
  speechSynthesis.cancel(); // قطع هر پخش قبلی
  speechSynthesis.speak(utter);
}

// اتصالات
captureBtn.addEventListener('click', captureAndDescribe);

autoBtn.addEventListener('click', () => {
  if (autoInterval) return;
  autoInterval = setInterval(captureAndDescribe, 3000);
  autoBtn.disabled = true;
  stopAutoBtn.disabled = false;
});

stopAutoBtn.addEventListener('click', () => {
  if (!autoInterval) return;
  clearInterval(autoInterval);
  autoInterval = null;
  autoBtn.disabled = false;
  stopAutoBtn.disabled = true;
});

// استارت
startCamera();
