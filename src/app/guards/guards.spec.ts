import { authGuard } from './guards';

describe('Guard', () => {
  it('should return a boolean value', () => {
    const result = authGuard();
    expect(typeof result).toBe('boolean');
  });
});
