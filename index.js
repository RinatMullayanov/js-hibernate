var mysql = require('mysql');
var string = require('string-formatter');

var jsORM = {};

function createSession(dbconfig) {
    var self = this instanceof createSession ? this : Object.create(createSession.prototype);

    self.dbConfig = dbconfig;
    self.mappings = {};
    return self;
}

function createTableMap(tableName) {
    if (this instanceof createSession) {
        var session = this;

        var map = Object.create(createTableMap.prototype);
        map.table = tableName;
        // todo: check unique!
        session.mappings[tableName] = map;

        return map;
    }

    return "undefined";
}

createTableMap.prototype.columnMap = function(objProperty, tableProperty) {
    var map = this;

    map.columnMaps = map.columnMaps || {};
    map.columnMaps[objProperty] = tableProperty;

    return this;
};
createSession.prototype.tableMap = createTableMap;


function createQuery(tblMap) {
    // check instance 
    var self = this;
    if (self instanceof createSession && tblMap instanceof createTableMap) {
        var query = Object.create(createQuery.prototype);
        query.session = self;
        query.tableMap = tblMap;

        return query;
    };
};
createSession.prototype.query = createQuery;

createQuery.prototype.select = function(callback) {
    var config = this;
    var sql = queryBuild(config.tableMap);

    executeQuery(config.session, sql, callback);
};

function queryBuild(tblMap) {
    // generate sql
    var sqlQuery = 'select ';
    var map = tblMap.columnMaps;

    for (var prop in map) {
        if (!map.hasOwnProperty(prop)) continue;
        sqlQuery += '`{' + prop + '}`, ';
    }
    // remove last comma
    var lastComma = sqlQuery.lastIndexOf(',');
    sqlQuery = sqlQuery.substring(0, lastComma);

    sqlQuery = string.format(sqlQuery, map);
    sqlQuery += ' from `' + tblMap.table +'`';

    return sqlQuery;
}

function executeQuery(session, sqlQuery, callback) {
    var connection = mysql.createConnection(session.dbConfig);

    connection.query(sqlQuery, function(err, rows) {
        // connected! (unless `err` is set)
        if (err) {
            callback(err);
        } else {
            callback(null, rows);
        };
    });

    connection.end();
}

jsORM.session = createSession;
module.exports = jsORM;
