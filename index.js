var mysql = require('mysql');

var jsORM = {};
var string = require('string-formatter');

jsORM.session = function(dbconfig){
	var self = this instanceof jsORM.session ? this : Object.create(jsORM.session.prototype);

	self.dbconfig = dbconfig;
	return self;
}

jsORM.tableMap = function(tableName) {
    var self = this instanceof jsORM.tableMap ? this : Object.create(jsORM.tableMap.prototype);

    self.tableName = tableName;
    return self;
}

jsORM.tableMap.prototype.columnMap = function(objProperty, tableProperty) {
    this.columnMaps = this.columnMaps || {};
    this.columnMaps[objProperty] = tableProperty;

    return this;
};

jsORM.query = function(tableMap) {
    // check instance 
    if (tableMap instanceof jsORM.tableMap) {
        var self = this instanceof jsORM.query ? this : Object.create(jsORM.query.prototype);

        self.map = tableMap;
        return self;
    }
}

function queryBuild(query) {
    // generate sql
    var sqlQuery = 'select ';
    var map = query.map.columnMaps;

    for (var prop in map) {
        if (!map.hasOwnProperty(prop)) continue;
        sqlQuery += '{' + prop + '}, ';
    }
    // remove last comma
    var lastComma = sqlQuery.lastIndexOf(',');
    sqlQuery = sqlQuery.substring(0, lastComma);

    sqlQuery = string.format(sqlQuery, map);
    sqlQuery += ' from ' + query.map.tableName;

    return sqlQuery;
}

function executeQuery(sqlQuery, callback) {
    var connection = mysql.createConnection(dbconfig);

    connection.query(sqlQuery, function(err, rows) {
        // connected! (unless `err` is set)
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        };
    });

    connection.end();
}

jsORM.query.prototype.select = function(callback) {
    var self = this;
    var sql = queryBuild(self);

    executeQuery(sql, callback);
}

module.exports = jsORM;
