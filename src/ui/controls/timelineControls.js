import { store }
from '@/core/state/store.js';


export function setupTimelineControls(map) {

    const slider =
        document.getElementById('frameSlider');

    const label =
        document.getElementById('frameLabel');

    if (!slider) return;

    slider.oninput = async () => {

        const frame = Number(slider.value);

        store.app.currentFrame = frame;

        label.textContent =
            `Frame ${frame}`;

        map.triggerRepaint();
        console.log('Frame changed:', frame);
    };
}