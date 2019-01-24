import { SET_PLAN, SUBMIT_PLAN } from './types';
import axios from 'axios';

export const setPlan = data => {
    return {
        type: SET_PLAN,
        payload: data._2,
    }
}

export const submitForm = (data, taskId, caseInstanceId) => async(dispatch) => {
    const formRespose = await axios.post(`/api/tasks/${taskId}/complete`, data);
    const response = formRespose.data && await axios.get(`/api/cases/${caseInstanceId}`);
    await dispatch(setPlan(response))
}