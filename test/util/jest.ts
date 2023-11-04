

export const isErrorFromJest = (error: Error): boolean => {
    return error.message.includes('received') && error.message.includes('expected');
}
