'use strict';

const config = require('../../config');
const pgp = require('pg-promise')();
const escape = require('pg-escape');
const PG_ERRORCODE_KEY_ALREADY_EXISTS = '23505';

let permanentConnection;

class PgDatabase {

  constructor() {
    if (!permanentConnection) {
      permanentConnection = pgp(config.databaseUrl);
    }
    this.db = permanentConnection;
  }

  any(query, values) {
    return this.db.any(query, values);
  }

  none(query, values) {
    return this.db.none(query, values);
  }

  one(query, values) {
    return this.db.one(query, values);
  }

  upsert(tableName, uniqueColumns, data) {
    return this.none(this._buildUpsert(tableName, uniqueColumns, data));
  }

  dropTable(tableName) {
    return this.none(`DROP TABLE IF EXISTS ${tableName};`);
  }

  *createTable(tableName, model) {
    try {
      yield this.none(this._buildCreateTable(tableName, model));
    } catch (error) {
      // CREATE TABLE IF NOT EXISTS sometimes will throw an error
      // PG_ERRORCODE_KEY_ALREADY_EXISTS, it is OK to ignore that
      // http://postgresql.nabble.com/Errors-on-CREATE-TABLE-IF-NOT-EXISTS-td5659080.html
      if (error.code !== PG_ERRORCODE_KEY_ALREADY_EXISTS) {
        throw error;
      }
    }
  }

  querySchema(tableName) {
    const escapedTableName = this.escapeValue(tableName);
    return this.any(
      'SELECT column_name, data_type FROM INFORMATION_SCHEMA.COLUMNS ' +
      `WHERE table_name = ${escapedTableName};`
    );
  }

  escapeValue(value) {
    if (typeof value === 'number') {
      return String(value);
    }
    if (typeof value === 'boolean') {
      return value ? 'TRUE' : 'FALSE';
    }
    return escape.literal(value);
  }

  _buildUpsert(tableName, uniqueColumns, data) {
    const columns = Object.keys(data).filter(
      column => uniqueColumns.indexOf(column) === -1 &&
      typeof data[column] !== 'undefined'
    );
    const columnNames = columns.join(', ');
    const uniqueColumnNames = uniqueColumns.join(', ');
    const values = columns.map(column => this.escapeValue(data[column])).join(', ');
    const sets = columns.map(column => column + '=' + this.escapeValue(data[column])).join(', ');

    return `INSERT INTO ${tableName} (${uniqueColumnNames}, ${columnNames}) VALUES (${data.id}, ${values}) ` +
      `ON CONFLICT (${uniqueColumnNames}) DO UPDATE SET ${sets};`;
  }

  _buildCreateTable(tableName, model) {
    const columnDefinitions = Object.keys(model).map(column => {
      const definition = model[column];
      const type = definition.type;
      const index = (definition.unique ? ' UNIQUE' : '') + (definition.primary ? ' PRIMARY KEY' : '');
      return `${column} ${type}${index}`;
    }).join(', ');

    return `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions});`;
  }

  static create() {
    return new PgDatabase();
  }

}

module.exports = PgDatabase;
