// src/ui/layout/dashboardLayout.js

function createPanel({

    title,

    className = ""
}) {

    const panel =
        document.createElement('div');

    panel.className = `

        flex
        flex-col
        overflow-hidden

        rounded-xl

        border
        border-zinc-800

        bg-zinc-950/95

        shadow-2xl

        backdrop-blur-sm

        ${className}
    `;

    // =====================================================
    // HEADER
    // =====================================================

    const header =
        document.createElement('div');

    header.className = `

        h-11
        shrink-0

        flex
        items-center

        px-4

        border-b
        border-zinc-800

        bg-zinc-900/90

        text-sm
        font-semibold
        tracking-wide

        text-zinc-100
    `;

    header.innerText =
        title;

    // =====================================================
    // BODY
    // =====================================================

    const body =
        document.createElement('div');

    body.className = `

        relative

        flex-1

        min-h-0
        min-w-0

        overflow-hidden
    `;

    panel.appendChild(
        header
    );

    panel.appendChild(
        body
    );

    return {

        panel,

        body
    };
}


export function createDashboardLayout() {

    // =====================================================
    // ROOT
    // =====================================================

    const dashboard =
        document.createElement('div');

    dashboard.className = `

        h-screen
        w-screen

        overflow-hidden

        bg-black

        grid

        grid-cols-[320px_1fr_420px]

        grid-rows-[56px_1fr_340px]

        gap-2

        p-2
    `;

    document.body.appendChild(
        dashboard
    );

    // =====================================================
    // TOP BAR
    // =====================================================

    const topbar =
        document.createElement('div');

    topbar.className = `

        col-span-3

        rounded-xl

        border
        border-zinc-800

        bg-zinc-950

        flex
        items-center

        px-4
    `;

    topbar.innerHTML = `

        <div class="text-zinc-100 font-semibold">

            Atmospheric Engine
        </div>
    `;

    dashboard.appendChild(
        topbar
    );

    // =====================================================
    // LEFT SIDEBAR
    // =====================================================

    const sidebar =
        document.createElement('div');

    sidebar.className = `

        rounded-xl

        border
        border-zinc-800

        bg-zinc-950

        overflow-y-auto

        p-3
    `;

    sidebar.innerHTML = `

        <div class="text-zinc-300 text-sm mb-4">

            Controls
        </div>
    `;

    dashboard.appendChild(
        sidebar
    );

    // =====================================================
    // MAP PANEL
    // =====================================================

    const mapPanel =
        document.createElement('div');

    mapPanel.className = `

        relative

        overflow-hidden

        rounded-xl

        border
        border-zinc-800

        bg-black
    `;

    dashboard.appendChild(
        mapPanel
    );

    // =====================================================
    // RIGHT COLUMN
    // =====================================================

    const rightColumn =
        document.createElement('div');

    rightColumn.className = `

        grid

        grid-rows-[120px_120px_1fr]

        gap-2

        min-h-0
    `;

    dashboard.appendChild(
        rightColumn
    );

    // =====================================================
    // SUMMARY
    // =====================================================

    const summary =
        createPanel({

            title:
                'Forecast Summary'
        });

    rightColumn.appendChild(
        summary.panel
    );

    // =====================================================
    // DIAGNOSTICS
    // =====================================================

    const diagnostics =
        createPanel({

            title:
                'Diagnostics'
        });

    rightColumn.appendChild(
        diagnostics.panel
    );

    // =====================================================
    // SKEWT
    // =====================================================

    const skewt =
        createPanel({

            title:
                'Skew-T / Thermodynamics'
        });

    rightColumn.appendChild(
        skewt.panel
    );

    // =====================================================
    // BOTTOM METEOGRAM
    // =====================================================

    const meteogram =
        createPanel({

            title:
                'Meteogram',

            className:
                'col-span-2'
        });

    dashboard.appendChild(
        meteogram.panel
    );

    return {

        dashboard,

        sidebar,

        mapPanel,

        summaryPanel:
            summary.body,

        diagnosticsPanel:
            diagnostics.body,

        skewtPanel:
            skewt.body,

        meteogramPanel:
            meteogram.body
    };
}