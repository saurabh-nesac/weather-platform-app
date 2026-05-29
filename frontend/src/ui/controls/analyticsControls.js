//frontend/src/ui/controls/analyticsControls.js
export function setupAnalyticsControls() {

    const btn =
        document.getElementById('computeRMSE');

    if (!btn) return;

    btn.onclick = () => {

        console.log('Compute RMSE');
    };
}