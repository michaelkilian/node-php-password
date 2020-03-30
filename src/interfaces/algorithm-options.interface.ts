/**
 * AlgorithmOptions
 *
 * @package php-password
 * @author Michael Kilian <michael.kilian2406@gmail.com>
 * @copyright (c) 2020, Michael Kilian
 */
export interface AlgorithmOptions {
  cost: number;
  salt?: string;
}
