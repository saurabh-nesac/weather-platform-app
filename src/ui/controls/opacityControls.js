export function setupOpacityControls(map) {

    const slider =
        document.getElementById('opacitySlider');

    if (!slider) return;

    slider.oninput = () => {

        const opacity =
            Number(slider.value);

        console.log('Opacity:', opacity);
    };
}