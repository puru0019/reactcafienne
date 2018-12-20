import { TEST_DISPATCH } from './types';

// Login action
export const Loginuser = (userData) => {
    return {
        type: TEST_DISPATCH,
        payload: userData,
    }
}