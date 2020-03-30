/**
 * php-password
 *
 * @package php-password
 * @author Thomas Alrek <thomas@alrek.no>
 * @copyright (c) 2016, Thomas Alrek
 * @author Michael Kilian <michael.kilian2406@gmail.com>
 * @copyright (c) 2020, Michael Kilian
 * @description bcrypt algorithm interface implementation, ported to TypeScript.
 */
import G from 'glob';
import path from 'path';
import { IAlgorithm } from './interfaces/algorithm.interface';
import { AlgorithmInfo } from './interfaces/algorithm-info.interface';
import { AlgorithmOptions } from './interfaces/algorithm-options.interface';

const algorithms: Record<string, IAlgorithm> = {};

const aliases = require(path.resolve(__dirname, '..', '..', 'package.json')).aliases as Record<string, string>;

for (const filename of G.sync(path.resolve(__dirname, 'algorithms', '*.js'))) {
  try {
    const mod = require(filename) as any;
    if (!mod.hasOwnProperty('createAlgorithm')) {
      throw new Error(`module "${filename}" does not export "createAlgorithm"`);
    }

    const algo = (mod.createAlgorithm as (() => IAlgorithm))();

    algorithms[algo.getName()] = algo;
  } catch (err) {
    console.error(err);
  }
}

if (Object.keys(algorithms).length === 0) {
  throw new Error(`no algorithms loaded`);
}

export const getInfo = (hash: string): AlgorithmInfo => {
  for (const key in algorithms) {
    const algo = algorithms[key];

    if (algo.testRegEx(hash)) {
      return {
        algoName: algo.getName(),
        options: {
          cost: algo.getCost(hash)
        }
      };
    }
  }

  throw new Error(`unknown algorithm for hash: ${hash}`);
};

export const hash = (password: string, algorithm?: string, options?: AlgorithmOptions): string => {
  if (algorithm == undefined) {
    algorithm = 'PASSWORD_DEFAULT';
  }
  if (options == undefined) {
    options = { cost: 0 };
  }
  if (aliases.hasOwnProperty(algorithm)) {
    algorithm = aliases[algorithm];
  }

  const algo = algorithms[algorithm];
  if (algo == undefined) {
    throw new Error(`unknown algorithm: ${algorithm}`);
  }

  return algo.hash(password, options);
};

export const needsRehash = (hash: string, algorithm: string, options?: AlgorithmOptions): boolean => {
  const info = getInfo(hash);

  if (aliases.hasOwnProperty(algorithm)) {
    algorithm = aliases[algorithm];
  }

  const algo = algorithms[algorithm];
  if (algo == undefined) {
    throw new Error(`unknown algorithm: ${algorithm}`);
  }

  if (algo.getName() === info.algoName) {
    if (options != undefined && options.cost != undefined) {
      return info.options.cost < options.cost;
    }
    return false;
  }

  return true;
};

export const verify = (password: string, hash: string) =>
  algorithms[getInfo(hash).algoName].verify(password, hash);
