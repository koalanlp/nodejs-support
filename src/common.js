/** @private */
export function isDefined(value) {
    return typeof value !== 'undefined' && value !== null;
}

/** @private */
export function getOrUndefined(value) {
    return isDefined(value) ? value : undefined;
}

/** @private */
export function assert(condition, msg){
    if (!condition)
        throw TypeError(msg);
}

/** @private */
export function typeCheck(values, ...types){
    types = new Set(types);

    new Set(values.map((x) => {
        let t = typeof x;
        if (t === 'object') 
            t = x.constructor.name;
        
        return t;
    })).forEach((t) => {
        assert(types.has(t), `[${[...types].toString()}] 중 하나를 기대했지만 ${t} 타입이 들어왔습니다!`);
    });
}
