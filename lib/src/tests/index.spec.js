import { foo } from '../foo';

describe('test suite', () => {
  it('test case', () => {
    expect(foo()).toBe('foo');
  });

  it.skip('test case that fails', () => {
    expect(foo()).toBe('bar');
  });
});
