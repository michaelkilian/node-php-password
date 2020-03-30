/**
 * AlgorithmInfo
 *
 * @package php-password
 * @author Michael Kilian <michael.kilian2406@gmail.com>
 * @copyright (c) 2020, Michael Kilian
 */
import { AlgorithmOptions } from './algorithm-options.interface';

export interface AlgorithmInfo {
  algoName: string;
  options:  AlgorithmOptions;
}
