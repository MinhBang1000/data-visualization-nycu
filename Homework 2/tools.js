export const extractKeys = (data) => {
    const exampleObject = data[0]
    const keys = Object.keys(exampleObject)
    const dimensions = keys.filter(k => k !== 'class')
    return dimensions
}

export const findMinMax = (data) => {
    const exampleObject = data[0]
    const keys = Object.keys(exampleObject)
    const dimensions = keys.filter(k => k !== 'class')

    let min = data[0][dimensions[0]]
    let max = data[0][dimensions[0]]
    data.forEach((d) => {
        dimensions.forEach((dim) => {
            min = min < d[dim] ? min : d[dim]
        })
        dimensions.forEach((dim) => {
            max = max > d[dim] ? max : d[dim]
        })
    })
    return {
        max: Math.round(max),
        min: Math.round(min)
    }
}

export const findValues = (a,b,duration) => {
    const values = []
    const tempDura = duration
    for (let i = a; i <= b; i++){
        if (duration === 0 || i === a) {
            values.push(i)
            duration = tempDura
        }
        duration--
    }
    return values
}

export const replaceHyphenWithSpace = (str) => {
    return str.replace(/-/g, ' ');
}