const AudioContext = window.AudioContext || window.webkitAudioContext;
const audio = new AudioContext();
const compressor = audio.createDynamicsCompressor();
compressor.connect(audio.destination);

const playNote = (e) => {
    // play note according to freq attribute
    (new SoundPlayer(audio, compressor)).play(e.target.dataset.frequency, 1, "sine").stop(0.3);
    e.cancelBubble = true;
    e.target.classList.add("pressed");
    setTimeout(function(){e.target.classList.remove("pressed")}, 200);
};

for (let el of document.getElementById("piano").getElementsByTagName("DIV")) {
    el.addEventListener("click", playNote, false);
}

const freq = {
    C4: 261.626,
    C4s: 277.18,
    D4: 293.66,
    Ds: 311.13,
    E4: 329.63,
    F4: 349.23,
    F4s: 369.99,
    G4: 392.00,
    Gs: 415.30,
    A4: 440.00,
    A4s: 466.16,
    B4: 493.88,
    C5: 523.25,
    PP: 1
}

const hpbd = ["C4:0.5","C4:0.25","D4:0.75","C4:0.75","F4:0.75","E4:1","PP:1","C4:0.5","C4:0.25","D4:0.75","C4:0.75","G4:0.75","F4:1"];

let tracker = [];
let tune = [];
let start = 0;
let end;
let tempo = 1;
let stop = 0;

const generateTune = (t) => {

    for (let i = 0; i < t.length; i++) {
        let n = t[i].split(':')[0];
        let d = parseFloat(t[i].split(':')[1]) * tempo;
        // console.log(n);
        // console.log(d);

        end = (d + start);

        tune.push([n, eval('freq.' + n), start, end]);

        start = (start + d);
    }

    console.log(tune);
};

playTune = (e) => {

    document.getElementById("tempo-overlay").style.display = "block";
    document.getElementById("btn-play").style.display = "none";
    document.getElementById("btn-stop").style.display = "block";

    for (let i = 0; i < tune.length; i++) {
        if (tune[i][0] == "PP") {
            // dont press key
        }
        else {
            let key = document.querySelector(`[data-note="${String(tune[i][0])}"]`);
            setTimeout(function(){key.classList.add("pressed")}, tune[i][2] * 1000 - 50);
            setTimeout(function(){key.classList.remove("pressed")}, tune[i][3] * 1000 - 100);
        }
        (new SoundPlayer(audio, compressor)).play(tune[i][1], 1, "sine", tune[i][2]).stop(tune[i][3]);
        tracker.push(audio);
    }

    setTimeout(function(){
        document.getElementById("tempo-overlay").style.display = "none";
        document.getElementById("btn-play").style.display = "block";
        document.getElementById("btn-stop").style.display = "none";
        console.log("timeout " + end * 1000);
    }, end * 1000);

    // (new SoundPlayer(audio, compressor)).play(587.3, 0.5, "sine", 0.0).stop(0.25);
    // (new SoundPlayer(audio, compressor)).play(587.3, 0.5, "sine", 0.3).stop(0.35);
    // (new SoundPlayer(audio, compressor)).play(659.3, 0.5, "sine", 0.4).stop(0.55);
    // (new SoundPlayer(audio, compressor)).play(587.3, 0.5, "sine", 0.6).stop(0.75);
    // (new SoundPlayer(audio, compressor)).play(784.0, 0.5, "sine", 0.8).stop(0.95);
    // (new SoundPlayer(audio, compressor)).play(740.0, 0.5, "sine", 1.0).stop(1.40);
}

stopTune = (e) => {
    console.log("click");
    for (let i = 0; i < tracker.length; i++) {
        // audio.suspend();
        // audio.resume();
        // SoundPlayer.stop();
    }
    location.reload();
};

changeTempo = (e) => {
    tempo = this.getAttribute("data-tempo");
    console.log(tempo);
};

document.getElementById("btn-play").addEventListener("click", playTune);
document.getElementById("btn-stop").addEventListener("click", stopTune);

let tempoButtons = document.getElementsByClassName("tempo");
for (let i = 0; i < tempoButtons.length; i++) {
    ele = document.getElementsByClassName("tempo")[i].addEventListener("click", function() {
        tempo = this.getAttribute("data-tempo");
        for (let i = 0; i < tempoButtons.length; i++) {
            document.getElementsByClassName("tempo")[i].classList.remove('active');
        }
        this.classList.add('active');
        console.log("Tempo: " + tempo);
        tune = [];
        start = 0;
        end = 0;
        generateTune(hpbd);
    });
}

function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

eventFire(document.getElementById("default-tempo"), "click");
// generateTune(hpbd);
// console.log(tune);