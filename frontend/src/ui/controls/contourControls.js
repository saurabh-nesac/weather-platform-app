export function setupContourControls(map) {

    const checkbox =
        document.getElementById('toggleContours');

    if (!checkbox) return;

    checkbox.onchange = () => {

        const visible =
            checkbox.checked;

        map.setLayoutProperty(
            'gpm-contours-line',
            'visibility',
            visible ? 'visible' : 'none'
        );
    };
}