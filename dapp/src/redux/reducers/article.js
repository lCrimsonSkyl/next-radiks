/* eslint-disable */
import { ADD_ARTICLE } from "../actions/actionTypes";

export default function articles(state = {}, action) {
    switch (action.type) {
        case ADD_ARTICLE:
            return { ...state, articles: state.articles.concat(action.payload) }
        default:
            return state
    }
}