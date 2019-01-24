import { SET_CURRENT_REPO_LIST, SET_CURRENT_REPO } from './types';
import axios from 'axios';

export const getRepositoryList = token => async (dispatch) => {
    const response = await axios.get('/api/repository/list');
    await dispatch(setRepositories(response));
}

export const getCurrentCase = (numberOfRecords) => async(dispatch) => {
    const response = await axios.get(`/api/cases/user?numberOfResults=${numberOfRecords}`);
    await dispatch(setCurrentCase(response));
}

export const setRepositories = ({ data }) => {
    return {
        type: SET_CURRENT_REPO_LIST,
        payload: data.models
    }
}

export const setCurrentCase = (response) => {
    return {
        type: SET_CURRENT_REPO,
        payload: response.data._2[0]
    }
}
