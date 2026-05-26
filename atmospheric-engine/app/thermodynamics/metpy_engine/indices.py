from metpy.units import units

from metpy.calc import (

    lifted_index,

    k_index,

    total_totals_index
)

from metpy.calc import (
    parcel_profile
)


def compute_indices(
    sounding
):

    pressure = (
        sounding.pressure
        * units.hPa
    )

    temperature = (
        sounding.temperature
        * units.degC
    )

    dewpoint = (
        sounding.dewpoint
        * units.degC
    )



    parcel_prof = parcel_profile(

        pressure,

        temperature[0],

        dewpoint[0]
    )

    li = lifted_index(

        pressure,

        temperature,

        parcel_prof
    )

    k = k_index(
        pressure,
        temperature,
        dewpoint
    )

    tt = total_totals_index(
        pressure,
        temperature,
        dewpoint
    )

    return {

        "lifted_index":
            li.magnitude.tolist(),

        "k_index":
            k.magnitude.tolist(),

        "total_totals":
            tt.magnitude.tolist()
    }