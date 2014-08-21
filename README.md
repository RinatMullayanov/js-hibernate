# JS-Hibernate 

### Current version: 1.0.6

JSHibernate is a simple object-relational mapper for the JS.

*There works only with MySQL. Plans to work with Oracle and MS SQL*

Methods **select()** and **where()** return Promises/A+.
Support operators:
- **Equal**: = sql operator
- **More**: > sql operator
- **Less**: < sql operator
- **MoreEqual**: >= sql operator
- **LessEqual**: <= sql operator
- **Like**: like sql operator

Support conditions:
- **And**: and sql condition
- **Or**: or sql condition

-**executeSql**:  execution of arbitrary sql query
### Install

```sh
$ npm install js-hibernate
```

### Usage
#### 1. Config connection to database
```javascript
var dbconfig = {
    host: "your-mysql-host",
    user: "your-mysql-user",
    password: "your-mysql-password",
    database: "your-mysql-db"
    };
```

#### 2. Init session
```javascript
var jsORM = require('js-hibernate');
var session = jsORM.session(dbconfig);
```

#### 3. Create Table Mapping
```javascript
var userMap = session.tableMap('User')
    // columnMap(object-name-property, table-name-property)
    .columnMap('id', 'id') 
    .columnMap('name', 'shortName')
    .columnMap('phone', 'tel');
```

#### 4. Simple request - select all rows
```javascript
// select * from `User` 
var query = session.query(userMap).select();
query.then(function(result){
    console.log(result); // array with result
}).catch(function(error){
    console.log('Error: ' + error);
});
```

#### 5. Sample work with several operators and boolean operators
```javascript
// select * from `User` 
// where `shortName` = 'Rinat' and `id` > '0' and `id` <= 4
var query = session.query(userMap)
    .where(
        userMap.name.Equal('Rinat') // =
        .And() // and
        .id.More(0). // >
        And() // and
        .id.LessEqual(4) // <=
    );
    
query.then(function(result) {
    console.log(result); // array with result
}).catch(function(error) {
    console.log('Error: ' + error);
});
```
#### 6. Execute of arbitrary sql query
```javascript
var sql = 'select * from `User`'
var query = session.executeSql(sql);
    
query.then(function(result) {
    console.log(result); // array with result
}).catch(function(error) {
    console.log('Error: ' + error);
});
```