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
import isEmpty from '../../utils/isEmpty';
import { Row, Col, Button } from 'reactstrap';
import { Formik, Field, ErrorMessage, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { getFinalTabStatus, filterTasks } from '../../utils/getActiveTab';

const getLabelSchema = () => {
    return {
        PartnerLabel: [
            {
                Label: ''
            }
        ]
    }
}

const enhance = compose(
    withProps(props => {
        return {
            taskId: props.taskDetails.id ,
            caseId: props.taskDetails.caseInstanceId,
            details: props.taskDetails,
        }
    }),
    withPropsOnChange(['details'], ({ details }) => {
        return {
            forminitialValues: isEmpty(details.mappedInput.PartnerOnboarding) ? getLabelSchema() : details.mappedInput.PartnerOnboarding.PartnerLabels,
        }
    }),
    pure,
    lifecycle({
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
    }),
);

const PartnerLabel = enhance(({ setTaskDetails, taskId, caseId, forminitialValues, setSpinner, setTasks }) => {
    return (
        <div>
         <Formik
         enableReinitialize
         initialValues={forminitialValues}
         onSubmit={async(values, actions) => {
            const formValues = {
                PartnerLabels: null,
                PartnerOnboarding: {
                    PartnerLabels: {
                        ...values 
                    }
                },
            };
            const response = await axios.post(`/api/tasks/${taskId}/complete`, formValues);
            if(response.data) {
                setSpinner(true);
                actions.setSubmitting(true);
            }
            setTimeout(async() => {
                const result = await axios.get(`/api/cases/${caseId}`);
                result && await setTasks(filterTasks(result.data._2.planitems));
                const newTaskId = result.data._2.planitems.filter(item => item.name === "Partner Labels" && item.currentState === "Active")[0].id;
                const response = await axios.put(`/api/tasks/${newTaskId}/claim`, {assignee: ""});
                if(response) {
                    const result = await axios.get(`/api/tasks/${newTaskId}`);
                    setTaskDetails(result.data._2);
                }
                // getFinalTabStatus(result.data._2.planitems) && document.getElementById("left-tabs-example-tab-11").click();
                setSpinner(false);
                actions.setSubmitting(false);
            },2000);
         }}
         >
         {
             ({ values, isSubmitting, errors }) =>
             <Form>
                 <FieldArray name="PartnerLabel">
                 { 
                      ({push, remove}) => 
                        <div>
                            {
                                values.PartnerLabel && values.PartnerLabel.length > 0 && values.PartnerLabel.map(( item , index) =>
                                    <Row key={index}>
                                        <Col sm={11}>
                                            <label>Partner Label</label>
                                            
                                                
                                                    <div>
                                                        <Field type="text" name={`PartnerLabel[${index}].Label`} className="custom-remove form-control "/>
                                                        <Button type="button" onClick={() => remove(index)}>X</Button>
                                                    </div>
                                            
                                        </Col>
                                    </Row>
                                )
                            }
                            <Button type="button" className='mtl' onClick={ () => push({Label: ''})}>Add</Button>
                        </div>
                }
                </FieldArray>
                <div>
                    <Button type="submit" color="success" disabled={isSubmitting}  className="mtl">Save</Button>
                </div>
             </Form>
         }
         </Formik>
        </div>
    )

});

export default PartnerLabel;