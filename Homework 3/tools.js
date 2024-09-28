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

const caculateR = (keyX, keyY, data) => {
    // Extract values for the two keys
    const xValues = data.map(d => d[keyX]);
    const yValues = data.map(d => d[keyY]);

    // Calculate means
    const meanX = xValues.reduce((a, b) => a + b, 0) / xValues.length;
    const meanY = yValues.reduce((a, b) => a + b, 0) / yValues.length;
    

    // Calculate the numerator and denominator for Pearson correlation
    let numerator = 0;
    let denominatorX = 0;
    let denominatorY = 0;

    for (let i = 0; i < xValues.length; i++) {
        const diffX = xValues[i] - meanX;
        const diffY = yValues[i] - meanY;
        numerator += diffX * diffY;
        denominatorX += diffX ** 2;
        denominatorY += diffY ** 2;
    }

    // Calculate Pearson correlation coefficient
    const r = numerator / Math.sqrt(denominatorX * denominatorY);
    return r;
};


export const findR = (data, keys) => {
    const arr = new Array() // Initialize an object to store correlation coefficients

    for (let i = 0; i < keys.length; i++) { // Loop through all keys
        for (let j = 0; j < keys.length; j++) {
            const keyX = keys[i];
            const keyY = keys[j];

            // Ensure not to calculate the correlation of 'Sex'
            if (keyX !== 'Sex' && keyY !== 'Sex') {
                const r = caculateR(keyX, keyY, data); // Calculate correlation
                arr.push({
                    keyX: keyX,
                    keyY: keyY,
                    r: r
                }) // Store the result
            }
        }
    }
    return arr; // Return the object containing correlation coefficients
};


export const createClassname = (value) => {
    if (value < -1 || value > 1) {
        return 'F'
    }
    // [-1, -0.5]
    if (value <= -0.5) {
        return 'A' 
    }
    // (-0.5, 0]
    if (value <= 0) {
        return 'B'
    }
    // (0, 0.5]
    if (value <= 0.5) {
        return 'C'
    }
    // (0.5, 1]
    return 'D'
}