const listeners = [];

export function subscribeTimeline(
    callback
) {

    listeners.push(callback);
}

export function emitTimelineUpdate(
    state
) {

    for (const callback of listeners) {

        callback(state);
    }
}