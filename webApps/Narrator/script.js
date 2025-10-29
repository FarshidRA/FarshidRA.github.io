const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture');
const descriptionEl = document.getElementById('description');
const languages = document.getElementById('languages');
const autoBtn = document.getElementById('auto');
const stopAutoBtn = document.getElementById('stopAuto');

let classifier = null;
let autoInterval = null;

// Start camera (rear)
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });
    video.srcObject = stream;
  } catch (err) {
    descriptionEl.textContent = "Camera access error: " + err.message;
  }
}

// Load ml5 MobileNet model
ml5.imageClassifier('MobileNet')
  .then(c => {
    classifier = c;
    descriptionEl.textContent = "Model loaded — ready to capture!";
  })
  .catch(err => {
    descriptionEl.textContent = "Error loading model: " + err.message;
  });

// Capture frame and describe
async function captureAndDescribe() {
  if (!classifier) {
    descriptionEl.textContent = "Please wait for the model to load...";
    return;
  }

  // Draw video frame on canvas
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  descriptionEl.textContent = "Analyzing image...";

  // Classify using ml5
  classifier.classify(canvas)
    .then(results => {
      if (!results || results.length === 0) {
        descriptionEl.textContent = "Nothing detected.";
        return;
      }

      // Top 3 results
      const top = results.slice(0, 3).map((r, i) =>
        `${i + 1}. ${r.label} — ${(r.confidence * 100).toFixed(1)}%`
      ).join("\n");

      const sentence = `I see:\n${top}`;
      descriptionEl.textContent = sentence;
      speak(sentence);
    })
    .catch(err => {
      descriptionEl.textContent = "Error detecting: " + err.message;
    });
}

// Text-to-Speech
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = languages.value || 'en-US';
  utter.rate = 1;
  utter.pitch = 1;
  speechSynthesis.cancel(); // stop previous
  speechSynthesis.speak(utter);
}

// Event listeners
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

// Initialize
startCamera();
