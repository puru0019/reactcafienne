import React from 'react';
import {
    compose,
    pure,
} from  'recompose';
import { Row, Col, Button } from 'reactstrap';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { manageProps, managePropsOnChange } from './withMangaeProps';
import { manageLifeCycle } from './manageLifeCycle';
import { formSubmit } from './formUtilities';

const enhance = compose(
    manageProps,
    managePropsOnChange,
    pure,
    manageLifeCycle,
);

const CoworkerInformation = enhance(({forminitialValues, ...restProps }) => {
    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={{ ...forminitialValues }}
                validationSchema={Yup.object({
                    IsAdministrator: Yup.string().required('Required'),
                    FirstName: Yup.string().required('First name is required'),
                    TelePhone: Yup.number().required('Telephone is required'),
                    Gender: Yup.string().required('Required'),
                    LastName: Yup.string().required('Last name is required'),
                    Insert: Yup.string().required('surname name is required'),
                    MedewerkersEmail: Yup.string().email('Invalid Email').required('Medwerkers email is required'),
                })}
                onSubmit= { async(values, actions) =>{
                    formSubmit(values, actions, 4, restProps);
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