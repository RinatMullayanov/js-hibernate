describe('create sql query', function() {
    // var dbconfig, session;

    // beforeEach(function(done) {
    //     dbconfig = {
    //         host: "db4free.net",
    //         user: "testdbgithub",
    //         password: "dfybkffqc5",
    //         database: "dbgithub"
    //     };

    //     session = createSession(dbconfig);

    // });

    it('sql query equal', function() {

        var dbconfig = {
            host: "db4free.net",
            user: "testdbgithub",
            password: "dfybkffqc5",
            database: "dbgithub"
        };

        var session = createSession(dbconfig);
        // var userMap = session.tableMap('User')
        //     .columnMap('id', 'id')
        //     .columnMap('name', 'shortName')
        //     .columnMap('phone', 'tel');
        //expect(sqlQuery).toBe('select `id`, `shortName`, `tel` from `User`'); 
        var userMap = session.tableMap('User');
        expect(userMap).toBe('la');

        // var sqlQuery = session.query(userMap).select(function(err, result) {
        //     if (err === null) console.log(result);
        //     expect(sqlQuery).toBe('select `id`, `shortName`, `tel` from `User`');
        // });

    });

    // it('result equal', function() {

    //     var userMap = session.tableMap('User')
    //         .columnMap('id', 'id')
    //         .columnMap('name', 'shortName')
    //         .columnMap('phone', 'tel');

    //     var sqlQuery = session.query(userMap).select(function(err, result) {
    //         if (err === null) console.log(result);
    //         var r = [{
    //             id: 1,
    //             shortName: 'Rinat',
    //             tel: '123-456'
    //         }, {
    //             id: 3,
    //             shortName: 'Den',
    //             tel: '234-567'
    //         }]
    //         expect(result).toBe(r);
    //     });

    // });
});
