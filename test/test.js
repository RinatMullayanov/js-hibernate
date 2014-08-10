var jsORM = require('../index.js');

var userMap = jsORM.tableMap('User')
			.columnMap('id', 'id')
			.columnMap('name', 'shortName')
			.columnMap('phone', 'tel');

var sqlQuery = jsORM.query(userMap).select();
console.log(sqlQuery);

console.log("check");