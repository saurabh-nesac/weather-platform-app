import { useAtmosStore } from "../state/atmosStore";

let timer: number | null = null;

export function startPlayback(
    maxFrame: number
) {

    stopPlayback();

    timer = window.setInterval(() => {

        const store =
            useAtmosStore.getState();

        store.setFrame(
            (store.frame + 1) %
            (maxFrame + 1)
        );

    }, 500);
}

export function stopPlayback() {

    if (timer !== null) {

        clearInterval(timer);

        timer = null;
    }
}