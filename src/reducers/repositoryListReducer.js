import {  SET_CURRENT_REPO_LIST, SET_CURRENT_REPO } from '../actions/types';

const initialState = {
    currentCase: {},
    caselist: [],
};

export default function( state = initialState, action ) {
    switch(action.type) {
        case SET_CURRENT_REPO_LIST: 
        return {
            ...state,
            caselist: action.payload,
        }
        case SET_CURRENT_REPO: 
        return {
            ...state,
            currentCase: action.payload,
        }
        default:
        return state;
    }
} 