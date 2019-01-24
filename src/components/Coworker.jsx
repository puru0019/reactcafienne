import React from 'react';
import { connect } from 'react-redux';
import {
    compose,
    withProps,
    setDisplayName,
    withState,
    withHandlers,
    withPropsOnChange,
    lifecycle,
    pure,
} from  'recompose';
import { submitForm } from '../actions/planAction';
import generateFormFields from '../utils/generateFormFields';
import isEmpty from '../utils/isEmpty';
import axios from 'axios';
import { Button } from 'react-bootstrap';

const mapStateToProps = ({ task, caseDetails }) => {
    
    return {
        task,
        caseinstanceId: caseDetails.caseInstanceId,
        taskId: task.id,
    }
}

const enchance = compose(
    connect(mapStateToProps, {
        submitForm
    }),
    
    withState('value', 'setValue'),
    withHandlers({
        handleSubmit: ({ value, taskId, submitForm, caseInstanceId }) => async(e) =>{
            e.preventDefault();
            const data = {
                MemberEmail: {
                    Email: value
                },
            };
            submitForm(data, taskId, caseInstanceId);
        },
        handleInputChange: ({ setValue }) => (e) => {
            setValue(e.target.value);
        }
    }),
    pure,
);

const Coworker = enchance(({ task, value, handleInputChange, handleSubmit }) => {
    console.log(task);
    const emailValue = value || (!isEmpty(task) && !isEmpty(task.rawOutput) && task.rawOutput.MemberEmail.Email) || ''
    return (
        <form onSubmit={(e) => handleSubmit(e)}>
        {
            !isEmpty(task) && <div>
                <label>email</label>
                <input type="email" value={emailValue} onChange={(e) => handleInputChange(e)} className="form-control" />
                <Button bsStyle="success"  type="submit">Submit</Button>
            </div>
        }
        </form>
    )
});

export default Coworker;