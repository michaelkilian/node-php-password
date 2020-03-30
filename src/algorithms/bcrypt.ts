/**
 * bcrypt
 *
 * @package php-password
 * @author Thomas Alrek <thomas@alrek.no>
 * @copyright (c) 2016, Thomas Alrek
 * @author Michael Kilian <michael.kilian2406@gmail.com>
 * @copyright (c) 2020, Michael Kilian
 * @description bcrypt algorithm interface implementation, ported to TypeScript.
 */
import { IAlgorithm }       from '../interfaces/algorithm.interface';
import { AlgorithmOptions } from '../interfaces/algorithm-options.interface';
import BCrypt               from 'bcryptjs';

class bcrypt implements IAlgorithm {
  public getName(): string {
    return 'PASSWORD_BCRYPT';
  }

  public getCost(hash: string): number {
    const match = this.execRegEx(hash);

    return match != undefined && match[2] != undefined
      ? parseInt(match[2])
      : 0;
  }

  public getDefaultOptions(): AlgorithmOptions {
    return { cost: 10 };
  }

  public execRegEx(hash: string): RegExpExecArray | null {
    bcrypt.regex.lastIndex = 0;
    return bcrypt.regex.exec(hash);
  }

  public testRegEx(hash: string): boolean {
    bcrypt.regex.lastIndex = 0;
    return bcrypt.regex.test(hash);
  }

  public verify(password: string, hash: string): boolean {
    if (typeof password !== 'string') {
      throw new Error('argument "password" is not a string');
    }
    if (typeof hash !== 'string') {
      throw new Error('argument "hash" is not a string');
    }

    const match = this.execRegEx(hash);
    if (match == undefined || match[2] == undefined || match[3] == undefined) {
      throw new Error(`input does not match with regexp`);
    }

    return BCrypt.compareSync(password, `$2a$${match[2]}$${match[3]}`);
  }

  public hash(password: string, options?: AlgorithmOptions): string {
    if (typeof password !== 'string') {
      throw new Error(`argument "password" is not a string`);
    }

    const norm = this.getDefaultOptions();
    if (options == undefined) {
      options = norm
    }
    if (options.cost < norm.cost) {
      options.cost = norm.cost;
    }

    let salt: string = '';
    if (options.salt != undefined) {
      console.warn('Usage of the "salt" option is deprecated');

      if (options.salt.length < 16) {
        throw new Error(`provided salt is too short: ${options.salt.length} expecting min. 16`);
      }

      salt =`$2y$${options.cost}$${options.salt}`;
    } else {
      salt = BCrypt.genSaltSync(options.cost);
    }

    const hash  = BCrypt.hashSync(password, salt);
    const match = this.execRegEx(hash);

    if (match == undefined || match[3] == undefined) {
      throw new Error(`failed to validate regex`);
    }

    return `$2y$${options.cost}$${match[3]}`
  }

  private static readonly regex = /\$(2[a|x|y])\$(\d+)\$(.{53})/g;
}

export const createAlgorithm = (): IAlgorithm =>
  new bcrypt();
