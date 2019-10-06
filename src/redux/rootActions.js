import { DATA_REQUESTED, TOOGLE_LATERALMENU, SHOW_NOTIFICATION } from "./actions/actionTypes";

export function getData() {
    return { type: DATA_REQUESTED };
}

export function toogleLateralMenu() {
    return { type: TOOGLE_LATERALMENU };
}

export function showNotification(payload) {
    return { type: SHOW_NOTIFICATION, payload };
}