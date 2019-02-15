import { useEffect, useState } from "react";

export type Handler<T> = (x: T) => void;
export interface EventDefinition<T> {
    fire: () => void,
    useEvents: (x: Handler<T>) => T
};

export function createEventHandler<T>(state: () => T): EventDefinition<T> {
    let handlerList: Handler<T>[] = [];
    return {
        fire: () => fire(handlerList, state()),
        useEvents: (x: Handler<T>) => {
            const [currState, setCurrState] = useState(state);
            const handler = (y: T) => {
                setCurrState(y);
                x(y);
            }
            useEffect(() => {
                handlerList.push(handler);
                return () => unsubscribe(handlerList, handler);
            });
            return currState;
        }
    };
}

function fire<T>(handlers: ((x: T) => void)[], state: T) {
    handlers.map(x => x(state));
}

function unsubscribe<T>(handlers: T[], handler: T) {
    for (var i = 0; i < handlers.length; i++) {
        if (handlers[i] === handler) {
            handlers.splice(i, 1);
        }
    }
}