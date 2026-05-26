import { setupTimelineControls }
from './timelineControls.js';

import { setupVariableControls }
from './variableControls.js';

import { setupPlaybackControls }
from './playbackControls.js';

import { setupBasemapControls }
from './basemapControls.js';

import { setupContourControls }
from './contourControls.js';

import { setupOpacityControls }
from './opacityControls.js';

import { setupAnalyticsControls }
from './analyticsControls.js';

export function createControls(map) {

    setupTimelineControls(map);

    setupVariableControls();

    setupPlaybackControls();

    setupBasemapControls(map);

    setupContourControls(map);

    setupOpacityControls(map);

    setupAnalyticsControls();
}