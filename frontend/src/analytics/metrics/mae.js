export function mae(obs, forecast) {

    let sum = 0;

    for (let i = 0; i < obs.length; i++) {

        sum += Math.abs(forecast[i] - obs[i]);
    }

    return sum / obs.length;
}
