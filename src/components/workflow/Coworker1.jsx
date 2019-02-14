import React from 'react';
import {
    compose,
    withPropsOnChange,
    pure,
} from  'recompose';
import isEmpty from '../../utils/isEmpty';
import { Row, Col, Button } from 'reactstrap';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { manageProps } from './withMangaeProps';
import { manageLifeCycle } from './manageLifeCycle';
import { filterTasks } from '../../utils/getActiveTab';

const enhance = compose(
    manageProps,
    withPropsOnChange(['details'], ({ details, mappedProperty }) => {
        const { id, caseInstanceId } = details;
        return {
            taskId: id ,
            caseId: caseInstanceId,
            forminitialValues: isEmpty(details.rawOutput[mappedProperty]) ? '' : details.rawOutput[mappedProperty],
        }
    }),
    pure,
    manageLifeCycle,
);

const Coworker1 = enhance(({ taskDetails, forminitialValues, taskId, caseId, setTasks, setSpinner}) => {
    console.log(forminitialValues);
    return (
        <React.Fragment>
            <div>
                <Formik
                    enableReinitialize
                    initialValues={{ ...forminitialValues }}
                    validationSchema={Yup.object({
                        Email: Yup.string().email('Invalid Email').required('Email is required')
                    })}
                    onSubmit= { async(values, actions) =>{
                        const data = {
                            MemberEmail: {
                                ...values
                            },
                        };
                        const response = await axios.post(`/api/tasks/${taskId}/complete`, data);
                        if(response.data) {
                            setSpinner(true);
                            actions.setSubmitting(true);
                        }
                        setTimeout(async() =>{
                            const result = await axios.get(`/api/cases/${caseId}`);
                            result && await setTasks(filterTasks(result.data._2.planitems));
                            document.getElementById("left-tabs-example-tab-3").click()
                            setSpinner(false);
                            actions.setSubmitting(false);
                        },7500)
                    }}
                >
                {
                    ({ isSubmitting, errors }) => <div>
                            <Form>
                                <Row>
                                    <Col sm="11">
                                        <label>Enter Email</label>
                                        <Field type="email" name="Email" placeholder="Enter Email" disabled={taskDetails.planState === "Completed"} className={`form-control ${errors && errors.email && 'error-field'}`} />
                                        <ErrorMessage name="Email">
                                            {
                                                msg => <div className="error-message">{msg}</div>
                                            }
                                        </ErrorMessage>
                                        <Button type="submit" color="success" disabled={isSubmitting || taskDetails.planState === "Completed"} className="mtl">Save</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                }
                </Formik>
            </div>
        </React.Fragment>
    )

});

export default Coworker1;