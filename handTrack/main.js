navigator.mediaDevices.getUserMedia =
  navigator.mediaDevices.getUserMedia ||
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

const video = document.getElementById('video')
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

let model
function handDetection() {
  model.detect(video).then(predictions => {
    model.renderPredictions(predictions, canvas, context, video)
  })
  requestAnimationFrame(handDetection)
}

function startVideo() {
  handTrack.startVideo(video).then(({ status }) => {
    if (status) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          video.srcObj = stream
          handDetection()
        })
    }
  })
}

handTrack.load().then(loadModel => {
  model = loadModel
  startVideo()
})