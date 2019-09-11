/* eslint-disable */
import { DATA_LOADED } from "../actions/actionTypes";

export default function apiFetch(state = {}, action) {
    switch (action.type) {
        case DATA_LOADED:
            return { ...state, remoteArticles: state.remoteArticles.concat(action.payload) }
        default:
            return state
    }
}