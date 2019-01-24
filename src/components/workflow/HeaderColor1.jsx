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


const enhance = compose(
    withProps(props => {
        return {
            output: props.taskDetails.rawOutput,
            taskId: props.taskDetails.id ,
            caseId: props.taskDetails.caseInstanceId,
            details: props.taskDetails,
        }
    }),
    withPropsOnChange(['output','details'], ({ output, details }) => {
        console.log(details.assignee);
        return {
            color: isEmpty(output) ? '' : output.PartnerLabels.Color,
            options: isEmpty(details) ? [] : details.taskModel.schema.properties.PartnerLabels.properties.Color.enum,
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

const HeaderColor1 = enhance(({ color, taskDetails, taskId, options }) => {
    console.log("this is header Color", taskDetails, options);
    return (
        <div>
         <Formik
         enableReinitialize
         initialValues={{color}}
         onSubmit={async(values, actions) => {
            const formValues = {
                PartnerLabels: {
                    Color: values.color
                },
                Header_Color: null
            };
            await axios.post(`/api/tasks/${taskId}/complete`, formValues);
            action.setSubmitting(false);
         }}
         >
         {
             ({ isSubmitting, errors }) =>
             <Form>
                <Row>
                    <Col sm="11">
                        <label>Select Color</label>
                        <div>
                            <Field component="select" name="color" placeholder="Select Color" className="form-control">
                                {
                                    options && options.map((option,key) => <option key={key} value={option}>{option}</option>)
                                }
                            </Field>
                        </div>
                        <div>
                        <Button type="submit" color="success" className="mtl">Save</Button>
                        </div>
                    </Col>
                </Row>
             </Form>
         }
         </Formik>
        </div>
    )

});

export default HeaderColor1;