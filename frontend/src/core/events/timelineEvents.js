const listeners = [];

export async function subscribeTimeline(callback) {

    await listeners.push(callback);
    console.log(listeners)
}

export function emitTimelineUpdate(state) {

    for (const callback of listeners) {

        callback(state);
    }
    console.log(listeners)
}