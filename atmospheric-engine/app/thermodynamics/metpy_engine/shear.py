from metpy.units import units

from metpy.calc import (
    bulk_shear
)


def compute_bulk_shear(
    sounding
):

    pressure = (
        sounding.pressure
        * units.hPa
    )

    u = (
        sounding.u
        * units("m/s")
    )

    v = (
        sounding.v
        * units("m/s")
    )

    height = (
        sounding.height
        * units.meter
    )

    du, dv = bulk_shear(

        pressure,

        u,

        v,

        height=height,

        depth=6000 * units.meter
    )

    shear = (
        du**2 + dv**2
    ) ** 0.5

    return float(
        shear.magnitude
    )