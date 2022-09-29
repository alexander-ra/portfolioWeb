import { ACTION_OTHER_ONE, ACTION_OTHER_TWO } from "../utils/ActionTypes"

export const initialState = {
    propOne: 1,
    propTwo: 2
}

export default function othersReducer(state = initialState, action: any) {
    switch (action.type) {
        case ACTION_OTHER_ONE: {
            return {
                ...state,
                propOne: 100
            }
        }
        case ACTION_OTHER_TWO: {
            return {
                ...state,
                propTwo: 200
            }
        }
        default:
            return state
    }
}