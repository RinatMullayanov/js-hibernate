var ex = require('../error.js');

var dbconfig = {
    host: "db4free.net",
    user: "testdbgithub",
    password: "dfybkffqc5",
    database: "dbgithub"
};

var jsORM = require('../index.js');

var session = jsORM.session(dbconfig);

var userMap = session.tableMap('User')
    .columnMap('id', 'id')
    .columnMap('name', 'shortName')
    .columnMap('phone', 'tel');

var sqlQuery = session.query(userMap).select();
sqlQuery.then(function(result) {
    console.log('test select:');
    console.log(result);
}).catch(function(error) {
    console.log('Error: ' + error);
});

var sqlQuery2 = session.query(userMap)
    .where(
        userMap.id.Equal(1)
    );
    
sqlQuery2.then(function(result) {
    console.log('test where = :');
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
    console.log('test where = and = :');
    console.log(result);
}).catch(function(error) {
    console.log('Error: ' + error);
});

var sqlQuery4 = session.query(userMap)
    .where(
        userMap.id.More(0)
        .And()
        .id.Less(4)
    );

sqlQuery4.then(function(result) {
    console.log('test where > and < :');
    console.log(result);
}).catch(function(error) {
    console.log('Error: ' + error);
});

var sqlQuery5 = session.query(userMap)
    .where(
        userMap.name.Equal('Rinat') // =
        .And() // and
        .id.More(0). // >
        And() // and
        .id.LessEqual(4) // <=
    );
    
sqlQuery5.then(function(result) {
    console.log('test where = and > and <= :');
    console.log(result);
}).catch(function(error) {
    console.log('Error: ' + error);
});

// check unique table
try {
    var userMap2 = session.tableMap('User');
} catch (e) {
    if (e instanceof ex.TableMapDuplicateError) {
        console.log('table map duplicate');
    }
}

// check unique table
try {
    var session2 = jsORM.session(dbconfig);

    var userMapDuplicateColumnsCheck = session2.tableMap('User')
        .columnMap('id', 'id')
        .columnMap('id', 'id');
} catch (e) {
    if (e instanceof ex.ColumnMapDuplicateError) {
        console.log('column map duplicate');
    }
}
