import { useEffect, useState } from "react";

/**
 This module provides a simple library using React Hooks to provide update 
 events for model objects.
*/

/**
 * Type to represent a handler for an event of type T.
 */
export type Handler<T> = (x: T) => void;

/**
 * Represents a source for events of type T. 
 */
export interface EventDefinition<T> {
    /**
     * Triggers an update in all listeners to this source. This function should
     * be used by model code.
     */
    fire: () => void,

    /**
     * This is a React Hook that declares a component will use this object and
     * be re-rendered when the object is updated.
     * @param x A handler that will be run when the state of the watched object
     * changes.
     */
    useEvents: (x: Handler<T>) => T
};

/**
 * Defines a new event definition.
 * @param state a function that provides the current value of the object the 
 * event definition is firing events for.
 */
export function defineEvent<T>(state: () => T): EventDefinition<T> {
    // List of event handlers for this event.
    let handlerList: Handler<T>[] = [];

    return {
        fire: () => handlerList.map(x => x(state())),
        useEvents: (x: Handler<T>) => {
            const [currState, setCurrState] = useState(state);

            // Create an event handler that updates the State hook above.
            const handler = (y: T) => {
                setCurrState(y);
                x(y);
            }
            
            // Add and remove events during the component lifecycle.
            useEffect(() => {
                handlerList.push(handler);
                return () => unsubscribe(handlerList, handler);
            });
            return currState;
        }
    };
}

function unsubscribe<T>(handlers: T[], handler: T) {
    for (var i = handlers.length - 1; i >= 0; i--) {
        if (handlers[i] === handler) {
            handlers.splice(i, 1);
        }
    }
}