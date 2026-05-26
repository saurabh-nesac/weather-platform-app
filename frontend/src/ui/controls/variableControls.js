import { store }
from '@/core/state/store.js';

export function setupVariableControls() {

    const select =
        document.getElementById('variableSelect');

    if (!select) return;

    select.onchange = () => {

        store.currentVariable =
            select.value;

        console.log(
            'Variable:',
            store.currentVariable
        );
    };
}