import * as THREE from 'three';

let sound;
let listener;
let isBGMPlaying = false;

export function startBGM() {
    if (isBGMPlaying) return;
    isBGMPlaying = true;

    listener = new THREE.AudioListener();
    document.dispatchEvent(new CustomEvent('bgmListenerReady', { detail: listener }));

    sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();

    audioLoader.load('/bgm.mp3', function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        sound.play();
    });

    document.getElementById("playBGM").style.display = "none";
}

export function setBGMVolume(volume) {
    if (sound) {
        sound.setVolume(volume);
    }
}

// **イベントリスナー**
document.getElementById("playBGM").addEventListener("click", startBGM);
document.getElementById("volume").addEventListener("input", (event) => {
    setBGMVolume(parseFloat(event.target.value));
});