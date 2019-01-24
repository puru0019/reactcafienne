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
            forminitialValues: isEmpty(details.rawOutput) ? getFormValues(details.taskModel.schema.properties[mappedProperty].properties) : details.rawOutput[mappedProperty],
        }
    }),
    pure,
    lifecycle({
        async componentDidMount() {
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

const BillingInformation = enhance(({taskId, forminitialValues }) => {
    console.log(forminitialValues);
    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={{ ...forminitialValues }}
                validationSchema={Yup.object({
                    BankName: Yup.string().required('BankName Required'),
                    Status: Yup.string().required('Status is required'),
                    Approved: Yup.boolean().required('Telephone is required'),
                    AccountNumber: Yup.string().required('Required'),
                    Nameof: Yup.string().required('Last name is required'),
                    InvoiceEmail: Yup.string().email('Invalid Email').required('Medwerkers email is required'),
                })}
                onSubmit= { async(values, actions) =>{
                    console.log(values);
                    const data = {
                        BillingInformation: {
                            ...values
                        }
                    }
                    console.log(data);
                    await axios.post(`/api/tasks/${taskId}/complete`, data);
                    actions.setSubmitting(false);
                    //${errors && errors.FirstName && 'error-field
                }}
            >
            {
                ({ isSubmitting, values }) => 
                <div>
                        <Form>
                            <Row>
                                <Col sm="11">
                                    <label>Bank name</label>
                                    <Field type="text" name="BankName" placeholder="Enter bank name" className={`form-control mbl`} />
                                    <ErrorMessage name="BankName">
                                        {
                                            msg => <div className="error-message">{msg}</div>
                                        }
                                    </ErrorMessage>
                                    <label>Approval Status</label>
                                    <Field component="select" name="Status" placeholder="Select status" className="form-control mbl">
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                    </Field>
                                    <label>Name of</label>
                                    <Field type="text" name="Nameof" placeholder="Enter name of" className={`form-control mbl`} />
                                    <ErrorMessage name="Nameof">
                                        {
                                            msg => <div className="error-message">{msg}</div>
                                        }
                                    </ErrorMessage>
                                    <label>
                                        <Field type="checkbox" name="Approved" checked={values.Approved}/>
                                        Terms and Conditions accepting
                                        <ErrorMessage name="Approved">
                                            {
                                                msg => <div className="error-message">{msg}</div>
                                            }
                                        </ErrorMessage>
                                    </label>
                                    <label>Invoice Email</label>
                                    <Field type="email" name="InvoiceEmail" placeholder="Enter invoice email" className={`form-control mbl`} />
                                    <ErrorMessage name="InvoiceEmail">
                                        {
                                            msg => <div className="error-message">{msg}</div>
                                        }
                                    </ErrorMessage>
                                    <label>Account Number</label>
                                    <Field type="text" name="AccountNumber" placeholder="Enter account number" className={`form-control mbl`} />
                                    <ErrorMessage name="AccountNumber">
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

export default BillingInformation;