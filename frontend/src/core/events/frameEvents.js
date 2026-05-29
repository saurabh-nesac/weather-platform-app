//frontend/src/core/events/frameEvents.js
import { emit, emitAsync } from "./bus";
import { store } from "../state/store";

export async function emitCurrentFrame() {
    const frame = store.app.currentFrame;
    const timestamp = store.cache.metadata?.[store.app.currentVariable]?.[frame].timestamp || null;
    try {
        await emitAsync(
            'frameChanged',
            {
                frame, timestamp
            }
        );
    } catch (error) {
        console.log(error)
    }
    
}