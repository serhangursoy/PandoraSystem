
import {ActionTypes} from "./ActionTypes"

export default function (state = 0 , action) {
    if(action.type ===  ActionTypes.incrementCounter) {
        return state + 1
    }
    else if(action.type === ActionTypes.decrementCounter){
        return state - 1
    }else if(action.type === ActionTypes.stateUpdate){
        return action.payload
    }
}

