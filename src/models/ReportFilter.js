class ReportFilter {
    constructor(title, options, multiple, queryKey) {
        this.title = title
        // options is an object with id, title properties
        this.options = options
        this.multiple = multiple
        // for passing query parameter
        this.queryKey = queryKey
    }
}

export default ReportFilter
