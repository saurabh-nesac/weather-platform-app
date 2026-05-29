import { BASEMAPS }
    from '@/rendering/map/basemaps.js';


// ============================================================
// BASEMAP CONTROLS
// ============================================================

export function setupBasemapControls(

    map,

    container
) {

    const wrapper =
        document.createElement('div');

    wrapper.className =
        'space-y-2';

    // --------------------------------------------------------
    // LABEL
    // --------------------------------------------------------

    const label =
        document.createElement('div');

    label.className =
        'text-sm text-slate-300';

    label.innerText =
        'Basemap';

    // --------------------------------------------------------
    // SELECT
    // --------------------------------------------------------

    const select =
        document.createElement('select');

    select.className = `
        w-full
        rounded-xl
        bg-slate-900
        border
        border-slate-700
        px-3
        py-2
        text-sm
        text-white
    `;

    // --------------------------------------------------------
    // OPTIONS
    // --------------------------------------------------------

    Object.keys(BASEMAPS)
        .forEach(key => {

            const option =
                document.createElement('option');

            option.value =
                key;

            option.innerText =
                key.toUpperCase();

            select.appendChild(option);
        });

    // --------------------------------------------------------
    // EVENT
    // --------------------------------------------------------

    select.onchange = () => {

        map.getSource('basemap')
            .setTiles(
                BASEMAPS[
                select.value
                ]
            );
    };

    wrapper.appendChild(label);

    wrapper.appendChild(select);

    container.appendChild(wrapper);
}