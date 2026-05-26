import { fetchSkewt }
    from '../api/fetchSkewt.js';

import { getSkewt }
    from '../skewt/initializeSkewt.js';


export async function loadSounding({

    lat,

    lon,

    timeIdx = 0
}) {

    // --------------------------------------------------------
    // FETCH
    // --------------------------------------------------------

    const data = await fetchSkewt(

        lat,

        lon,

        timeIdx
    );

    // --------------------------------------------------------
    // RENDER
    // --------------------------------------------------------

    const skewt = getSkewt();

    skewt.render(data);
}