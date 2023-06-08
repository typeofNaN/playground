const MODEL_PATH = './models'

const video = document.getElementById('video')

async function getCamera() {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
    video.srcObject = mediaStream
  } catch (e) {
    console.log(e)
  }
}

async function loadModels() {
  await faceapi.loadTinyFaceDetectorModel(MODEL_PATH)
  await faceapi.loadFaceLandmarkTinyModel(MODEL_PATH)
  await faceapi.loadFaceExpressionModel(MODEL_PATH)
  await faceapi.loadAgeGenderModel(MODEL_PATH)

  getCamera()
}

function detectFace() {
  const canvas = faceapi.createCanvasFromMedia(video)
  const ctx = canvas.getContext('2d')
  const { width, height } = video
  document.body.append(canvas)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video,
      new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks(true)
      .withFaceExpressions()
      .withAgeAndGender();

    const resizedDetections = faceapi.resizeResults(detections, { width, height });
    ctx.clearRect(0, 0, width, height)

    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    resizedDetections.forEach(result => {
      const { age, gender, genderProbability } = result
      new faceapi.draw.DrawTextField(
        [
          `${gender === 'male' ? '男' : '女'} ${~~age} 岁`
        ],
        result.detection.box.bottomLeft
      )
        .draw(canvas)
    })
  }, 300)
}

video.addEventListener('play', detectFace)
loadModels()