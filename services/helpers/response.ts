export const apiResponse = async (statusCode: number, payload: any) => {
    return {
        statusCode: statusCode,
        body: {
            statusCode: statusCode,
            payload: payload
        }
    }
}