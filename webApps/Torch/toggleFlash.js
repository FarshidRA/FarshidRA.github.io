let stream;
let track;

async function toggleFlash() {
  if (!stream) {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    track = stream.getVideoTracks()[0];
  }

  const imageCapture = new ImageCapture(track);
  const capabilities = await imageCapture.getPhotoCapabilities();

  if (capabilities.torch) {
    const torchOn = track.getSettings().torch || false;
    await track.applyConstraints({ advanced: [{ torch: !torchOn }] });
  } else {
    alert("Not Support!");
  }
}
