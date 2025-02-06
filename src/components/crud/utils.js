function createField(label, field = "", type = "text", required = false, value = "", options = []) {
    // for custom form field object for crud form
    return {
        label,
        field,
        type,
        required,
        value,
        options,
    }
}
function createColumn(label, field, type) {
    // for vue good table
    return {
        label,
        field,
        type,
    }
}

function createFormData(formValues) {
    const formData = new FormData()
    for (let key in formValues) {
        formData.append(key, formValues[key] || "")
    }
    return formData
}

export { createField, createFormData, createColumn }
