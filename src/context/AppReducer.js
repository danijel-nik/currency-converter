export default (state, action) => {
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