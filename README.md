js-hibernate
============

JSHibernate is a mature, open source object-relational mapper for the JS.

    var dbconfig = {
        host: "your-mysql-host",
        user: "your-mysql-user",
        password: "your-mysql-password",
        database: "your-mysql-db"
    };

    var jsORM = require('../index.js');

    var session = jsORM.session(dbconfig);

    var userMap = session.tableMap('User')
        .columnMap('id', 'id')
        .columnMap('name', 'shortName')
        .columnMap('phone', 'tel');

    var sqlQuery = session.query(userMap).select(function(err, result) {
        if (err === null) console.log(result);
    });
