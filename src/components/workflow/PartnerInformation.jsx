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

const PartnerInformation = enhance(({forminitialValues, ...restProps }) => {
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
                onSubmit= {(values, actions) =>{
                    formSubmit(values, actions, 2, restProps);
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