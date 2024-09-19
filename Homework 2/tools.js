export const extractKeys = (data) => {
    const exampleObject = data[0]
    const keys = Object.keys(exampleObject)
    const dimensions = keys.filter(k => k !== 'class')
    return dimensions
}