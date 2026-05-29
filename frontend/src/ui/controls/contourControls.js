// frontend/src/ui/controls/contourControls.js

export function setupContourControls(

    map,

    container
) {

    // ========================================================
    // WRAPPER
    // ========================================================

    const wrapper =
        document.createElement('div');

    wrapper.className = `
        flex
        items-center
        justify-between
    `;

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
        'Show Contours';

    // ========================================================
    // CHECKBOX
    // ========================================================

    const checkbox =
        document.createElement('input');

    checkbox.type =
        'checkbox';

    checkbox.checked =
        true;

    checkbox.className = `
        h-4
        w-4
        accent-cyan-400
        cursor-pointer
    `;

    // ========================================================
    // EVENT
    // ========================================================

    checkbox.onchange = () => {

        const visible =
            checkbox.checked;

        // ----------------------------------------------------
        // LINE
        // ----------------------------------------------------

        if (

            map.getLayer(
                'gpm-contours-line'
            )

        ) {

            map.setLayoutProperty(

                'gpm-contours-line',

                'visibility',

                visible
                    ? 'visible'
                    : 'none'
            );
        }

        // ----------------------------------------------------
        // FILL
        // ----------------------------------------------------

        if (

            map.getLayer(
                'gpm-contours-fill'
            )

        ) {

            map.setLayoutProperty(

                'gpm-contours-fill',

                'visibility',

                visible
                    ? 'visible'
                    : 'none'
            );
        }
    };

    // ========================================================
    // BUILD
    // ========================================================

    wrapper.appendChild(label);

    wrapper.appendChild(checkbox);

    container.appendChild(wrapper);
}