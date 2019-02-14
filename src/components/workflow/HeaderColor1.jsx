import React from 'react';
import {
    compose,
    withPropsOnChange,
    pure,
} from  'recompose';
import isEmpty from '../../utils/isEmpty';
import { Row, Col, Button } from 'reactstrap';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import { manageProps } from './withMangaeProps';
import { manageLifeCycle } from './manageLifeCycle';
import { formSubmit } from './formUtilities';

const enhance = compose(
    manageProps,
    withPropsOnChange(['details'], ({ details, mappedProperty }) => {
        const { id, caseInstanceId } = details;
        return {
            taskId: id ,
            caseId: caseInstanceId,
            forminitialValues: isEmpty(details.mappedInput[mappedProperty]) ? '' : details.mappedInput[mappedProperty],
            options: isEmpty(details) ? [] : details.taskModel.schema.properties[mappedProperty].properties.Color.enum,
        }
    }),
    pure,
    manageLifeCycle,
);

const HeaderColor1 = enhance(({ forminitialValues, options, ...restProp }) => {
    return (
        <div>
         <Formik
         enableReinitialize
         initialValues={{...forminitialValues}}
         onSubmit={(values, actions) => {
            formSubmit(values, actions, 6, restProp);
         }}
         >
         {
             ({ isSubmitting }) =>
             <Form>
                <Row>
                    <Col sm="11">
                        <label>Select Color</label>
                        <div>
                            <Field component="select" name="Color" placeholder="Select Color" className="form-control">
                                {
                                    options && options.map((option,key) => <option key={key} value={option}>{option}</option>)
                                }
                            </Field>
                        </div>
                        <div>
                        <Button type="submit" color="success" disabled={isSubmitting}  className="mtl">Save</Button>
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