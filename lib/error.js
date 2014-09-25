'use strict';
var util = require('util');

function ColumnMapDuplicateError(col){
	this.message = 'Duplicate column map: ' + col;
}
util.inherits(ColumnMapDuplicateError, Error);
ColumnMapDuplicateError.prototype.name = 'ColumnMapDuplicateError';

function TableMapDuplicateError(table){
	this.message = 'Duplicate table map: ' + table;
}
util.inherits(TableMapDuplicateError, Error);
TableMapDuplicateError.prototype.name = 'TableMapDuplicateError';

exports.ColumnMapDuplicateError = ColumnMapDuplicateError;
exports.TableMapDuplicateError = TableMapDuplicateError;