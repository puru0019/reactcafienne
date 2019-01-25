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


const enhance = compose(
    withProps(props => {
        return {
            output: isEmpty(props.taskDetails) ? {} : props.taskDetails.rawOutput,
            taskId: !isEmpty(props.taskDetails) ? props.taskDetails.id : '',
            caseId: !isEmpty(props.taskDetails) ? props.taskDetails.caseInstanceId: '',
        }
    }),
    withPropsOnChange(['output'], ({ output }) => {
        console.log(output);
        return {
            email: isEmpty(output) ? '' : output.MemberEmail.Email
        }
    }),
    pure,
    lifecycle({
        async componentDidMount() {
            console.log("component mount");
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

const Coworker1 = enhance(({ output, email, taskId, caseId, setTasks, setSpinner }) => {
    console.log(output, email,"co worker");
    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={{ email }}
                validationSchema={Yup.object({
                    email: Yup.string().email('Invalid Email').required('Email is required')
                })}
                onSubmit= { async(values, actions) =>{
                    const data = {
                        MemberEmail: {
                            Email: values.email
                        },
                    };
                    const response = await axios.post(`/api/tasks/${taskId}/complete`, data);
                    console.log("spinner not active");
                    if(response.data) {
                        console.log("spinner active");
                        setSpinner(true);
                        actions.setSubmitting(true);
                    }
                    setTimeout(async() =>{
                        const result = await axios.get(`/api/cases/${caseId}`);
                        console.log(result);
                        result && await setTasks(result.data._2.planitems);
                        getFinalTabStatus(result.data._2.planitems) && document.getElementById("left-tabs-example-tab-11").click();
                        setSpinner(false);
                        actions.setSubmitting(false);
                    },7000)
                }}
            >
            {
                ({ isSubmitting, errors }) => <div>
                        <Form>
                            <Row>
                                <Col sm="11">
                                    <label>Enter Email</label>
                                    <Field type="email" name="email" placeholder="Email" className={`form-control ${errors && errors.email && 'error-field'}`} />
                                    <ErrorMessage name="email">
                                        {
                                            msg => <div className="error-message">{msg}</div>
                                        }
                                    </ErrorMessage>
                                    { console.log(email) }
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

export default Coworker1;