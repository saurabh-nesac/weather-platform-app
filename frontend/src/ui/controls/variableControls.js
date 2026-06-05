import { store }
    from '@/core/state/store.js';

import { VARIABLES }
    from '@/variables/index.js';

import { emitCurrentFrame }
    from '@/core/events/frameEvents.js';


// ============================================================
// VARIABLE CONTROLS
// ============================================================

export function setupVariableControls(
    container
) {

    const wrapper =
        document.createElement('div');

    wrapper.className =
        'space-y-2';

    // --------------------------------------------------------
    // LABEL
    // --------------------------------------------------------

    const label =
        document.createElement('div');

    label.className = `
        text-sm
        text-slate-300
    `;

    label.innerText =
        'Variable';

    // --------------------------------------------------------
    // SELECT
    // --------------------------------------------------------

    const select =
        document.createElement('select');

    select.className = `
        w-full
        rounded-xl
        bg-slate-900
        border
        border-slate-700
        px-3
        py-2
        text-sm
        text-white
        outline-none
    `;

    // --------------------------------------------------------
    // OPTIONS
    // --------------------------------------------------------

    Object.values(VARIABLES)
        .forEach(variable => {

            const option =
                document.createElement('option');

            option.value =
                variable.id;

            option.innerText =
                variable.label;

            select.appendChild(
                option
            );
        });

    // --------------------------------------------------------
    // VALUE
    // --------------------------------------------------------

    select.value =
        store.app.currentVariable;

    // --------------------------------------------------------
    // EVENT
    // --------------------------------------------------------

    select.onchange = async () => {

        store.app.currentVariable = select.value;
        
        console.log(
            'Variable:',
            select.value
        );

        await emitCurrentFrame();
    };

    wrapper.appendChild(label);

    wrapper.appendChild(select);

    container.appendChild(wrapper);
}