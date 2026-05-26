import { store }
    from '@/core/state/store.js';

import { emitAsync }
    from '@/core/events/bus.js';

export function setupTimelineControls(map) {

    const slider =
        document.getElementById(
            'frameSlider'
        );

    if (!slider) return;

    slider.oninput = async () => {

        const frame =
            Number(slider.value);

        store.app.currentFrame =
            frame;

        const timestamp =
            store.cache.metadata?.[
                store.app.currentVariable
            ]?.[
                frame
            ]?.timestamp || null;

        await emitAsync(
            'frameChanged',
            {
                frame,
                timestamp
            }
        );
    };
}