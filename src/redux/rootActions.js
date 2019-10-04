import { ADD_ARTICLE, DATA_REQUESTED, TOOGLE_LATERALMENU, SHOW_NOTIFICATION } from "./actions/actionTypes";

export function addArticle(payload) {
    return { type: ADD_ARTICLE, payload }
}

export function getData() {
    return { type: DATA_REQUESTED };
}

export function toogleLateralMenu() {
    return { type: TOOGLE_LATERALMENU };
}

export function showNotification(payload) {
    return { type: SHOW_NOTIFICATION, payload };
}

