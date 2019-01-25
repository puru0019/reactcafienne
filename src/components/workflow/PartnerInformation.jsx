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
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { getFinalTabStatus, filterTasks } from '../../utils/getActiveTab';


const getFormValues = ( values ) => {
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

const getMappedProperty = value => {
    const schema = Object.keys(value);
    return schema[0];
}

const enhance = compose(
    withProps(props => {
        return {
            taskId: props.taskDetails.id,
            caseId: props.taskDetails.caseInstanceId,
            details: props.taskDetails,
            mappedProperty: getMappedProperty(props.taskDetails.taskInput),
        }
    }),
    withPropsOnChange(['details'], ({ details, mappedProperty }) => {
        console.log(details);
        return {
            forminitialValues: isEmpty(details.mappedInput) ? getFormValues(details.taskModel.schema.properties[mappedProperty].properties) : details.mappedInput[mappedProperty],
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

const PartnerInformation = enhance(({taskId, caseId, forminitialValues, mappedProperty, setSpinner, setTasks, setTaskDetails }) => {
    console.log(forminitialValues);
    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={{ ...forminitialValues }}
                validationSchema={Yup.object({
                    HouseNumber: Yup.string().required('HouseNumber Required'),
                    PartnerName: Yup.string().required('PartnerName is required'),
                    PostalCode: Yup.number().required('PostalCode is required'),
                    State: Yup.string().required('State Required'),
                    Street: Yup.string().required('Street is required'),
                    Telephone: Yup.number().required('Telephone is required'),
                })}
                onSubmit= { async(values, actions) =>{
                    console.log(values);
                    const data = {
                        [mappedProperty]: {
                            ...values
                        }
                    }
                    console.log(data);
                    const response = await axios.post(`/api/tasks/${taskId}/complete`, data);
                    if(response.data) {
                        setSpinner(true);
                        actions.setSubmitting(true);
                    }
                    
                    setTimeout(async() => {
                        const result = await axios.get(`/api/cases/${caseId}`);
                        console.log(result);
                        result && await setTasks(filterTasks(result.data._2.planitems));
                        const newTaskId = result.data._2.planitems.filter(item => item.name === "Partner Information" && item.currentState === "Active")[0].id;
                        const response = await axios.put(`/api/tasks/${newTaskId}/claim`, {assignee: ""});
                        if(response) {
                            const result = await axios.get(`/api/tasks/${newTaskId}`);
                            setTaskDetails(result.data._2);
                        }
                        //getFinalTabStatus(result.data._2.planitems) && document.getElementById("left-tabs-example-tab-11").click();
                        setSpinner(false);
                        actions.setSubmitting(false);
                    },2000);
                }}
            >
            {
                ({ isSubmitting, values }) => 
                <div>
                        <Form>
                            <Row>
                                <Col sm="11">
                                    <label>House Number</label>
                                    <Field type="text" name="HouseNumber" placeholder="Enter house number" className={`form-control mbl`} />
                                    <ErrorMessage name="HouseNumber">
                                        {
                                            msg => <div className="error-message">{msg}</div>
                                        }
                                    </ErrorMessage>
                                    <label>Telephone</label>
                                    <Field type="number" name="Telephone" placeholder="Enter telephone number" className={`form-control mbl`} />
                                    <ErrorMessage name="Telephone">
                                        {
                                            msg => <div className="error-message">{msg}</div>
                                        }
                                    </ErrorMessage>
                                    <label>State</label>
                                    <Field type="text" name="State" placeholder="Enter state" className={`form-control mbl`} />
                                    <ErrorMessage name="State">
                                        {
                                            msg => <div className="error-message">{msg}</div>
                                        }
                                    </ErrorMessage>
                                    <label>Street</label>
                                    <Field type="text" name="Street" placeholder="Enter street" className={`form-control mbl`} />
                                    <ErrorMessage name="Street">
                                        {
                                            msg => <div className="error-message">{msg}</div>
                                        }
                                    </ErrorMessage>
                                    <label>Postal Code</label>
                                    <Field type="number" name="PostalCode" placeholder="Enter postal code" className={`form-control mbl`} />
                                    <ErrorMessage name="PostalCode">
                                        {
                                            msg => <div className="error-message">{msg}</div>
                                        }
                                    </ErrorMessage>
                                    <label>Partner Name</label>
                                    <Field type="text" name="PartnerName" placeholder="Enter partner name" className={`form-control mbl`} />
                                    <ErrorMessage name="PartnerName">
                                        {
                                            msg => <div className="error-message">{msg}</div>
                                        }
                                    </ErrorMessage>
                                    <Button type="submit" color="success" disabled={isSubmitting} className="mtl">Save</Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
            }
            </Formik>
        </div>
    )

});

export default PartnerInformation;