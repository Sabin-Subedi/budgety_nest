import { RequestMiddleware } from './request.middleware';

describe('RequestMiddleware', () => {
  it('should be defined', () => {
    expect(new RequestMiddleware()).toBeDefined();
  });
});
