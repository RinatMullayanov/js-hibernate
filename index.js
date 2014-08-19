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

function createTableMap(tableName) {
    if (this instanceof Session) {
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

function OperatorFunc(value, operator) {
    var self = this; // columnMap

    var where = "`" + self.columnName + "` " + operator + " '{0}'";
    self.TableMapLink.Query.whereCondition += string.format(where, value);

    return self.TableMapLink;
}

function ConditionFunc(value, condition) {
    var self = this; // tableMap

    if (self.Query.whereCondition) self.Query.whereCondition += ' ' + condition + ' ';

    return self;
}

createTableMap.prototype.columnMap = function(objProperty, tableProperty) {
    var map = this; // tableMap

    map.columnMaps = map.columnMaps || {};
    // check unique!
    if (map.columnMaps[objProperty]) throw new e.ColumnMapDuplicateError(objProperty);

    map.columnMaps[objProperty] = tableProperty;
    // for queries
    map[objProperty] = {
        TableMapLink: map, // link on tableMap
        columnName: tableProperty,
        Equal: function(value) {
            return OperatorFunc.call(map[objProperty], value, '=');
        },
        More: function(value) {
            return OperatorFunc.call(map[objProperty], value, '>');
        },
        Less: function(value) {
            return OperatorFunc.call(map[objProperty], value, '<');
        },
        MoreEqual: function(value) {
            return OperatorFunc.call(map[objProperty], value, '>=');
        },
        LessEqual: function(value) {
            return OperatorFunc.call(map[objProperty], value, '<=');
        },
        Like: function(value) {
            return OperatorFunc.call(map[objProperty], value, 'like');
        }
    };

    return this;
};
Session.prototype.tableMap = createTableMap;

function createQuery(tblMap) {
    // check instance 
    var self = this; // session

    if (self instanceof Session && tblMap instanceof createTableMap) {
        var query = Object.create(createQuery.prototype);
        query.session = self;
        query.whereCondition = ""; // store where condition for current query

        query.tableMap = tblMap;
        // link on current query
        query.tableMap.Query = query;
        query.tableMap.And = function(value) {
            return ConditionFunc.call(query.tableMap, value, 'and');
        };
        query.tableMap.Or = function(value) {
            return ConditionFunc.call(query.tableMap, value, 'or');
        };

        return query;
    }
}
Session.prototype.query = createQuery;

// sugar
createQuery.prototype.where = function(where) {

    var self = this; // query
    return selectFunc.call(self, where);
}

function selectFunc(where) {

    var config = this; // query
    var sql = queryBuild(config.tableMap);
    if (where) sql += ' where ' + where.Query.whereCondition;

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

jsORM.session = Session;
module.exports = jsORM;
