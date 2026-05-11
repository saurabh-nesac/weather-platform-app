
import { store }
from '@/core/state/store.js';

let timer = null;

export function setupPlaybackControls() {

    const playBtn =
        document.getElementById('playBtn');

    const stopBtn =
        document.getElementById('stopBtn');

    if (playBtn) {

        playBtn.onclick = () => {

            if (timer) return;

            store.playing = true;

            timer = setInterval(() => {

                store.currentFrame++;

                if (store.currentFrame > 48) {
                    store.currentFrame = 1;
                }

                const slider =
                    document.getElementById('frameSlider');

                if (slider) {
                    slider.value = store.currentFrame;
                }

            }, 500);
        };
    }

    if (stopBtn) {

        stopBtn.onclick = () => {

            clearInterval(timer);

            timer = null;

            store.playing = false;
        };
    }
}