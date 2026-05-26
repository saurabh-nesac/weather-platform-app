def virtual_temperature(
    temperature_k,
    qv
):

    """
    Virtual temperature.

    Inputs:
        temperature_k : Kelvin
        qv            : kg/kg
    """

    return (
        temperature_k
        *
        (
            1 + 0.61 * qv
        )
    )