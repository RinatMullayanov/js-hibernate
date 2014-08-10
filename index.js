var jsORM = {};
var stringFormat = require('string-formatter');

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

jsORM.query.prototype.select = function() {
    // generate sql
    var sqlQuery = 'select ';
    var self = this;
    var map = self.map.columnMaps;

    for (var prop in map) {
        if (!map.hasOwnProperty(prop)) continue;
        sqlQuery += '{' + prop + '}, ';
    }
    // remove last comma
    var lastComma = sqlQuery.lastIndexOf(',');
    sqlQuery = sqlQuery.substring(0, lastComma);

    return sqlQuery;
}

module.exports = jsORM;