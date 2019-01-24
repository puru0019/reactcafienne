import { SET_CASE, SET_CASE_INSTANCE, SET_DISCREATIONARY_CASE, SET_PLAN_ID } from './types';
import { setPlan } from './planAction';
import axios from 'axios';

export const getCase = (definition, name) => async(dispatch) => {
    const caseData = {
       caseTeam: {
         members: []
       },
       definition,
       name,
    };
    const response = await axios.post('/api/cases', caseData);
    await dispatch(setCase(caseData));
    await dispatch(setCaseInstance(response.data));
}

export const getDiscreationaryCase = (caseinstanceId) => async(dispatch) => {
    const response = await axios.get(`/api/cases/${caseinstanceId}/discretionaryitems`);
    await dispatch(setDiscreationaryCase(response.data));
    const planIdResponse = await axios.post(`/api/cases/${caseinstanceId}/discretionaryitems/plan`,{
        definitionId: response.data.discretionaryItems[0].id,
        name: response.data.discretionaryItems[0].name,
        parentId: response.data.discretionaryItems[0].parentId
    });
    await dispatch(setPlanId(planIdResponse.data));
    const planResponse = await axios.get(`/api/cases/${caseinstanceId}`);
    await dispatch(setPlan(planResponse.data));
}

export const getCaseDetails = (caseinstanceId) => async(dispatch) => {
    const planResponse = await axios.get(`/api/cases/${caseinstanceId}`);
    await dispatch(setPlan(planResponse.data));
    const response = await axios.get(`/api/cases/${caseinstanceId}/discretionaryitems`);
    await dispatch(setDiscreationaryCase(response.data));
}

export const setCase = data => {
    return {
        type: SET_CASE,
        payload: data
    }
}

export const setCaseInstance = data => {
    return {
        type: SET_CASE_INSTANCE,
        payload: data,
    }
}

export const setDiscreationaryCase = data => {
    return {
        type: SET_DISCREATIONARY_CASE,
        payload: data.discretionaryItems,
    }
}

export const setPlanId = data => {
    return {
        type: SET_PLAN_ID,
        payload: data.planItemId,
    }
}

