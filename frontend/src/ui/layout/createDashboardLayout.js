function createPanel(title) {

    const panel = document.createElement('div');

    panel.className = `
        flex
        flex-col
        rounded-2xl
        border
        border-slate-800
        bg-slate-950/90
        shadow-2xl
        overflow-hidden
        backdrop-blur-sm
    `;

    const header = document.createElement('div');

    header.className = `
        h-11
        px-4
        flex
        items-center
        text-sm
        font-semibold
        tracking-wide
        border-b
        border-slate-800
        bg-slate-900/80
        text-slate-100
    `;

    header.innerText = title;

    const body = document.createElement('div');

    body.className = `
        flex-1
        min-h-0
        relative
        overflow-hidden
    `;

    panel.appendChild(header);
    panel.appendChild(body);

    return {
        panel,
        body
    };
}


export function createDashboardLayout() {

    const dashboard = document.createElement('div');

    dashboard.className = `
        h-screen
        w-screen
        grid
        gap-3
        p-3
        bg-slate-950
        text-white
        overflow-hidden
        grid-cols-[260px_minmax(0,1fr)_380px]
        grid-rows-[minmax(0,1fr)_380px]
    `;

    document
        .getElementById('app')
        .appendChild(dashboard);

    // =====================================================
    // LEFT CONTROL SIDEBAR
    // =====================================================

    const sidebar = document.createElement('div');

    sidebar.className = `
        row-span-2
        rounded-2xl
        border
        border-slate-800
        bg-slate-950/95
        shadow-2xl
        overflow-y-auto
        flex
        flex-col
    `;

    dashboard.appendChild(sidebar);

    // =====================================================
    // MAP PANEL
    // =====================================================

    const mapPanel = createPanel('NE India Atmospheric View');

    dashboard.appendChild(mapPanel.panel);

    // =====================================================
    // RIGHT COLUMN
    // =====================================================

    const rightColumn = document.createElement('div');

    rightColumn.className = `
        row-span-2
        grid
        gap-3
        min-h-0
        grid-rows-[110px_140px_minmax(0,1fr)]
    `;

    dashboard.appendChild(rightColumn);

    // Summary
    const summaryPanel = createPanel('Forecast Summary');
    rightColumn.appendChild(summaryPanel.panel);

    // Diagnostics
    const diagnosticsPanel = createPanel('Diagnostics');
    rightColumn.appendChild(diagnosticsPanel.panel);

    // SkewT
    const skewtPanel = createPanel('Skew-T / Thermodynamics');
    rightColumn.appendChild(skewtPanel.panel);

    // =====================================================
    // BOTTOM METEOGRAM
    // =====================================================

    const meteogramPanel = createPanel('Meteogram');

    dashboard.appendChild(meteogramPanel.panel);

    return {

        dashboard,

        sidebar,

        mapPanel:
            mapPanel.body,

        summaryPanel:
            summaryPanel.body,

        diagnosticsPanel:
            diagnosticsPanel.body,

        skewtPanel:
            skewtPanel.body,

        meteogramPanel:
            meteogramPanel.body
    };
}