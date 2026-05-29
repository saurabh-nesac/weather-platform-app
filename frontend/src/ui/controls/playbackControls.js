import {

    startPlayback,
    stopPlayback

} from '@/rendering/playback/playBackController.js';


// ============================================================
// PLAYBACK CONTROLS
// ============================================================

export function setupPlaybackControls(
    container
) {

    const wrapper =
        document.createElement('div');

    wrapper.className = `
        grid
        grid-cols-2
        gap-2
    `;

    // --------------------------------------------------------
    // PLAY
    // --------------------------------------------------------

    const playBtn =
        document.createElement('button');

    playBtn.className = `
        rounded-xl
        bg-cyan-500
        hover:bg-cyan-400
        text-black
        font-semibold
        py-2
        transition
    `;

    playBtn.innerText =
        'Play';

    playBtn.onclick = () => {

        startPlayback();
    };

    // --------------------------------------------------------
    // STOP
    // --------------------------------------------------------

    const stopBtn =
        document.createElement('button');

    stopBtn.className = `
        rounded-xl
        bg-slate-800
        hover:bg-slate-700
        text-white
        py-2
        transition
    `;

    stopBtn.innerText =
        'Stop';

    stopBtn.onclick = () => {

        stopPlayback();
    };

    wrapper.appendChild(playBtn);

    wrapper.appendChild(stopBtn);

    container.appendChild(wrapper);
}