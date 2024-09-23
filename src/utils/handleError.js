export function handleError(message) {
    const error = new Error(message);
    error.status = 'error';
    return error;
  }