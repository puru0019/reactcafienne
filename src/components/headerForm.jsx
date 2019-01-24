import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { submitForm } from '../actions/planAction';
import generateFormFields from '../utils/generateFormFields';
import isEmpty from '../utils/isEmpty';
import { Button } from 'react-bootstrap';

const HeaderForm = ({ formSchema, submitForm, caseinstanceId, taskId, fieldStatus, formVal }) => {
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState('');
    const handleDropDown = ({ target }) => {
        setValue(target.value);
    }
    const data = generateFormFields(formSchema);
    const handleSubmit = (e) => {
        e.preventDefault();
        const formValues = {
            PartnerLabels: {
                Color: value
            },
            Header_Color: null
        };
        submitForm(formValues,taskId,caseinstanceId);
    }

    useEffect(() => {
        if(!isEmpty(data)) {
           setOptions(data.fieldData[0].enum);
        }
        if(!isEmpty(formVal)) {
            console.log(formVal,"test");
            const initialVal = formVal.PartnerLabels.Color;
            setValue(initialVal);
        }
    },[formSchema, options, formVal, fieldStatus]);

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="col-xs-4">
                <div className="form-group">
                    <label>Header Color</label><br/>
                    <select className="form=control" value={value} onChange={(e)=> handleDropDown(e)} disabled={fieldStatus === 'Completed'}>
                        {
                            options && options.map((item,key) => 
                                <option key={key} value={item}>{item}</option>
                            )
                        }
                    </select>
                </div>
                <Button bsStyle="success" disabled={fieldStatus === 'Completed'} type="submit">Submit</Button>
            </div>
        </form>
    )
}

const mapStateToProps = ({ task, caseDetails }) => ({
    formSchema: task.taskModel,
    caseinstanceId: caseDetails.caseInstanceId,
    taskId: task.id,
    fieldStatus: task.planState,
    formVal: task.rawOutput
});

export default connect(mapStateToProps, {submitForm})(HeaderForm);