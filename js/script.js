const heartButton = document.querySelector("#heart");
const emoji = document.querySelector("#emoji");
const div = document.querySelector("#message")
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const audio = new Audio('../music.mp3');

let time = 1;
let isModelLoaded = false;
let noMusicPlaying = true;
let poses = []
ctx.strokeStyle = 'red';
ctx.lineWidth = 3;
ctx.translate(640, 0);
ctx.scale(-1, 1);

let animating = false

heartButton.addEventListener("click", () => lotsOfEmoji());
emojiArray = ["❤️‍🔥", "🌟", "💯", "💥", "👌"];

function lotsOfEmoji() {
    animating = true
    for (let i = 0; i < 20; i++) {
        createEmoji("left");
        createEmoji("right");
    }
}

function createEmoji(position) {
    const div = document.createElement("div");
    document.body.appendChild(div);
    div.innerHTML = emojiArray[Math.floor(Math.random() * 5)];
    div.style.width = Math.random() * 300 + "px";
    div.classList.add("emoji", "emoji-pos-" + position);
    div.style.animationDelay = `${Math.random()}s`;
    div.classList.add("moving");
    // remove the div at the end of the animation!
    div.addEventListener("animationend", (e) => e.target.remove());
}

function playMusic() {
    if(noMusicPlaying) {
        console.log('started')
        audio.play();
        noMusicPlaying = false;
    }
}

//Tracking part

// Create a new poseNet method
const poseNet = ml5.poseNet(video, modelLoaded)
poseNet.on('pose', (results) => {
    poses = results;
});

// When the model is loaded
function modelLoaded() {
    console.log('Model Loaded!');
    isModelLoaded = true;
    div.innerHTML = "Posenet model loaded!"
}

// Create a webcam capture
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.srcObject = stream;
        video.play();

        /* double check your webcam width / height */
        let stream_settings = stream.getVideoTracks()[0].getSettings()
        console.log('Width: ' + stream_settings.width)
        console.log('Height: ' + stream_settings.height)
    });
}

function drawCameraIntoCanvas() {
    if(isModelLoaded) {
        // ctx.drawImage(video, 0, 0, 640, 360); //16:9
        ctx.beginPath();
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = 'black';
        ctx.stroke();
        drawKeypoints();
        drawSkeleton();

        //activating pose detection (inside here you can place timestamps)
        detectPoses();
        playMusic();

        //timer
        time+=1;
        console.log(time)

        if(time == 54) {
            console.log('begin zang');
        }
    } else {
        console.log('No model')
    }
    setTimeout(() => {
        window.requestAnimationFrame(drawCameraIntoCanvas);
    }, 500);
}

function detectWrists(){
    for(let p of poses) {
        console.log(p.pose)
        console.log(`${p.pose.leftWrist.y} , ${p.pose.rightWrist.y}`)
        if(p.pose.leftWrist.y < 50 && p.pose.rightWrist.y < 50) {
            if(!animating) {
                lotsOfEmoji()
            }
        }
    }
}

function detectPoses() {
    // console.log(poses.length)
    for (let pose of poses) {
        
        //hiero komen functies die danspasjes detecten
    }
}


// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i += 1) {
        // For each pose detected, loop through all the keypoints
        for (let j = 0; j < poses[i].pose.keypoints.length; j += 1) {
            let keypoint = poses[i].pose.keypoints[j];
            // Only draw an ellipse is the pose probability is bigger than 0.2
            if (keypoint.score > 0.2) {
                ctx.beginPath();
                ctx.arc(keypoint.position.x, keypoint.position.y, 10, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
    }
}

// A function to draw the skeletons
function drawSkeleton() {
    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i += 1) {
        // For every skeleton, loop through all body connections
        for (let j = 0; j < poses[i].skeleton.length; j += 1) {
            let partA = poses[i].skeleton[j][0];
            let partB = poses[i].skeleton[j][1];
            ctx.beginPath();
            ctx.moveTo(partA.position.x, partA.position.y);
            ctx.lineTo(partB.position.x, partB.position.y);
            ctx.stroke();
        }
    }
}

drawCameraIntoCanvas()