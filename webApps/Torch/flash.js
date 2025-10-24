let stream;
let track;
let torchOn = false;

async function toggleFlash() {
  if (!stream) {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      track = stream.getVideoTracks()[0];
    } catch (e) {
      alert("NOT SUPPORT.");
      return;
    }
  }

  const imageCapture = new ImageCapture(track);
  const capabilities = await imageCapture.getPhotoCapabilities();

  if (capabilities.torch) {
    torchOn = !torchOn;
    await track.applyConstraints({ advanced: [{ torch: torchOn }] });

    // تغییر رنگ آیکون دکمه
    const btn = document.getElementById("toggleBtn");
    if (torchOn) btn.classList.add("on");
    else btn.classList.remove("on");

    // تغییر favicon
    document.getElementById("favicon").href = torchOn ? "on.ico" : "off.ico";
  } else {
    alert("NOT SUPPORT.");
  }
}

document.getElementById("toggleBtn").addEventListener("click", toggleFlash);
