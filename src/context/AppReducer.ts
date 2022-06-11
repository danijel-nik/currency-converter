import { IGlobalState, IReducer } from "./types";

export default (state: IGlobalState, action: IReducer) => {
    switch (action.type) {
        case 'LOADING':
            return {
                ...state,
                loading: action.payload
            }
        case 'CURRENT_USER':
            return {
                ...state,
                currentUser: action.payload
            }
        default:
            return state;
    }
}