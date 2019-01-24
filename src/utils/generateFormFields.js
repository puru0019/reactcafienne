import isEmpty from './isEmpty';

const generateFormFields = (formSchema) => {
    const data = isEmpty(formSchema)
    if(!data) {
        const { schema } = formSchema;
        const schemaKeys = Object.keys(schema.properties);
        const FieldKeys = Object.keys(schema.properties[schemaKeys[0]].properties);
        const fieldData = FieldKeys.map(item => {
            if (schema.properties[schemaKeys[0]].properties[item]) {
                if(item === 'Color') {
                    return {
                        ...schema.properties[schemaKeys[0]].properties[item],
                        type: 'select'
                    }
                }
                return schema.properties[schemaKeys[0]].properties[item];
            }
        });
        const formData = {
            [schemaKeys[0]]: {
                [FieldKeys[0]]: ''
            }
        }
        return { fieldData , formData };
    }
    return formSchema || {};
}

export default generateFormFields;