var expect = require("chai").expect;

var jsORM = require('../lib/js-hibernate.js');
var ex = require('../lib/error.js');

var dbconfig, session, userMap;
describe('jsORM', function () {
    // run before every test
    beforeEach(function () {
        dbconfig = {
            host: "db4free.net",
            user: "testdbgithub",
            password: "dfybkffqc5",
            database: "dbgithub"
        };

        session = jsORM.session(dbconfig);

        userMap = session.tableMap('User')
            .columnMap('id', 'id', { isAutoIncrement: true })
            .columnMap('name', 'shortName')
            .columnMap('phone', 'tel');
    })

    it('simple test', function () {
        expect(userMap.columnMaps.id).to.equal('id');
    });

    it('Async test select * from', function (done) {
        var sqlQuery = session.query(userMap).select();
        sqlQuery.then(function (result) {
            // todo: add check
            // because this objects have constructor and equal will be break
            var resultPure = JSON.parse(JSON.stringify(result));
            var usersTest = [
                {
                    'id': 1,
                    'shortName': 'Rinat',
                    'tel': '123-456'
                },
                {
                    'id': 3,
                    'shortName': 'Den',
                    'tel': '234-567'
                }
            ];
            // deep say to use value equal instead of reference equal
            expect(usersTest).to.deep.equal(resultPure);
            done();
        }).catch(function (error) {
            done(error);
        });
    });

    it('Async test select * from where `id` = `1`', function (done) {
        var sqlQuery = session.query(userMap).where(
            userMap.id.Equal(1)
        );
        sqlQuery.then(function (result) {
            // todo: add check
            // because this objects have constructor and equal will be break
            var resultPure = JSON.parse(JSON.stringify(result));
            var usersTest = [
                {
                    'id': 1,
                    'shortName': 'Rinat',
                    'tel': '123-456'
                }
            ];
            // deep say to use value equal instead of reference equal
            expect(usersTest).to.deep.equal(resultPure);
            done();
        }).catch(function (error) {
            done(error);
        });
    });

    it('Async test select * from where `id` = `3` and `shortName` = `Den`', function (done) {
        var sqlQuery = session.query(userMap).where(
            userMap.id.Equal(3)
                .And()
                .name.Equal('Den')
        );
        sqlQuery.then(function (result) {
            // todo: add check
            // because this objects have constructor and equal will be break
            var resultPure = JSON.parse(JSON.stringify(result));
            var usersTest = [
                {
                    'id': 3,
                    'shortName': 'Den',
                    'tel': '234-567'
                }
            ];
            // deep say to use value equal instead of reference equal
            expect(usersTest).to.deep.equal(resultPure);
            done();
        }).catch(function (error) {
            done(error);
        });
    });

    it('Async test select * from where `id` > `0` and `id` < `4`', function (done) {
        var sqlQuery = session.query(userMap).where(
            userMap.id.More(0)
                .And()
                .id.Less(4)
        );
        sqlQuery.then(function (result) {
            // todo: add check
            // because this objects have constructor and equal will be break
            var resultPure = JSON.parse(JSON.stringify(result));
            var usersTest = [
                {
                    'id': 1,
                    'shortName': 'Rinat',
                    'tel': '123-456'
                },
                {
                    'id': 3,
                    'shortName': 'Den',
                    'tel': '234-567'
                }
            ];
            // deep say to use value equal instead of reference equal
            expect(usersTest).to.deep.equal(resultPure);
            done();
        }).catch(function (error) {
            done(error);
        });
    });

    it('Async test select * from where `shortName` = `Rinat` and `id` > `0` and `id` < `4`', function (done) {
        var sqlQuery = session.query(userMap).where(
            userMap.name
                .Equal('Rinat') // =
                .And() // and
                .id.More(0). // >
                And() // and
                .id.LessEqual(4) // <=
        );
        sqlQuery.then(function (result) {
            // todo: add check
            // because this objects have constructor and equal will be break
            var resultPure = JSON.parse(JSON.stringify(result));
            var usersTest = [
                {
                    'id': 1,
                    'shortName': 'Rinat',
                    'tel': '123-456'
                }
            ];
            // deep say to use value equal instead of reference equal
            expect(usersTest).to.deep.equal(resultPure);
            done();
        }).catch(function (error) {
            done(error);
        });
    });

    it('Async test executeSql() select * from', function (done) {
        var sql = 'select * from `User`'
        var sqlQuery = session.executeSql(sql);
        sqlQuery.then(function (result) {
            // todo: add check
            // because this objects have constructor and equal will be break
            var resultPure = JSON.parse(JSON.stringify(result));
            var usersTest = [
                {
                    'id': 1,
                    'shortName': 'Rinat',
                    'tel': '123-456'
                },
                {
                    'id': 3,
                    'shortName': 'Den',
                    'tel': '234-567'
                }
            ];
            // deep say to use value equal instead of reference equal
            expect(usersTest).to.deep.equal(resultPure);
            done();
        }).catch(function (error) {
            done(error);
        });
    });

    it('check throw TableMapDuplicateError', function () {
        // check unique table
        var fn = function () {
            var userMap2 = session.tableMap('User');
        }
        expect(fn).to.throw(ex.TableMapDuplicateError);
    });

    it('check throw ColumnMapDuplicateError', function () {
        var session2 = jsORM.session(dbconfig);
        // check unique table
        var fn = function () {
            var userMapDuplicateColumnsCheck = session2.tableMap('User')
                .columnMap('id', 'id')
                .columnMap('id', 'id');
        }
        expect(fn).to.throw(ex.ColumnMapDuplicateError);
    });

    it('Insert', function (done) {
        var someUser = {
            'name': 'newUser',
            'phone': '555-555'
        };
        userMap.Insert(someUser).then(function (result) {
            var results = {};
            results.insertRowCount = result.affectedRows;

            var sql = 'delete from `User` where `shortName` = \'newUser\''
            var sqlQuery = session.executeSql(sql);
            sqlQuery.then(function (resultDel) {
                results.delRowCount = resultDel.affectedRows;

                expect(results).deep.equal({insertRowCount: 1, delRowCount: 1});
                done();
            }).catch(function (error) {
                done(error);
            });

        }).catch(function (error) {
            done(error);
        });
    });

});