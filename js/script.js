// const heartButton = document.querySelector("#heart");
const emoji = document.querySelector("#emoji");
const div = document.querySelector("#message")
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");
const audio = new Audio('music.mp3');

const text = document.getElementById('text');

var focused = true;

window.onfocus = function() {
    focused = true;
};
window.onblur = function() {
    focused = false;
};

let time = 1;
let isModelLoaded = false;
let noMusicPlaying = true;
let poses = []
// ctx.strokeStyle = 'red';
// ctx.lineWidth = 3;
// ctx.translate(640, 0);
// ctx.scale(-1, 1);

let animating = false

// heartButton.addEventListener("click", () => lotsOfEmoji(20));
emojiArray = [
    "❤️‍🔥", 
    "🌟", 
    "💯", 
    "💥", 
    "👌",
];

let timeline = [

    {
        "start":5,
        "end":39,
        "func":"screenText(poses.length + ' players are detected', '1em')"
    },

    {
        "start":40,
        "end":40,
        "func":"screenText('Get ready!', '1em')"
    },

    {
        "start":44,
        "end":44,
        "func":"screenText('3', '1.2em')"
    },

    {
        "start":46,
        "end":46,
        "func":"screenText('2', '1.4em')"
    },

    {
        "start":49,
        "end":49,
        "func":"screenText('1', '1.6em')"
    },

    {
        "start":51,
        "end":51,
        "func":"console.log('begin zang'); createArtist('TWY.mp4'); "
    },

    {
        "start":55,
        "end":80,
        "func":"detectPoses(3, 'wristAboveShoulder');"
    },

    {
        "start":81,
        "end":85,
        "func":"detectPoses(3, 'wristBelowShoulder');"
    },

    {
        "start":86,
        "end":90,
        "func":"detectPoses(3, 'wristAboveShoulder');"
    },

];

let dancemoves = {

    "handsUp" : {
        "bodyPart1" : "leftWrist",
        "operator" : "<",
        "bodyPart2" : "nose",
        "axis" : "y"
    },
    "handsDown" : {
        "bodyPart1" : "leftWrist",
        "operator" : ">",
        "bodyPart2" : "nose",
        "axis" : "y"
    },
    "wristAboveHip" : {
        "bodyPart1" : "leftWrist",
        "operator" : "<",
        "bodyPart2" : "leftHip",
        "axis" : "y"
    },
    "wristBelowEye" : {
        "bodyPart1" : "leftWrist",
        "operator" : ">",
        "bodyPart2" : "leftEye",
        "axis" : "y"
    },
    "wristAboveShoulder" : {
        "bodyPart1" : "leftWrist",
        "operator" : "<",
        "bodyPart2" : "leftShoulder",
        "axis" : "y"
    },
    "wristBelowShoulder" : {
        "bodyPart1" : "leftWrist",
        "operator" : ">",
        "bodyPart2" : "leftShoulder",
        "axis" : "y"
    }
};

// BODYPARTS::::
// leftAnkle
// leftEar
// leftElbow
// leftEye
// leftHip
// leftKnee
// leftShoulder
// leftWrist
// nose
// rightAnkle
// rightEar
// rightElbow
// rightEye
// rightHip
// rightKnee
// rightShoulder
// rightWrist

let operators = {
    "==": function(a,b){return a==b;}, //equal
    "<=": function(a,b){return a<=b;}, //equal or smaller
    ">=": function(a,b){return a>=b;}, //equal or bigger
    "<": function(a,b){return a<b;}, //smaller
    ">": function(a,b){return a>b;} //bigger
};

function lotsOfEmoji(x) {
    // if(animating === false) {
        // animating = true
        for (let i = 0; i < x; i++) {
            createEmoji("left");
            createEmoji("right");
        }
    // }
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
    div.addEventListener("animationend", (e) => {
        e.target.remove();
        animating = false;
    });
}

function playVideo() {
    let vid = document.getElementById('vid');
    vid.play();
}

function pauseVideo() {
    let vid = document.getElementById('vid');
    vid.pause();
}

function playMusic() {
    if(noMusicPlaying) {
        console.log('started')
        audio.play();
        noMusicPlaying = false;
    }
}

function pauseMusic() {
    console.log('stopped')
    noMusicPlaying = true;
    audio.pause();
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

function screenText(t,size) {
    text.innerHTML = t;
    text.style.fontSize = size;
}

// Create a webcam capture
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        // video.src = "move_1.mp4";
        video.srcObject = stream;
        video.play();

        /* double check your webcam width / height */
        let stream_settings = stream.getVideoTracks()[0].getSettings()
        console.log('Width: ' + stream_settings.width)
        console.log('Height: ' + stream_settings.height)
    });
}

function createArtist(danceMove) {
    videoDiv = document.getElementById('centerDiv');
    videoDiv.innerHTML = `
    <video src=${danceMove} width="900px" height="500px" autoplay id="vid"></video>
    `;
}

function gameLoop() {
    if(isModelLoaded) {
        // ctx.drawImage(video, 0, 0, 640, 360); //16:9
        // ctx.beginPath();
        // ctx.fillRect(0,0,canvas.width,canvas.height);
        // ctx.fillStyle = 'black';
        // ctx.stroke();
        // drawKeypoints();
        // drawSkeleton();

        //activating pose detection (inside here you can place timestamps)
        
        if (!focused) {
            pauseMusic();
            if(document.getElementById('vid') !== null) {
                pauseVideo();
            }
        } else {
            playMusic();
            if(document.getElementById('vid') !== null) {
                playVideo();
            }

            //timer
            if(!noMusicPlaying) {
                time+=1;
                console.log(time);
            }

            for(let timing of timeline) {
                if(time >= parseInt(timing.start) && time <= parseInt(timing.end)) {
                    var F = new Function (timing.func);
                    F()
                }
            }
        }


    } else {
        console.log('No model');
        screenText('You need to turn on you camera', '1em');
    }
    setTimeout(() => {
        window.requestAnimationFrame(gameLoop);
    }, 500);
}

/**
 * @description Detects if dancemove is excecuted by player
 * @param {obj} dancemove Dancemove as Object
 * @param {int} feedback Amount of feedback
 */

function detectPoses(feedback, move, move2 = null) {
    move = dancemoves[move]
    // console.log(Object.keys(move).length);

    for (let pose of poses) {
        pose = pose.pose;

        //checking first move
        if (move.operator in operators && operators[move.operator](pose[move.bodyPart1][move.axis], pose[move.bodyPart2][move.axis])) {
            //if 2nd move, check that one too
            if (move2 !== null) {
                if (move2.operator in operators && operators[move2.operator](pose[move2.bodyPart1][move2.axis], pose[move2.bodyPart2][move2.axis])) {
                    lotsOfEmoji(feedback);
                    console.log('goed')
                } else {
                    console.log('geen goede houding')
                }
            } else {
                lotsOfEmoji(feedback);
                console.log('goed')
            }
        } else {
            console.log('geen goede houding')
        }
    }


    // for (let pose of poses) {
    //     pose = pose.pose;
        

    //     if(pose.leftWrist.y < pose.nose.y && pose.leftWrist.confidence > 0.1 && time > 10 && time < 73) {
    //         console.log(pose.leftWrist);
    //         lotsOfEmoji(3);
    //     }
    //     //hiero komen functies die danspasjes detecten
    // }
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

gameLoop()