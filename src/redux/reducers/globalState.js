/* eslint-disable */
import { TOOGLE_LATERALMENU } from "../actions/actionTypes";
import { SHOW_NOTIFICATION } from "../actions/actionTypes";

export default function globalState(state = {}, action) {
    switch (action.type) {
        case TOOGLE_LATERALMENU:
            return { ...state, lateralMenuOpen: !state.lateralMenuOpen }
        case SHOW_NOTIFICATION:
            if (action.payload === false) {
                const notificationState = state.notification;
                notificationState.visible = false;
                return { ...state, notification: notificationState }
            }
            return { ...state, notification: action.payload }
        default:
            return state
    }
}