/**
 * IAlgorithm
 *
 * @package php-password
 * @author Michael Kilian <michael.kilian2406@gmail.com>
 * @copyright (c) 2020, Michael Kilian
 */
import { AlgorithmOptions } from './algorithm-options.interface';

export interface IAlgorithm {
  getName(): string;
  getCost(hash: string): number;
  getDefaultOptions(): AlgorithmOptions
  execRegEx(hash: string): RegExpExecArray | null;
  testRegEx(hash: string): boolean;
  verify(password: string, hash: string): boolean;
  hash(password: string, options?: AlgorithmOptions): string;
}
