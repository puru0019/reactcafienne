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
        formSchema: task.taskModel,
        caseinstanceId: caseDetails.caseInstanceId,
        taskId: task.id,
        formVal: task.rawOutput,
        fieldStatus: task.planState
    }
}

const getFieldData =  (formSchema, formVal) => {
    if(formSchema) {
        const { schema } = formSchema;
        const schemaKeys = Object.keys(schema.properties);
        const FieldKeys = Object.keys(schema.properties[schemaKeys[0]].properties);
        const fieldDatas = FieldKeys.map(item => {
            if (schema.properties[schemaKeys[0]].properties[item]) {
              return {
                 ...schema.properties[schemaKeys[0]].properties[item],
                 value: !isEmpty(formVal) ? formVal.PartnerInformation[item]:'',
                 propertie: item
                };
            }
        });
       
        return fieldDatas;
    }
    return {};
}

const enchance = compose(
    connect(mapStateToProps, {
        submitForm
    }),
    withState('fieldSchema', 'setFieldSchema', []),
    withState('checkedStatus', 'setCheckedStatus', false),
    withPropsOnChange(['formSchema'], ({ formSchema, formVal, setFieldSchema }) => {
        const values = getFieldData(formSchema, formVal);
        setFieldSchema(values);
        return {
            fieldData: getFieldData(formSchema, formVal)
        }
    }),
    withHandlers({
        handleFormSubmit: ({ fieldSchema, taskId, caseinstanceId, submitForm }) => (e) => {
            e.preventDefault()
            const data = fieldSchema.map(({ propertie, value }) => {
                return {
                [propertie]: value
                }
            });
            let result = {};
            data.forEach((item) => {
                result = {...result, ...item}
            });
            submitForm({PartnerInformation:{...result}}, taskId, caseinstanceId);
        },
        handleInputChange: ({ setFieldSchema, fieldSchema }) => (key, e) => {
            let data = [...fieldSchema];
            data[key].value = e.target.value;
            setFieldSchema(data);
        },
        handleNumberChange: ({ setFieldSchema, fieldSchema }) => (key, e) => {
            let data = [...fieldSchema];
            data[key].value = Number(e.target.value);
            setFieldSchema(data);
        },
        handleCheckBox: ({ setFieldSchema, setCheckedStatus, fieldSchema }) => (key) => {
            let data = [...fieldSchema];
            data[key].value = !checkedStatus;
            setFieldSchema(data);
            setCheckedStatus(!checkedStatus);
        }
    }),
    pure,
    // lifecycle({
    //     shouldComponentUpdate(nextProps) {
    //         console.log(this.props, nextProps)
    //         return JSON.stringify(nextProps) === JSON.stringify(this.props)
    //     }
    // })
);

const Formcomponent = enchance(({ fieldStatus, fieldSchema, handleFormSubmit, handleInputChange, handleNumberChange, handleCheckBox }) => {
    return (
        <div>
            <form onSubmit={(e)=>handleFormSubmit(e)}>
            { !isEmpty(fieldSchema) && fieldSchema.map((field, key) => {
            return (
                <div className="form-group" key={key}>
                {field.type === "string" && (
                    <React.Fragment>
                    <label>{field.title}</label>
                    <input type="text" value={field.value} onChange={(e) => handleInputChange(key,e)} disabled={fieldStatus==='Completed' ? true : false} className="form-control" />
                    </React.Fragment>
                )}
                {field.type === "integer" && (
                    <React.Fragment>
                    <label>{field.title}</label>
                    <input type="number" value={field.value} onChange={(e) => handleNumberChange(key,e)} disabled={fieldStatus==='Completed' ? true : false} className="form-control" />
                    </React.Fragment>
                )}
                {field.type === "boolean" && (
                    <React.Fragment>
                    <input
                        type="checkbox"
                        className=""
                        onChange={() => handleCheckBox(key)}
                        value={field.value}
                    />
                    <label>{field.title}</label>
                    </React.Fragment>
                )}
                </div>
            );
            })}
        <Button bsStyle="success"  type="submit">Submit</Button>
        </form>
        </div>
    )
});

export default Formcomponent;