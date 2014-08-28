var expect = require("chai").expect;
var jsORM = require('../lib/js-hibernate.js');

var dbconfig, session;
describe('jsORM', function() {
    // run before every test
    beforeEach(function() {
        dbconfig = {
            host: "db4free.net",
            user: "testdbgithub",
            password: "dfybkffqc5",
            database: "dbgithub"
        };

        session = jsORM.session(dbconfig);
    })

    it('simple test', function() {

        var userMap = session.tableMap('User')
            .columnMap('id', 'id')
            .columnMap('name', 'shortName')
            .columnMap('phone', 'tel');

        console.log(JSON.stringify(userMap.columnMaps));
        expect(userMap.columnMaps.id).to.equal('id');
    });
});
