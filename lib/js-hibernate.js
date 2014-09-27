'use strict';

var mysql = require('mysql');
var string = require('string-formatter');
var RSVP = require('rsvp');

var e = require('./error.js');

var jsORM = {};

function Session(dbconfig) {
    var self = this instanceof Session ? this : Object.create(Session.prototype);

    self.dbConfig = dbconfig;
    self.mappings = {};
    return self;
}

function TableMap(tableName) {
    if (this instanceof Session) {
        var session = this;

        var map = Object.create(TableMap.prototype);
        map.table = tableName;
        map.Session = session;
        // check unique!
        if (session.mappings[tableName]) {
            throw new e.TableMapDuplicateError(tableName);
        }
        session.mappings[tableName] = map;

        return map;
    }

    return 'undefined';
}

function OperatorFunc(value, operator) {
    var self = this; // columnMap

    var where = '`' + self.columnName + '` ' + operator + ' \'{0}\'';
    self.TableMapLink.Query.whereCondition += string.format(where, value);

    return self.TableMapLink;
}

function ConditionFunc(condition) {
    var self = this; // tableMap

    if (self.Query.whereCondition) {
        self.Query.whereCondition += ' ' + condition + ' ';
    }

    return self;
}

function isNeedAddInQuery(mappings, columnObjName, entity) {
    return typeof entity[columnObjName] !== 'undefined' && !mappings[columnObjName].IsAutoIncrement;
}

TableMap.prototype.Insert = function (entity) {
    var self = this;
    // need generate insert str
    var insertSql = 'insert into `' + self.table + '`';
    var colsDefs = ' (';
    var values = ' values (';

    var cols = self.columnMaps;
    for (var prop in cols) {
        if (self.hasOwnProperty(prop)) {
            if (isNeedAddInQuery(self, prop, entity)) {
                colsDefs += '`' + cols[prop] + '`, '; // column name
                values += '\'{' + prop + '}\', '; // here will be column value
            }
        }
    }
    // delete last end
    var lastAndIndex = colsDefs.lastIndexOf(',');
    colsDefs = colsDefs.substring(0, lastAndIndex);
    // delete last end
    lastAndIndex = values.lastIndexOf(',');
    values = values.substring(0, lastAndIndex);

    colsDefs += ')';
    values += ')';

    insertSql += colsDefs;
    insertSql += string.format(values, entity);

    return self.Session.executeSql(insertSql); // mistake here will be session
};

// config - metadata about column
TableMap.prototype.columnMap = function (objProperty, tableProperty, config) {
    var map = this; // tableMap
    var isAutoIncrement;

    map.columnMaps = map.columnMaps || {};
    // check unique!
    if (map.columnMaps[objProperty]) {
        throw new e.ColumnMapDuplicateError(objProperty);
    }

    map.columnMaps[objProperty] = tableProperty;
    if (config) {
        isAutoIncrement = config.isAutoIncrement || false;
    } else {
        isAutoIncrement = false;
    }
    // for queries
    map[objProperty] = {
        TableMapLink: map, // link on tableMap
        columnName: tableProperty,
        IsAutoIncrement: isAutoIncrement,
        Equal: function (value) {
            return OperatorFunc.call(map[objProperty], value, '=');
        },
        More: function (value) {
            return OperatorFunc.call(map[objProperty], value, '>');
        },
        Less: function (value) {
            return OperatorFunc.call(map[objProperty], value, '<');
        },
        MoreEqual: function (value) {
            return OperatorFunc.call(map[objProperty], value, '>=');
        },
        LessEqual: function (value) {
            return OperatorFunc.call(map[objProperty], value, '<=');
        },
        Like: function (value) {
            return OperatorFunc.call(map[objProperty], value, 'like');
        }
    };

    return this;
};

Session.prototype.tableMap = TableMap;

function Query(tblMap) {
    // check instance 
    var self = this; // session

    if (self instanceof Session && tblMap instanceof TableMap) {
        var query = Object.create(Query.prototype);
        query.session = self;
        query.whereCondition = ''; // store where condition for current query

        query.tableMap = tblMap;
        // link on current query
        query.tableMap.Query = query;
        query.tableMap.And = function () {
            return ConditionFunc.call(query.tableMap, 'and');
        };
        query.tableMap.Or = function () {
            return ConditionFunc.call(query.tableMap, 'or');
        };

        return query;
    }
}
Session.prototype.query = Query;

function queryBuild(tblMap) {
    // generate sql
    var sqlQuery = 'select ';
    var map = tblMap.columnMaps;

    for (var prop in map) {
        if (map.hasOwnProperty(prop)) {
            sqlQuery += '`{' + prop + '}`, ';
        }
    }
    // remove last comma
    var lastComma = sqlQuery.lastIndexOf(',');
    sqlQuery = sqlQuery.substring(0, lastComma);

    sqlQuery = string.format(sqlQuery, map);
    sqlQuery += ' from `' + tblMap.table + '`';

    return sqlQuery;
}

function executeQueryPromise(session, sqlQuery) {

    return new RSVP.Promise(function (resolve, reject) {
        var connection = mysql.createConnection(session.dbConfig);

        connection.query(sqlQuery, function (err, rows) {
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

function selectFunc(where) {

    var config = this; // query
    var sql = queryBuild(config.tableMap);
    if (where) {
        sql += ' where ' + where.Query.whereCondition;
    }

    return executeQueryPromise(config.session, sql);
}

// sugar
Query.prototype.where = function (where) {

    var self = this; // query
    return selectFunc.call(self, where);
};

Query.prototype.select = selectFunc;

// execution of arbitrary sql query
Session.prototype.executeSql = function (sql) {
    return executeQueryPromise(this, sql);
};

jsORM.session = Session;
module.exports = jsORM;
