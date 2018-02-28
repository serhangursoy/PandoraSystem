
import {ActionTypes} from "./ActionTypes"

export const incrementCounter = () => {
    return {
        type: ActionTypes.incrementCounter,
    }
};
export const decrementCounter = () => {
    return {
        type: ActionTypes.decrementCounter,
    }
};
