js-hibernate
============

JSHibernate is a mature, open source object-relational mapper for the JS.

Using Promises/A+.

    var dbconfig = {
        host: "your-mysql-host",
        user: "your-mysql-user",
        password: "your-mysql-password",
        database: "your-mysql-db"
    };

    var jsORM = require('js-hibernate');

    var session = jsORM.session(dbconfig);

    var userMap = session.tableMap('User')
        .columnMap('id', 'id')
        .columnMap('name', 'shortName')
        .columnMap('phone', 'tel');

    var sqlQuery = session.query(userMap).select();
    sqlQuery.then(function(result){
        console.log('from promise:');
        console.log(result);
    }).catch(function(error){
        console.log('Error: ' + error);
    });

    var sqlQuery = session.query(userMap).select();
    sqlQuery.then(function(result) {
        console.log('from promise:');
        console.log(result);
    }).catch(function(error) {
        console.log('Error: ' + error);
    });

    var sqlQuery2 = session.query(userMap)
        .where(
            userMap.id.Equal(1)
        );
    
    sqlQuery2.then(function(result) {
        console.log('from promise where Equal test:');
        console.log(result);
    }).catch(function(error) {
        console.log('Error: ' + error);
    });

    var sqlQuery3 = session.query(userMap)
        .where(
            userMap.id.Equal(3)
            .And()
            .name.Equal('Den')
    );

    sqlQuery3.then(function(result) {
        console.log('from promise where Equal And Equal test:');
        console.log(result);
    }).catch(function(error) {
        console.log('Error: ' + error);
    });
