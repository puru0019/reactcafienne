import {  SET_CASE, SET_CASE_INSTANCE, SET_DISCREATIONARY_CASE, SET_PLAN_ID } from '../actions/types';

const initialState = {
    caseTeam: {
        members: []
    },
    definition: '',
    name: '',
    caseInstanceId: "",
    name: "",
    discretionaryItems: [],
    planItemId: '',
};

export default function( state = initialState, action ) {
    switch(action.type) {
        case SET_CASE: 
        return {
            ...state,
            ...action.payload,
        }
        case SET_CASE_INSTANCE:
        return {
            ...state,
            ...action.payload,
        }
        case SET_DISCREATIONARY_CASE: 
        return {
            ...state,
            discretionaryItems: action.payload,
        }
        case SET_PLAN_ID:
        return {
            ...state,
            planItemId: action.payload,
        }
        default:
        return state;
    }
} 