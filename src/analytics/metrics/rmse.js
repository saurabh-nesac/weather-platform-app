export function rmse(obs, forecast) {

    let sum = 0;

    for (let i = 0; i < obs.length; i++) {

        const diff = forecast[i] - obs[i];

        sum += diff * diff;
    }

    return Math.sqrt(sum / obs.length);
}
