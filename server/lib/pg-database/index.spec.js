'use strict';

const PgDatabase = require('./');

describe('PgDatabase', function() {

  beforeEach(function*() {
    this.pgdb = PgDatabase.create();
  });

  describe('escapeValue', function() {
    it('should escape a number value properly', function() {
      expect(this.pgdb.escapeValue(1)).to.be.eql('1');
    });

    it('should escape a boolean value properly', function() {
      expect(this.pgdb.escapeValue(true)).to.be.eql('TRUE');
    });

    it('should escape a null value properly', function() {
      expect(this.pgdb.escapeValue(null)).to.be.eql('NULL');
    });

    it('should escape a basic string value properly', function() {
      expect(this.pgdb.escapeValue('foo')).to.be.eql('\'foo\'');
    });

    it('should escape a string with special characters properly', function() {
      expect(this.pgdb.escapeValue('foo\'bar\\example')).to.be.eql('E\'foo\'\'bar\\\\example\'');
    });

  });

  describe('_buildUpsert', function() {
    it('should build a basic query', function() {
      const tableName = 'example_table';
      const uniqueColumns = ['id'];
      const data = { id: 1, foo: 'bar' };

      const query = this.pgdb._buildUpsert(tableName, uniqueColumns, data);
      const expectedQuery = 'INSERT INTO example_table (id, foo) VALUES (1, \'bar\') ' +
        'ON CONFLICT (id) DO UPDATE SET foo=\'bar\';';

      expect(query).to.be.eql(expectedQuery);
    });

    it('should build a basic query with undefined and NULL', function() {
      const tableName = 'example_table';
      const uniqueColumns = ['id'];
      const data = { id: 1, foo: undefined, bar: null };

      const query = this.pgdb._buildUpsert(tableName, uniqueColumns, data);
      const expectedQuery = 'INSERT INTO example_table (id, bar) VALUES (1, NULL) ' +
        'ON CONFLICT (id) DO UPDATE SET bar=NULL;';

      expect(query).to.be.eql(expectedQuery);
    });
  });

  describe('_buildCreateTable', function() {
    it('should build a basic create table query with unique index', function() {
      const tableName = 'example_table';
      const model = {
        id: { type: 'INTEGER', unique: true },
        foo: { type: 'STRING' }
      };

      const query = this.pgdb._buildCreateTable(tableName, model);
      const expectedQuery = 'CREATE TABLE IF NOT EXISTS example_table (id INTEGER UNIQUE, foo STRING);';

      expect(query).to.be.eql(expectedQuery);
    });

    it('should build a basic create table query with primary key', function() {
      const tableName = 'example_table';
      const model = {
        id: { type: 'INTEGER', primary: true },
        foo: { type: 'STRING' }
      };

      const query = this.pgdb._buildCreateTable(tableName, model);
      const expectedQuery = 'CREATE TABLE IF NOT EXISTS example_table (id INTEGER PRIMARY KEY, foo STRING);';

      expect(query).to.be.eql(expectedQuery);
    });
  });

});
