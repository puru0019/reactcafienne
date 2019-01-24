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

const mapStateToProps = ({ task }) => {
    const { id, rootCaseInstanceId, taskModel, rawOutput, assignee } = task;
    const schemas = generateFormFields(taskModel);
    return {
        taskId: id,
        assignee,
        caseInstanceId: rootCaseInstanceId,
        rawOutput,
        schemas,
    }
}

const enhance = compose(
    connect(mapStateToProps, {
        submitForm
    }),
    setDisplayName('Form'),
    withState('value', 'setValue',''),
    withProps(({ schemas }) => {
        const values = !isEmpty(schemas) && schemas.fieldData[0].enum || [];
        return {
            dropDownValues: values,
        }
    }),
    withPropsOnChange(['rawOutput'],({ rawOutput })=>{
        return {
            test: rawOutput
        }
    }),
    withHandlers({
        handleSubmit: ({ value, taskId, submitForm, caseInstanceId }) => async(e) =>{
            e.preventDefault();
            const data = {
                PartnerLabels: {
                    Color: value
                },
                Header_Color: null
            };
            submitForm(data, taskId, caseInstanceId);
        },
        handleDropDown: ({ setValue }) => (e) => {
            setValue(e.target.value);
        }
    }),
    lifecycle({
        async componentDidUpdate() {
           console.log(this.props);
           isEmpty(this.props.assignee) && await axios.put(`api/tasks/${this.props.taskId}/claim`, {assignee: ''});
        },
    }),
    pure,
);

const TestForm = enhance(({ dropDownValues, value, handleDropDown, handleSubmit }) => {
    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="col-xs-4">
                <div className="form-group">
                    <label>Header Color</label><br/>
                    <select className="form=control" value={value} onChange={(e)=> handleDropDown(e)}>
                        {
                            !isEmpty(dropDownValues) && dropDownValues.map((item,key) => 
                                <option key={key} value={item}>{item}</option>
                            )
                        }
                    </select>
                </div>
                <Button bsStyle="success" type="submit">Submit</Button>
            </div>
        </form>
    )
});

export default TestForm;