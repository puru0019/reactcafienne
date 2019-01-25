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
import { getFinalTabStatus } from '../../utils/getActiveTab';


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

const enhance = compose(
    withProps(props => {
        return {
            taskId: props.taskDetails.id,
            caseId: props.taskDetails.caseInstanceId,
            details: props.taskDetails,
        }
    }),
    withPropsOnChange(['details'], ({details }) => {
        console.log(details);
        return {
            forminitialValues: isEmpty(details.rawOutput) ? getFormValues(details.taskModel.schema.properties.AddMedewerkers.properties) : details.rawOutput.AddMedewerkers,
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

const CoworkerInformation = enhance(({taskId, caseId, forminitialValues, setSpinner, setTasks }) => {
    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={{ ...forminitialValues }}
                validationSchema={Yup.object({
                    IsAdministrator: Yup.string().required('Required'),
                    FirstName: Yup.string().required('First name is required'),
                    TelePhone: Yup.number().test('len', 'Must be exactly 10 characters', val => val.toString().length === 10).required('Telephone is required'),
                    Gender: Yup.string().required('Required'),
                    LastName: Yup.string().required('Last name is required'),
                    Insert: Yup.string().required('surname name is required'),
                    MedewerkersEmail: Yup.string().email('Invalid Email').required('Medwerkers email is required'),
                })}
                onSubmit= { async(values, actions) =>{
                    console.log(values);
                    const data = {
                        AddMedewerkers: {
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
                        result && await setTasks(result.data._2.planitems);
                        getFinalTabStatus(result.data._2.planitems) && document.getElementById("left-tabs-example-tab-11").click();
                        setSpinner(false);
                        actions.setSubmitting(false);
                    },2000)
                    //${errors && errors.FirstName && 'error-field
                }}
            >
            {
                ({ isSubmitting }) => 
                <div>
                        <Form>
                            <Row>
                                <Col sm="11">
                                    <label>Is Administrator</label>
                                    <Field component="select" name="IsAdministrator" placeholder="Select Color" className="form-control mbl">
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </Field>
                                    <label>First Name</label>
                                    
                                    <Field type="text" name="FirstName" placeholder="Enter first name" className={`form-control mbl`} />
                                    <ErrorMessage name="FirstName">
                                        {
                                            msg => <div className="error-message">{msg}</div>
                                        }
                                    </ErrorMessage>
                                    <label>Telephone</label>
                                    <Field type="number" name="TelePhone" placeholder="Enter number" className={`form-control mbl`} />
                                    <ErrorMessage name="TelePhone">
                                        {
                                            msg => <div className="error-message">{msg}</div>
                                        }
                                    </ErrorMessage>
                                    <label>Gender</label>
                                    <Field component="select" name="Gender" placeholder="Select Gender" className="form-control mbl">
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Unknown">Unknown</option>
                                    </Field>
                                    <label>Last Name</label>
                                    <Field type="text" name="LastName" placeholder="Enter last name" className={`form-control mbl`} />
                                    <ErrorMessage name="LastName">
                                        {
                                            msg => <div className="error-message">{msg}</div>
                                        }
                                    </ErrorMessage>
                                    <label>Surname Name</label>
                                    <Field type="text" name="Insert" placeholder="Enter surname name" className={`form-control mbl`} />
                                    <ErrorMessage name="Insert">
                                        {
                                            msg => <div className="error-message">{msg}</div>
                                        }
                                    </ErrorMessage>
                                    <label>Medewerkers Email</label>
                                    <Field type="email" name="MedewerkersEmail" placeholder="Enter medwerkers email" className={`form-control mbl`} />
                                    <ErrorMessage name="MedewerkersEmail">
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

export default CoworkerInformation;