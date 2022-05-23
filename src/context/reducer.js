const reducer = (state, action) => {
    switch (action.type) {
        case 'LOADING_COMPLETE':
            return {
                ...state,
                loading: !action.payload
            }
        case 'OPEN_MODAL':
            return {
                ...state,
                modalOpened: true,
                modalHeader: action.payload.modalHeader,
                modalContent: action.payload.modalContent,
                modalCloseTxt: action.payload.modalCloseTxt
            }
        case "CLOSE_MODAL":
            return {
                ...state,
                modalOpened: false
            }
        default:
            return state;
    }
}

export default reducer;