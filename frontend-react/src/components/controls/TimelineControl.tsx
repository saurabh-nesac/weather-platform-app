// src/components/controls/TimelineControl.tsx

import { useMaxFrame, useFrame, useSetFrame, useTimestamps } from "../../core/state/selectors";
import {
    Cloud, ChevronDown, Play, Pause, RotateCcw, ChevronLeft, ChevronRight,
    SkipBack, SkipForward, Calendar, MapPin, Compass, Gauge as GaugeIcon, Activity,
    Settings2,
} from "lucide-react";
export function TimelineControl() {
    const frame = useFrame();
    const setFrame = useSetFrame();
    const timestamps =
        useTimestamps();
    const maxFrame = useMaxFrame();

    const previousFrame = () =>
        setFrame(
            Math.max(
                0,
                frame - 1
            )
        );

    const nextFrame = () =>
        setFrame(
            Math.min(
                maxFrame,
                frame + 1
            )
        );



    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs">
                <span>
                    {timestamps?.[frame] ??
                        "No time"}
                </span>

                <span>
                    Frame {frame}/{maxFrame}
                </span>
            </div>

            <input
                type="range"
                min={0}
                max={maxFrame}
                value={frame}
                onChange={(e) =>
                    setFrame(
                        Number(
                            e.target.value
                        )
                    )
                }
                className="w-full accent-[var(--accent)]"
            />
            <div className="mt-2 flex items-center gap-1">
                <IconBtn
                    small
                    onClick={previousFrame}
                >
                    <ChevronLeft
                        className="h-3.5 w-3.5"
                    />
                </IconBtn>
                <IconBtn small><Play className="h-3.5 w-3.5" /></IconBtn>
                <IconBtn
                    small
                    onClick={nextFrame}
                >
                    <ChevronRight
                        className="h-3.5 w-3.5"
                    />
                </IconBtn>
            </div>
        </div>
    );
}

function IconBtn({
    children,
    small,
    onClick,
}: {
    children: React.ReactNode;
    small?: boolean;
    onClick?: () => void;
}) {
    return (
        <button onClick={onClick} className={`grid place-items-center rounded-md border border-border bg-panel-2 text-muted hover:text-fg ${small ? "h-7 w-7" : "h-8 w-8"}`}>
            {children}
        </button>
    );
}