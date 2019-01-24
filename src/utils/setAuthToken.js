import axios from 'axios';

export const setAuthToken = token => {
    if(token) {
        axios.defaults.headers.common['X-AUTH-CAFIENNE'] = token;
    } else {
        delete axios.defaults.headers.common['X-AUTH-CAFIENNE'];
    }
}