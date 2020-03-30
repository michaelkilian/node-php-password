/**
 * test
 *
 * @package node-php-password
 * @copyright (c) 2016, Thomas Alrek
 * @author Thomas Alrek <thomas@alrek.no>
 */
const path = require('path');
const fs   = require('fs');

if (!fs.existsSync(path.resolve(__dirname, '..', 'build'))) {
  console.error('Missing "build" directory. Run "yarn build" or "yarn tsc" first!');
  process.exit(1);
}

const assert        = require('assert');
const Password      = require('../build/src/index.js');
const package       = require('../package.json');
const test_password = 'password123';

describe('PHP-Password', () => {
  const test_hash = Password.hash(test_password, 'PASSWORD_DEFAULT', { cost: 10 });
  describe('constants', () => {
    it('"PASSWORD_DEFAULT" == "PASSWORD_BCRYPT"', () => {
      assert(package.aliases["PASSWORD_DEFAULT"] == "PASSWORD_BCRYPT", "'PASSWORD_DEFAULT' is not 'PASSWORD_BCRYPT'");
    });
  });

  describe('hash', () => {
    it('Hash is not equal to Password', () => {
      assert(test_hash !== test_password, 'Hash is equal to Password');
    });
    it("Hash starts with '$'", () => {
      assert(test_hash.charAt(0) == "$", "Hash doesn't starts with '$'");
    });
    it('Hash is 60 characters long', () => {
      assert(test_hash.length == 60, "Hash is not 60 characters long");
    });
  });
  describe('verify', () => {
    it('Verify hash against original password', () => {
      assert(Password.verify(test_password, test_hash), "Couldn't verify hash against original password");
    });
  });
  describe('getInfo', () => {
    var info = Password.getInfo(test_hash);
    it("Verify that hash has 'bcrypt' as algorithm", () => {
      assert(info.algoName == "PASSWORD_BCRYPT", "Hash doesn't have 'bcrypt' as algorithm");
    });
    it('Verify that hash has cost value of 10', () => {
      assert(info.options.cost == 10, "Couldn't verify that hash has cost value of 10");
    });
  });
  describe('needsRehash', () => {
    it("Verify that password doesn't needs rehash {cost: 10}", () => {
      assert(!Password.needsRehash(test_hash, "PASSWORD_DEFAULT", {
        cost: 10
      }), "Password needs rehash");
    });
    it("Verify that password needs rehash {cost: 11}", () => {
      assert(Password.needsRehash(test_hash, "PASSWORD_DEFAULT", {
        cost: 11
      }), "Password doesn't need rehash");
    });
  });
});
