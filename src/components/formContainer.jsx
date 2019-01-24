import React, { useState, useEffect, memo } from "react";
import { connect } from 'react-redux';
import { submitForm } from '../actions/planAction';
import { Button } from 'react-bootstrap';
import isEmpty from '../utils/isEmpty';

const DynamicForm = ({formSchema, submitForm, caseinstanceId, taskId, formVal,fieldStatus}) => {
    console.log(formVal);
    const [fieldData, setFieldData] = useState([]);
    const [checkedStatus, setCheckedStatus] = useState(false);
    const handleInputChange = (key,e) => {
      let data = [...fieldData];
      data[key].value = e.target.value;
      setFieldData(data);
    }
    const handleNumberChange = (key,e) => {
      let data = [...fieldData];
      data[key].value = Number(e.target.value);
      setFieldData(data);
    }
    const handleCheckBox = (key) => {
      let data = [...fieldData];
      data[key].value = !checkedStatus;
      setFieldData(data);
      setCheckedStatus(!checkedStatus);
    }
    const handleFormSubmit = e => {
      e.preventDefault();
      const data = fieldData.map(({ propertie, value }) => {
        console.log(value,propertie)
        return {
          [propertie]: value
        }
      });
      let result = {};
      data.forEach((item) => {
        result = {...result, ...item}
      });
      submitForm({PartnerInformation:{...result}}, taskId, caseinstanceId);
    }
    useEffect(() => {
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
           
            setFieldData(fieldDatas);
        }
    }, [formSchema]);
  return (
    <div>
      <form onSubmit={(e)=>handleFormSubmit(e)}>
        { fieldData && fieldData.length!==0 && fieldData.map((field, key) => {
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
  );
};

const mapStateToProps = ({ task, caseDetails }) => ({
    formSchema: task.taskModel,
    caseinstanceId: caseDetails.caseInstanceId,
    taskId: task.id,
    formVal: task.rawOutput,
    fieldStatus: task.planState
});

export default memo(connect(mapStateToProps, {submitForm})(DynamicForm));
