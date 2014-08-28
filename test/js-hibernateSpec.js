var expect = require("chai").expect;
var jsORM = require('../lib/js-hibernate.js');

describe('jsORM', function() {
    it('simple test', function() {

        var dbconfig = {
            host: "db4free.net",
            user: "testdbgithub",
            password: "dfybkffqc5",
            database: "dbgithub"
        };

        var session = jsORM.session(dbconfig);
        var userMap = session.tableMap('User')
            .columnMap('id', 'id')
            .columnMap('name', 'shortName')
            .columnMap('phone', 'tel');

        console.log(JSON.stringify(userMap.columnMaps));
        expect(userMap.columnMaps.id).to.equal('id');
    });
});
