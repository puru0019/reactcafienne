import { SET_CURRENT_USER } from './types';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { setAuthToken } from '../utils/setAuthToken';
import { getRepositoryList } from './repositoryListAction';

// Login action
export const Loginuser = (userData) => async(dispatch) => {
    const response = await axios.post('/api/identity/login', userData);
    localStorage.setItem('cafienne-auth', response.headers['x-auth-cafienne']);
    setAuthToken(localStorage.getItem('cafienne-auth'));
    const decoded = jwt_decode(localStorage.getItem('cafienne-auth'));
    await dispatch(setCurrentUser(decoded));
    await dispatch(getRepositoryList(localStorage.getItem('cafienne-auth')));
}

export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded,
    }
}

export const logoutUser = () => async(dispatch) => {
    localStorage.removeItem('cafienne-auth');
    setAuthToken(false);
    await dispatch(setCurrentUser({}));
}