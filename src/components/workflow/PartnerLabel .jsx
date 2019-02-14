import React from 'react';
import {
    compose,
    withPropsOnChange,
    pure,
} from  'recompose';
import isEmpty from '../../utils/isEmpty';
import { Row, Col, Button } from 'reactstrap';
import { Formik, Field, ErrorMessage, Form, FieldArray } from 'formik';
import { manageProps } from './withMangaeProps';
import { manageLifeCycle } from './manageLifeCycle';
import { formSubmit } from './formUtilities';

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
    manageProps,
    withPropsOnChange(['details'], ({ details, mappedProperty }) => {
        const { id, caseInstanceId } = details;
        return {
            taskId: id ,
            caseId: caseInstanceId,
            forminitialValues: isEmpty(details.mappedInput[mappedProperty]) ? getLabelSchema() : details.mappedInput[mappedProperty],
        }
    }),
    pure,
    manageLifeCycle,
);

const PartnerLabel = enhance(({ forminitialValues, ...restProps }) => {
    return (
        <div>
         <Formik
         enableReinitialize
         initialValues={forminitialValues}
         onSubmit={(values, actions) => {
            formSubmit(values, actions, 7, restProps);
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
                                        <Col sm={11}>
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
                    <Button type="submit" color="success" disabled={isSubmitting}  className="mtl">Save</Button>
                </div>
             </Form>
         }
         </Formik>
        </div>
    )

});

export default PartnerLabel;