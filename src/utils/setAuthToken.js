import Axios from 'axios';

export const setAuthToken = token => {
    if(token) {
        Axios.defaults.headers.common['X-AUTH-CAFIENNE'] = token;
    } else {
        delete Axios.defaults.headers.common['X-AUTH-CAFIENNE'];
    }
}
