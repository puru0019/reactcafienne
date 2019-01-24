import {  LOAD_TASK } from '../actions/types';

const initialState = {
};

export default function( state = initialState, action ) {
    switch(action.type) {
        case LOAD_TASK:
        return {
            ...state,
            ...action.payload,
        }
        default:
        return state;
    }
} 