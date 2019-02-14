import { withProps, withPropsOnChange } from 'recompose';
import { getFormValues, getMappedProperty } from './formUtilities';
import isEmpty from '../../utils/isEmpty';

export const manageProps = withProps(ownerProps => ({
    details: ownerProps.taskDetails,
    mappedProperty: getMappedProperty(ownerProps.taskDetails.taskInput),
}));

export const managePropsOnChange = withPropsOnChange(['details'], ({ details, mappedProperty }) => {
    const { id, caseInstanceId } = details;
    return {
        taskId: id,
        caseId: caseInstanceId,
        forminitialValues: isEmpty(details.mappedInput[mappedProperty]) ? getFormValues(details.taskModel.schema.properties[mappedProperty].properties) : details.mappedInput[mappedProperty],
    }
})