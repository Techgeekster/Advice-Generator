import { AdviceIndexPipe } from './advice-index.pipe';

describe('AdviceIndexPipe', () => {
  let pipe: AdviceIndexPipe;

  beforeEach(() => {
    pipe = new AdviceIndexPipe();
  });

  it('should return formatted string when total > 1', () => {
    const result = pipe.transform(2, 5);
    expect(result).toBe('3 / 5');
  });

  it('should return an empty string when total <= 1', () => {
    const result = pipe.transform(0, 1);
    expect(result).toBe('');
  });

  it('should handle edge case when total is 0', () => {
    const result = pipe.transform(0, 0);
    expect(result).toBe('');
  });

  it('should handle negative selectedIndex gracefully', () => {
    const result = pipe.transform(-1, 5);
    expect(result).toBe('0 / 5');
  });
});
