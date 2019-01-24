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
        console.log(details.assignee);
        return {
            forminitialValues: isEmpty(details.rawOutput) ? getLabelSchema() : details.rawOutput.PartnerOnboarding.PartnerLabels,
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

const PartnerLabel = enhance(({ color, taskDetails, taskId, forminitialValues }) => {
    console.log("this is header Color", taskDetails);
    return (
        <div>
         <Formik
         enableReinitialize
         initialValues={forminitialValues}
         onSubmit={async(values, actions) => {
             console.log(values)
            const formValues = {
                PartnerLabels: null,
                PartnerOnboarding: {
                    PartnerLabels: {
                        ...values 
                    }
                },
            };
            console.log(formValues);
            await axios.post(`/api/tasks/${taskId}/complete`, formValues);
            actions.setSubmitting(false);
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
                                        <Col sm="9">
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
                    <Button type="submit" color="success" className="mtl">Save</Button>
                </div>
             </Form>
         }
         </Formik>
        </div>
    )

});

export default PartnerLabel;