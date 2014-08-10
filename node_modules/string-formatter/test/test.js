var string = require('../index.js');
var testForManySeparateArgs = string.format('Hello {0}, My name is {1}', 'World', 'Rinat');
console.log(testForManySeparateArgs);

var user = {
    id: 'id',
    name: 'shortName',
    phone: 'tel'
};

var testForTwoArgsWhereTwoIsObject = string.format('select {id}, {name}, {phone}', user);
console.log(testForTwoArgsWhereTwoIsObject);
