export const findMax = (values) => {
    let max = values[0]
    values.forEach(m => {
        if (max < m) {
            max = m
        }
    })
    return max
}

export const findMin = (values) => {
    let min = values[0]
    values.forEach(m => {
        if (min > m) {
            min = m
        }
    })
    return min
}