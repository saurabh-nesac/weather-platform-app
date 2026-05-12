export function showLoading(text = 'Loading Forecast...'){
    const overlay = document.getElementById('loadingOverlay');
    const label = document.getElementById('loadingText');
    if (!overlay) {
        return
    }
    overlay.classList.remove('hidden');
    if(label){
        label.textContent = text;
    }
}

export function hideLoading(){
    const overlay = document.getElementById('loadingOverlay');
    if(!overlay) return;
    overlay.classList.add('hidden');
}