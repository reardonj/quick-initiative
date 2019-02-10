export type Handler<T> = (x: T) => void;
export type EventDefinition<T> = [() => void, (x: Handler<T>) => void, (x: Handler<T>) => void];

export function createEventHandler<T>(state: () => T): EventDefinition<T> {
let handlerList: Handler<T>[] = [];
return [
    () => fire(handlerList, state()),
    (x: Handler<T>) => handlerList.push(x),
    (x: Handler<T>) => unsubscribe(handlerList, x)
]
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