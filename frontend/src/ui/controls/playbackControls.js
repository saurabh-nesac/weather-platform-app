//src\ui\controls\playbackControls.js

import {
    startPlayback,
    stopPlayback
}
    from '@/rendering/playback/playBackController.js';

import { on }
    from '@/core/events/bus.js';

export function setupPlaybackControls() {

    const playBtn =
        document.getElementById('playBtn');

    const stopBtn =
        document.getElementById('stopBtn');

    if (playBtn) {

        playBtn.onclick = () => {
            startPlayback();
        };
    }

    if (stopBtn) {

        stopBtn.onclick = () => {
            stopPlayback();
        };
    }

    on('frameChanged', payload => {

        const {
            frame,
            timestamp
        } = payload;

        console.log(
            'Forecast Timestamp:',
            timestamp
        );

        const slider =
            document.getElementById('frameSlider');

        const label =
            document.getElementById('frameLabel');

        if (slider) {
            slider.value = frame;
        }

        if (label) {
            label.textContent =
                timestamp
                    ? `Frame ${frame} • ${timestamp}`
                    : `Frame ${frame}`;
        }
    });
}