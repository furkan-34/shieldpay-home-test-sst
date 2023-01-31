export const apiResponse = async (statusCode: number, payload: any) => {
    return {
        statusCode: statusCode,
        body: JSON.stringify({
            statusCode: statusCode,
            payload: payload
        })
    }
}
