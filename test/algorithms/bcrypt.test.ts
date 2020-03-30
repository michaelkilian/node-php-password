/**
 * bcrypt algorithm test
 *
 * @package php-password
 * @author Michael Kilian <michael.kilian2406@gmail.com>
 * @copyright (c) 2020, Michael Kilian
 */
import { IAlgorithm }      from '@src/interfaces/algorithm.interface.ts';
import { createAlgorithm } from '@src/algorithms/bcrypt';

describe('bcrypt algorithm implementation', (): void => {
  const sut: IAlgorithm = createAlgorithm();

  it('failedToTestRegex_missingCost', (): void => {
    const valid = sut.testRegEx('$2y$d3$8mNOnsos8qo4qHLcd32zrOg7gmyvfZ6/o9.2nsP/u6TRbrANdLREy');

    expect(valid).toBeFalsy();
  });

  it('failedToTestRegex_invalidLength', (): void => {
    const valid = sut.testRegEx('$2y$d3$8mNOnsos8qo4qHLcd32');

    expect(valid).toBeFalsy();
  });

  it('successfullyTestedRegEx', (): void => {
    const valid = sut.testRegEx('$2y$10$8mNOnsos8qo4qHLcd32zrOg7gmyvfZ6/o9.2nsP/u6TRbrANdLREy');

    expect(valid).toBeTruthy();
  });

  it('failedToGetCost_missingCost', (): void => {
    const cost = sut.getCost('$2y$d3$8mNOnsos8qo4qHLcd32zrOg7gmyvfZ6/o9.2nsP/u6TRbrANdLREy');

    expect(cost).toBe(0);
  });

  it('failedToGetCost_invalidLength', (): void => {
    const cost = sut.getCost('$2y$d3$8mNOnsos8qo4qHLc');

    expect(cost).toBe(0);
  });

  it('getCost_returns10', (): void => {
    const cost = sut.getCost('$2y$10$8mNOnsos8qo4qHLcd32zrOg7gmyvfZ6/o9.2nsP/u6TRbrANdLREy');

    expect(cost).toBe(10);
  });

  it('verifyFailed_invalidParameters', (): void => {
    expect(() => {
      try {
        sut.verify(undefined as unknown as string, '')
      } catch (err) {
        expect(err.message).toBe('argument "password" is not a string');
        throw err;
      }
    }).toThrow(Error);

    expect(() => {
      try {
        sut.verify('', undefined as unknown as string)
      } catch (err) {
        expect(err.message).toBe('argument "hash" is not a string');
        throw err;
      }
    }).toThrow(Error);

    expect(() => {
      try {
        sut.verify('', '$2y$d3$8mNOnsos8qo4qHLc')
      } catch (err) {
        expect(err.message).toBe('input does not match with regexp');
        throw err;
      }
    }).toThrow(Error);
  });

  it('verifyFailed_mismatch', (): void => {
    const valid = sut.verify('test', '$2y$10$8mNOnsos8qo4qHLcd32zrOg7gmyvfZ6/o9.2nsP/u6TRbrANdLREy');

    expect(valid).toBeFalsy();
  });

  it('verifySucceeded', (): void => {
    const valid = sut.verify('password123', '$2y$10$8mNOnsos8qo4qHLcd32zrOg7gmyvfZ6/o9.2nsP/u6TRbrANdLREy');

    expect(valid).toBeTruthy();
  });

  it('hashFailed_invalidParameter', (): void => {
    expect(() => {
      try {
        sut.hash(undefined as unknown as string)
      } catch (err) {
        expect(err.message).toBe('argument "password" is not a string');
        throw err;
      }
    }).toThrow(Error);
  });

  it('hashFailed_saltIsTooShort', (): void => {
    expect(() => {
      try {
        sut.hash('password123', { cost: 10, salt: 'less' });
      } catch (err) {
        expect(err.message).toBe('provided salt is too short: 4 expecting min. 16');
        throw err;
      }
    }).toThrow(Error);
  });

  it('hashSucceeded', (): void => {
    const hash = sut.hash('password123');
    expect(hash).not.toBeUndefined();
    expect(hash.length).toBeGreaterThan(0);

    const valid = sut.verify('password123', hash);
    expect(valid).toBeTruthy();
  });
});
