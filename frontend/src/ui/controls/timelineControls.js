import {

    setFrame

} from '@/core/timeline/setFrame.js';
import { store }
    from '@/core/state/store.js';

import { emitAsync }
    from '@/core/events/bus.js';
import {

    on

} from '@/core/events/bus.js';

// ============================================================
// TIMELINE CONTROLS
// ============================================================

export function setupTimelineControls(

    map,

    container
) {

    const wrapper =
        document.createElement('div');

    wrapper.className =
        'space-y-3';

    // ========================================================
    // LABEL
    // ========================================================

    const label =
        document.createElement('div');

    label.className = `
        text-sm
        text-slate-300
    `;

    label.innerText =
        'Frame / Time';

    // ========================================================
    // TIMESTAMP
    // ========================================================

    const timestamp =
        document.createElement('div');

    timestamp.className = `
        text-xs
        text-cyan-400
        font-mono
    `;

    timestamp.innerText =
        'Loading...';

    // ========================================================
    // SLIDER
    // ========================================================

    const slider =
        document.createElement('input');

    slider.type =
        'range';

    slider.min = 0;

    slider.max = 48;

    slider.value =
        store.app.currentFrame;

    slider.className = `
        w-full
        accent-cyan-400
        cursor-pointer
    `;

    // ========================================================
    // UPDATE LABEL
    // ========================================================

    function updateLabel(
        frame
    ) {

        const ts =
            store.cache.metadata?.[
                store.app.currentVariable
            ]?.[
                frame
            ]?.timestamp;

        timestamp.innerText =
            ts || `Frame ${frame}`;
    }

    updateLabel(
        store.app.currentFrame
    );

    // ========================================================
    // FRAME SYNCHRONIZATION
    // ========================================================

    on(

        'frameChanged',

        payload => {

            const {
                frame,
                timestamp: ts
            } = payload;

            slider.value =
                frame;

            timestamp.innerText =
                ts || `Frame ${frame}`;
        }
    );

    // ========================================================
    // EVENT
    // ========================================================

    slider.oninput = async () => {

        const frame =
            Number(slider.value);

        await setFrame(frame);
    };

    // ========================================================
    // BUILD
    // ========================================================

    wrapper.appendChild(label);

    wrapper.appendChild(timestamp);

    wrapper.appendChild(slider);

    container.appendChild(wrapper);
}