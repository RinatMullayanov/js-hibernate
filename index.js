var jsORM = {};

jsORM.TableMap = function (tableName) {
    this.tableName = tableName;
    return this;
}

jsORM.TableMap.prototype.ColumnMap = function(objProperty, tableProperty) {
	this.columnsMap = this.columnsMap || [];
	this.columnsMap[objProperty] = tableProperty;

	return this;
};

module.exports = jsORM;