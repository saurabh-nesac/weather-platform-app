// src/ui/sidebar/createSidebarControls.js

export function createSidebarControls(
    container
) {

    container.innerHTML = `

        <div class="space-y-5">

            <!-- ===================================== -->
            <!-- TITLE -->
            <!-- ===================================== -->

            <div>

                <div class="text-zinc-100 text-lg font-semibold">

                    Atmospheric Engine
                </div>

                <div class="text-zinc-500 text-sm mt-1">

                    NE India Forecast Workstation
                </div>

            </div>

            <!-- ===================================== -->
            <!-- VARIABLE -->
            <!-- ===================================== -->

            <div class="space-y-2">

                <label class="text-zinc-300 text-sm font-medium">

                    Variable
                </label>

                <select
                    id="variableSelect"
                    class="
                        w-full
                        h-10
                        rounded-lg
                        bg-zinc-900
                        border
                        border-zinc-800
                        text-zinc-100
                        px-3
                        outline-none
                    "
                >

                    <option value="rain">
                        Rainfall
                    </option>

                    <option value="temperature">
                        Temperature
                    </option>

                    <option value="humidity">
                        Humidity
                    </option>

                </select>

            </div>

            <!-- ===================================== -->
            <!-- BASEMAP -->
            <!-- ===================================== -->

            <div class="space-y-2">

                <label class="text-zinc-300 text-sm font-medium">

                    Basemap
                </label>

                <select
                    id="basemapSelect"
                    class="
                        w-full
                        h-10
                        rounded-lg
                        bg-zinc-900
                        border
                        border-zinc-800
                        text-zinc-100
                        px-3
                        outline-none
                    "
                >

                    <option value="osm">
                        OpenStreetMap
                    </option>

                    <option value="dark">
                        Dark
                    </option>

                    <option value="terrain">
                        Terrain
                    </option>

                </select>

            </div>

            <!-- ===================================== -->
            <!-- TIMELINE -->
            <!-- ===================================== -->

            <div class="space-y-3">

                <div class="flex items-center justify-between">

                    <label class="text-zinc-300 text-sm font-medium">

                        Forecast Hour
                    </label>

                    <span
                        id="frameLabel"
                        class="text-cyan-400 text-sm"
                    >
                        F001
                    </span>

                </div>

                <input
                    id="frameSlider"
                    type="range"
                    min="1"
                    max="49"
                    value="1"

                    class="
                        w-full
                        accent-cyan-500
                    "
                />

            </div>

            <!-- ===================================== -->
            <!-- PLAYBACK -->
            <!-- ===================================== -->

            <div class="grid grid-cols-2 gap-2">

                <button
                    id="playBtn"

                    class="
                        h-10
                        rounded-lg
                        bg-cyan-600
                        hover:bg-cyan-500
                        transition
                        text-white
                        font-medium
                    "
                >

                    Play

                </button>

                <button
                    id="stopBtn"

                    class="
                        h-10
                        rounded-lg
                        bg-zinc-800
                        hover:bg-zinc-700
                        transition
                        text-zinc-100
                        font-medium
                    "
                >

                    Stop

                </button>

            </div>

            <!-- ===================================== -->
            <!-- OVERLAYS -->
            <!-- ===================================== -->

            <div class="space-y-3">

                <div class="text-zinc-300 text-sm font-medium">

                    Overlays
                </div>

                <label class="flex items-center gap-3 text-sm text-zinc-300">

                    <input
                        id="toggleContours"
                        type="checkbox"
                        checked
                    />

                    Contours

                </label>

            </div>

            <!-- ===================================== -->
            <!-- OPACITY -->
            <!-- ===================================== -->

            <div class="space-y-3">

                <div class="flex items-center justify-between">

                    <span class="text-zinc-300 text-sm font-medium">

                        Opacity

                    </span>

                    <span
                        id="opacityLabel"
                        class="text-zinc-500 text-sm"
                    >
                        100%
                    </span>

                </div>

                <input
                    id="opacitySlider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value="1"

                    class="
                        w-full
                        accent-cyan-500
                    "
                />

            </div>

        </div>
    `;
}