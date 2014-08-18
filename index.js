// из-за того что тесты запускаются в другом контексте
// require не известная функция и толком файл не парсится!
// точнее не парсятся те функции которые используют переменные которые
// мы пытались инициализировать через require()
// надо смотреть как другие тесты пишут
var mysql = require('mysql');
var string = require('string-formatter');
var RSVP = require('rsvp');

var e = require('./error.js');

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
        // check unique!
        if (session.mappings[tableName]) throw new e.TableMapDuplicateError(tableName);
        session.mappings[tableName] = map;

        return map;        
    }

    return "undefined";
}

function EqualFunc(value) {
    var self = this;    

    var where = "`" + self.columnName + "` = '{0}' ";
    self.whereCondition = string.format(where, value);

    return self;
}

function AndFunc(value) {
    var self = this;

    if(self.whereCondition) self.whereCondition += ' and ';   

    return self;
}

createTableMap.prototype.columnMap = function(objProperty, tableProperty) {
    var map = this;

    map.columnMaps = map.columnMaps || {};
    // check unique!
    if (map.columnMaps[objProperty]) throw new e.ColumnMapDuplicateError(objProperty);

    map.columnMaps[objProperty] = tableProperty;
    // for queries
    map[objProperty] = {
        columnName: tableProperty,
        Equal: EqualFunc,
        And: AndFunc
    };

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
    }
}
createSession.prototype.query = createQuery;

// sugar
createQuery.prototype.where = function(where) {

    var self = this;
    return selectFunc.call(self, where);
}

function selectFunc(where) {

    var config = this;
    var sql = queryBuild(config.tableMap);
    if (where) sql += ' where ' + where.whereCondition;

    return executeQueryPromise(config.session, sql);
}

createQuery.prototype.select = selectFunc;

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
    sqlQuery += ' from `' + tblMap.table + '`';

    return sqlQuery;
}

function executeQueryPromise(session, sqlQuery) {

    return new RSVP.Promise(function(resolve, reject) {
        var connection = mysql.createConnection(session.dbConfig);

        connection.query(sqlQuery, function(err, rows) {
            // connected! (unless `err` is set)
            if (!err) {
                resolve(rows);
            } else {
                reject(err);
            }
        });

        connection.end();

    });
}

jsORM.session = createSession;
module.exports = jsORM;
