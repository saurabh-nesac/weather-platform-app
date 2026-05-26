function createPanel({

    id,

    title
}) {

    const panel =
        document.createElement('div');

    panel.id = id;

    panel.className =
        'dashboard-panel';

    const header =
        document.createElement('div');

    header.className =
        'panel-header';

    header.innerText =
        title;

    panel.appendChild(
        header
    );

    const body =
        document.createElement('div');

    body.className =
        'panel-body';

    body.id =
        `${id}-body`;

    panel.appendChild(
        body
    );

    return {

        panel,

        body
    };
}


export function createDashboardLayout() {

    const dashboard =
        document.createElement('div');

    dashboard.id =
        'dashboard';

    document.body.appendChild(
        dashboard
    );

    // =====================================================
    // MAP
    // =====================================================

    const mapPanel =
        document.createElement('div');

    mapPanel.id =
        'map-panel';

    dashboard.appendChild(
        mapPanel
    );

    // =====================================================
    // RIGHT PANEL
    // =====================================================

    const rightPanel =
        document.createElement('div');

    rightPanel.id =
        'right-panel';

    dashboard.appendChild(
        rightPanel
    );

    // =====================================================
    // SUMMARY
    // =====================================================

    const summary =
        createPanel({

            id:
                'summary-panel',

            title:
                'Forecast Summary'
        });

    rightPanel.appendChild(
        summary.panel
    );

    // =====================================================
    // DIAGNOSTICS
    // =====================================================

    const gauges =
        createPanel({

            id:
                'gauge-panel',

            title:
                'Diagnostics'
        });

    rightPanel.appendChild(
        gauges.panel
    );

    // =====================================================
    // SKEWT
    // =====================================================

    const skewt =
        createPanel({

            id:
                'skewt-panel',

            title:
                'Skew-T / Thermodynamics'
        });

    rightPanel.appendChild(
        skewt.panel
    );

    // =====================================================
    // BOTTOM PANEL
    // =====================================================

    const bottomPanel =
        document.createElement('div');

    bottomPanel.id =
        'bottom-panel';

    dashboard.appendChild(
        bottomPanel
    );

    // =====================================================
    // METEOGRAM
    // =====================================================

    const meteogram =
        createPanel({

            id:
                'meteogram-panel',

            title:
                'Meteogram'
        });

    bottomPanel.appendChild(
        meteogram.panel
    );

    return {

        dashboard,

        mapPanel,

        rightPanel,

        bottomPanel,

        summaryPanel:
            summary.body,

        gaugePanel:
            gauges.body,

        meteogramPanel:
            meteogram.body,

        skewtPanel:
            skewt.body
    };
}