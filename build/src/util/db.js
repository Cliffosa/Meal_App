"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _dotenv = require("dotenv");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _dotenv.config)();
var _process$env = process.env,
    DB_NAME = _process$env.DB_NAME,
    DB_HOST = _process$env.DB_HOST,
    DB_PASSWORD = _process$env.DB_PASSWORD,
    DB_PORT = _process$env.DB_PORT,
    DB_USER = _process$env.DB_USER;
var sequelize = new _sequelize.default(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: 'postgres',
  port: DB_PORT,
  host: DB_HOST,
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
var _default = sequelize;
exports.default = _default;
//# sourceMappingURL=db.js.map