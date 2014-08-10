function TableMap(tableName) {
    this.tableName = tableName;
    return this;
}

TableMap.prototype.ColumnMap = function(objProperty, tableProperty) {
	this.columnsMap = this.columnsMap || [];
	this.columnsMap[objProperty] = tableProperty;

	return this;
};
