export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function once(fn: Function) {
    let applied;
    return function () {
        if (!applied) {
            fn();
            applied = true;
        }
    };
}
