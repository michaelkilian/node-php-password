# node-php-password

*Verify password hashed generated in PHP, and hash passwords in the same format.*

Designed to be **future proof** for new hashing algorithms.

node-php-password is a solution for every kind of webapp which has a user database with passwords hashed with PHP's password_hash. Instead of starting from scratch, just use this package to get compatibility with PHP.

### Usage:
```javascript
var Password = require("node-php-password");
var hash = Password.hash("password123");
// Password.hash(password, [algorithm], [options]);
```

**Output:**
```javascript
"$2y$10$8mNOnsos8qo4qHLcd32zrOg7gmyvfZ6/o9.2nsP/u6TRbrANdLREy"
```

### To verify a password against an existing hash in a database o.l:
```javascript
var Password = require("node-php-password");
var hash = "$2y$10$8mNOnsos8qo4qHLcd32zrOg7gmyvfZ6/o9.2nsP/u6TRbrANdLREy";

if(Password.verify("password123", hash)){
   //Authentication OK
}else{
   //Authentication FAILED
}
```

### Options
```javascript
var Password = require("node-php-password");
var options = {
   cost: 10,
   salt: "qwertyuiopasdfghjklzxc"
}
// Valid algorithms are "PASSWORD_DEFAULT", and "PASSWORD_BCRYPT"
// "PASSWORD_DEFAULT" is just an alias to "PASSWORD_BCRYPT", to be more
// compatible with PHP
var hash = Password.hash("password123", "PASSWORD_DEFAULT", options);
```

**Output:**
```javascript
"$2y$10$qwertyuiopasdfghjklzxO3U1f6PD/l04UrnxUgya51pjyLtkGNQi"
```

### Check if password needs rehash
If you have a mix of passwords hashed with different algorithms (md5, sha256, etc...), or with a different cost value, you can check if they comply with your password policy by checking if they need a rehash. If they do, you can prompt your user to update their password.
```javascript
var Password = require("node-php-password");
var hash = Password.hash("password123", "PASSWORD_DEFAULT", {cost: 10});
if(Password.needsRehash(hash, "PASSWORD_DEFAULT", {cost: 11}){
   //Password needs rehash, prompt the user to renew their password
}else{
   //Password is OK.
}
```