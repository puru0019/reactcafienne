import { lifecycle } from 'recompose';
import isEmpty from '../../utils/isEmpty';
import axios from 'axios';

export const manageLifeCycle  = lifecycle({
    async componentDidMount() {
        this.props.setSpinner(false);
        if(isEmpty(this.props.taskDetails.assignee)) {
            const response = await axios.put(`/api/tasks/${this.props.taskId}/claim`, {assignee: ""});
            if(response) {
                const result = await axios.get(`/api/tasks/${this.props.taskId}`);
                this.props.setTaskDetails(result.data._2);
            }
        }
    }
})