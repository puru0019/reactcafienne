import { combineReducers } from 'redux';
import authReducer from './authReducer.js';
import repositoryReducer from './repositoryListReducer';
import caseReducer from './caseReducer';
import planReducer from './planReducer';
import taskReducer from './taskReducer';

export default combineReducers({
 auth: authReducer,
 cases: repositoryReducer,
 caseDetails: caseReducer,
 plan: planReducer,
 task: taskReducer,
});