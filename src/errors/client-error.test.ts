import { ClientError } from '../errors/client-error';

describe('ClientError', () => {
  it('should create a new instance of ClientError', () => {
    const error = new ClientError('Test error');
    expect(error).toBeInstanceOf(ClientError);
  });

  it('should set the error message correctly', () => {
    const errorMessage = 'Test error';
    const error = new ClientError(errorMessage);
    expect(error.message).toBe(errorMessage);
  });

  it('should set the default status code to 400', () => {
    const error = new ClientError('Test error');
    expect(error.status).toBe(400);
  });

  it('should set the status code correctly', () => {
    const statusCode = 401;
    const error = new ClientError('Test error', statusCode);
    expect(error.status).toBe(statusCode);
  });
});
