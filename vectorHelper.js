function vectorMult() {

}

function vectorScale(vector, scaler) {
    return [vector[0] * scaler, vector[1] * scaler]
}

function vectorAdd(vec1, vec2) {
    vec1[0] += vec2[0]
    vec1[1] += vec2[1]

    return vec1
}

function vectorDirection(point1, point2) {
    return [point1[0] - point2[0], point1[1] - point2[1]]
}

function unitVector(vector) {
    magnitude = math.sqrt(vector[0] * vector[0] + vector[1] * vector[1])
    return [vector[0] / magnitude, vector[1] / magnitude]
}


export { vectorMult, vectorAdd, vectorDirection, unitVector, vectorScale }