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

        userMap = session.tableMap('User')
            .columnMap('id', 'id')
            .columnMap('name', 'shortName')
            .columnMap('phone', 'tel');
    })

    it('simple test', function() {
        expect(userMap.columnMaps.id).to.equal('id');
    });

    it('Async test select * from', function(done) {
        var sqlQuery = session.query(userMap).select();
        sqlQuery.then(function(result) {
            // todo: add check
            done();
        }).catch(function(error) {
            done(error);
        });
    });
});