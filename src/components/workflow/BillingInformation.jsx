import React from 'react';
import {
    compose,
    setDisplayName,
    pure,
} from  'recompose';
import { Row, Col, Button } from 'reactstrap';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { manageProps, managePropsOnChange } from './withMangaeProps';
import { manageLifeCycle } from './manageLifeCycle';
import { formSubmit } from './formUtilities';

const enhance = compose(
    setDisplayName("BillingInformation"),
    manageProps,
    managePropsOnChange,
    pure,
    manageLifeCycle,
);

const BillingInformation = enhance(({forminitialValues, ...restProp} ) => {
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
                onSubmit= { (values, actions) =>{
                    formSubmit(values, actions, 5, restProp);
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