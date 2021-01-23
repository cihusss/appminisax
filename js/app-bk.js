const AudioContext = window.AudioContext || window.webkitAudioContext;
const audio = new AudioContext();
const compressor = audio.createDynamicsCompressor();
compressor.connect(audio.destination);

const freq = {
    C4: 261.626,
    C4s: 277.18,
    D4: 293.66,
    D4s: 311.13,
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

const fingering = {
    C4: {hole1: 1, hole2: 1, hole3: 1, hole4: 1, hole5: 1, hole6: 1, hole7: 1},
    C4s: {hole1: .5, hole2: 1, hole3: 1, hole4: 1, hole5: 1, hole6: 1, hole7: 1},
    D4: {hole1: 0, hole2: 1, hole3: 1, hole4: 1, hole5: 1, hole6: 1, hole7: 1},
    D4s: {hole1: 0, hole2: .5, hole3: 1, hole4: 1, hole5: 1, hole6: 1, hole7: 1},
    E4: {hole1: 0, hole2: 0, hole3: 1, hole4: 1, hole5: 1, hole6: 1, hole7: 1},
    F4: {hole1: 0, hole2: 0, hole3: 0, hole4: 1, hole5: 1, hole6: 1, hole7: 1},
    F4s: {hole1: 0, hole2: 1, hole3: 1, hole4: .5, hole5: 1, hole6: 1, hole7: 1},
    G4: {hole1: 0, hole2: 0, hole3: 0, hole4: 0, hole5: 1, hole6: 1, hole7: 1},
    G4s: {hole1: 0, hole2: 1, hole3: 1, hole4: 1, hole5: 0, hole6: 1, hole7: 1},
    A4: {hole1: 0, hole2: 0, hole3: 0, hole4: 0, hole5: 0, hole6: 1, hole7: 1},
    A4s: {hole1: 0, hole2: 0, hole3: 1, hole4: 1, hole5: 1, hole6: 0, hole7: 1},
    B4: {hole1: 0, hole2: 0, hole3: 0, hole4: 0, hole5: 0, hole6: 0, hole7: 1},
    C5: {hole1: 0, hole2: 0, hole3: 0, hole4: 0, hole5: 0, hole6: 0, hole7: 0}
}

const tunes = {
    hpbd: ["C4:.5","C4:.25","D4:.75","C4:.75","F4:.75","E4:1","PP:1","C4:.5","C4:.25","D4:.75","C4:.75","G4:.75","F4:1"],
    pink: ["D4s:.25","E4:.5","PP:.5", "F4s:.25","G4:.5"] 
}

// const hpbd = ["C4:0.5","C4:0.25","D4:0.75","C4:0.75","F4:0.75","E4:1","PP:1","C4:0.5","C4:0.25","D4:0.75","C4:0.75","G4:0.75","F4:1"];

let tracker = [];
let tune = [];
let start = 0;
let end;
let tempo = 1;
let stop = 0;
let holes = document.getElementsByClassName("hole");
let display = document.getElementById("display");
let selectedTune = document.getElementById("tunes-selector").value;
console.log(selectedTune);

const generateTune = (t) => {

    tune = [];
    start = 0;
    end = 0;

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

    for (let note = 0; note < tune.length; note++) {


        if (tune[note][0] == "PP") {
            // dont press key
        }
        else {
            tuneNote = tune[note][0];
            console.log(tuneNote);

            fingeringKey = fingering[tuneNote];
            // console.log(fingeringKey);

            for (let i = 0; i < Object.keys(fingeringKey).length; i++) {
                let keyname = Object.keys(fingeringKey)[i];
                console.log(keyname);
                // let holeKey = document.getElementsByClassName("whole")[i];
                ii = i + 1;
                let holeKey = document.getElementById("hole" + ii);
                let holeKeyHalf = document.getElementById("hole" + ii + "-half");
                // console.log(holeKey);
                let holeVal = fingeringKey[keyname];
                // console.log(holeVal);

                // console.log(i);

                // holeKey.classList.add("orange");
                if (holeVal == 1) {
                    setTimeout(function(){holeKey.style.background = "#ff4700"}, tune[note][2] * 1000);
                    setTimeout(function(){holeKey.style.background = "#000000"}, tune[note][3] * 1000 - 100);
                }

                else if (holeVal == .5) {
                    setTimeout(function(){holeKeyHalf.style.background = "#ff4700"}, tune[note][2] * 1000);
                    setTimeout(function(){holeKeyHalf.style.background = "none"}, tune[note][3] * 1000 - 100);
                }
            }
            setTimeout(function(){display.innerHTML = tune[note][0]}, tune[note][2] * 1000);
            setTimeout(function(){display.innerHTML = "&mdash;"}, tune[note][3] * 1000 - 1);
        };
        (new SoundPlayer(audio, compressor)).play(tune[note][1], 1, "sine", tune[note][2]).stop(tune[note][3]);
        tracker.push(audio);
    };

    setTimeout(function(){
        document.getElementById("tempo-overlay").style.display = "none";
        document.getElementById("btn-play").style.display = "block";
        document.getElementById("btn-stop").style.display = "none";
        console.log("timeout " + end * 1000);
    }, end * 1000);
};

stopTune = (e) => {
    location.reload();
};

changeTempo = (e) => {
    tempo = this.getAttribute("data-tempo");
    console.log(tempo);
};

document.getElementById("btn-play").addEventListener("click", playTune);
document.getElementById("btn-stop").addEventListener("click", stopTune);

let tempoButtons = document.getElementsByClassName("tempo");

setup = (e) => {
    // for (let i = 0; i < tempoButtons.length; i++) {
    //     ele = document.getElementsByClassName("tempo")[i].addEventListener("click", function() {
    //         tempo = this.getAttribute("data-tempo");
    //         for (let i = 0; i < tempoButtons.length; i++) {
    //             document.getElementsByClassName("tempo")[i].classList.remove('active');
    //         }
    //         this.classList.add('active');
    //         console.log("Tempo: " + tempo);
    //         generateTune(tunes.selectedTune);
    //     });
    // }
};

for (let i = 0; i < tempoButtons.length; i++) {
    ele = document.getElementsByClassName("tempo")[i].addEventListener("click", function() {
        tempo = this.getAttribute("data-tempo");
        for (let i = 0; i < tempoButtons.length; i++) {
            document.getElementsByClassName("tempo")[i].classList.remove('active');
        }
        this.classList.add('active');
        console.log("Tempo: " + tempo);
        generateTune(tunes.hpbd);
    });
}

function eventFire(el, etype){
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        let evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

const selectTune = () => {
    selectedTune = document.getElementById("tunes-selector").value;
    // console.log(selectedTune);
    generateTune(tunes[selectedTune]);
}

document.getElementById("tunes-selector").addEventListener("change", selectTune);

eventFire(document.getElementById("default-tempo"), "click");
setup();

// generateTune(hpbd);
// console.log(tune);