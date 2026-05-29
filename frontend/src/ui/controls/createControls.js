//frontend/src/ui/controls/createControls.js
import {

    setupTimelineControls

} from './timelineControls.js';

import {

    setupVariableControls

} from './variableControls.js';

import {

    setupPlaybackControls

} from './playbackControls.js';

import {

    setupBasemapControls

} from './basemapControls.js';

import {

    setupContourControls

} from './contourControls.js';

import {

    setupOpacityControls

} from './opacityControls.js';

import {

    setupAnalyticsControls

} from './analyticsControls.js';


// ============================================================
// CREATE SIDEBAR SECTION
// ============================================================

function createSection(
    title
) {

    const section =
        document.createElement('div');

    section.className = `
        border-b
        border-slate-800
        p-4
        space-y-3
    `;

    const heading =
        document.createElement('div');

    heading.className = `
        text-xs
        font-semibold
        tracking-wider
        uppercase
        text-cyan-400
    `;

    heading.innerText =
        title;

    section.appendChild(
        heading
    );

    return section;
}


// ============================================================
// CREATE CONTROLS
// ============================================================

export function createControls(

    map,

    sidebar
) {

    sidebar.innerHTML = '';

    // --------------------------------------------------------
    // TITLE
    // --------------------------------------------------------

    const title =
        document.createElement('div');

    title.className = `
        h-14
        flex
        items-center
        px-4
        border-b
        border-slate-800
        text-lg
        font-bold
        text-cyan-400
    `;

    title.innerText =
        'Atmospheric Engine';

    sidebar.appendChild(
        title
    );

    // ========================================================
    // VARIABLES
    // ========================================================

    const variableSection =
        createSection(
            'Variables'
        );

    sidebar.appendChild(
        variableSection
    );

    setupVariableControls(
        variableSection
    );

    // ========================================================
    // TIMELINE
    // ========================================================

    const timelineSection =
        createSection(
            'Timeline'
        );

    sidebar.appendChild(
        timelineSection
    );

    setupTimelineControls(

        map,

        timelineSection
    );

    // ========================================================
    // PLAYBACK
    // ========================================================

    const playbackSection =
        createSection(
            'Playback'
        );

    sidebar.appendChild(
        playbackSection
    );

    setupPlaybackControls(
        playbackSection
    );

    // ========================================================
    // BASEMAP
    // ========================================================

    const basemapSection =
        createSection(
            'Basemap'
        );

    sidebar.appendChild(
        basemapSection
    );

    setupBasemapControls(

        map,

        basemapSection
    );

    // ========================================================
    // CONTOURS
    // ========================================================

    const contourSection =
        createSection(
            'Contours'
        );

    sidebar.appendChild(
        contourSection
    );

    setupContourControls(

        map,

        contourSection
    );

    // ========================================================
    // OPACITY
    // ========================================================

    const opacitySection =
        createSection(
            'Opacity'
        );

    sidebar.appendChild(
        opacitySection
    );

    setupOpacityControls(

        map,

        opacitySection
    );

    // ========================================================
    // ANALYTICS
    // ========================================================

    const analyticsSection =
        createSection(
            'Analytics'
        );

    sidebar.appendChild(
        analyticsSection
    );

    setupAnalyticsControls(
        analyticsSection
    );
}