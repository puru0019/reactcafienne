import { LOAD_TASK } from './types';
import axios from 'axios';

export const loadTask = (taskId) => async(dispatch) => {
    //const claimResponse = await axios.put(`api/tasks/${taskId}/claim`, {assignee: ''});
    const response = await axios.get(`/api/tasks/${taskId}`);
    await dispatch(await setTask(response.data));
}

export const setTask = data => {
    return {
        type: LOAD_TASK,
        payload: data._2,
    }
}