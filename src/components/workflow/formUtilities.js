import axios from 'axios';
import { filterTasks } from '../../utils/getActiveTab';

export const formSubmit = async(values, actions, tabId, props) => {
    console.log(props);
    const {
        mappedProperty,
        taskId,
        caseId,
        setTaskDetails,
        setSpinner,
        setTasks,
        details
    } = props;

    const data = {
        [mappedProperty]: {
            ...values
        }
    }

    const taskResponse = await axios.post(`/api/tasks/${taskId}/complete`, data);
    if(taskResponse.data) {
        setSpinner(true);
        actions.setSubmitting(true);
    }
    
    setTimeout(async() => {
        const caseResponse = await axios.get(`/api/cases/${caseId}`);
        caseResponse && setTasks(filterTasks(caseResponse.data._2.planitems));
        const newTaskId = caseResponse.data._2.planitems.filter(item => item.name === details.taskName && item.currentState === "Active")[0].id;
        const claimResponse = await axios.put(`/api/tasks/${newTaskId}/claim`, {assignee: ""});
        if(claimResponse) {
            const result = await axios.get(`/api/tasks/${newTaskId}`);
            setTaskDetails(result.data._2);
        }
        document.getElementById(`left-tabs-example-tab-${tabId}`).click()
        setSpinner(false);
        actions.setSubmitting(false);
    },2000);
}

export const getMappedProperty = value => {
    const schema = Object.keys(value);
    return schema[0];
}

export const getFormValues = ( values ) => {
    const schema = Object.keys(values).map((value) => {
        return {
            [value]:''
        }
    });
    let result = {};
    schema.forEach((item) => {
        result = {...result, ...item}
    });
    return result;
}