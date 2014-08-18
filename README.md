# JS-Hibernate

JSHibernate is a mature, open source object-relational mapper for the JS.

*There works only with MySQL. Plans to work with Oracle and MS SQL*

Methods **select()** and **where()** return Promises/A+.
Support operators:
- **Equal**: = sql operator
- **More**: > sql operator
- **Less**: < sql operator
- **MoreEqual**: >= sql operator
- **LessEqual**: <= sql operator

Support conditions:
- **And**: and sql condition
- **Or**: or sql condition

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
    .columnMap('id', 'id')
    .columnMap('name', 'shortName')
    .columnMap('phone', 'tel');
```

#### 4. Simple request - select all rows
```javascript
var sqlQuery = session.query(userMap).select();
sqlQuery.then(function(result){
    console.log(result);
}).catch(function(error){
    console.log('Error: ' + error);
});
```

#### 5. Sample work with several operators and boolean operators
```javascript
var sqlQuery = session.query(userMap)
    .where(
        userMap.name.Equal('Rinat') // =
        .And() // and
        .id.More(0). // >
        And() // and
        .id.LessEqual(4) // <=
    );
    
sqlQuery.then(function(result) {
    console.log(result);
}).catch(function(error) {
    console.log('Error: ' + error);
});
```