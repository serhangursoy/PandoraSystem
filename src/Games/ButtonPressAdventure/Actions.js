
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

export const updateState = (newState) => {
    return {
        type: ActionTypes.stateUpdate,
        payload: newState
    }

}
