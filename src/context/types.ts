export interface IGlobalState {
    loading: boolean;
    currentUser: undefined | object;
    dispatch: (action: IReducer) => IGlobalState;
}

export interface IReducer {
    type: string;
    payload: object | boolean;
}