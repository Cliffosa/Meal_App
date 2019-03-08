"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AdminMiddlewares =
/*#__PURE__*/
function () {
  function AdminMiddlewares() {
    _classCallCheck(this, AdminMiddlewares);
  }

  _createClass(AdminMiddlewares, [{
    key: "validateRegister",
    value: function () {
      var _validateRegister = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(req, res, next) {
        var schema;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                schema = {
                  name: _joi.default.string().required(),
                  email: _joi.default.string().email().required(),
                  phone: _joi.default.number().min(11).required(),
                  password: _joi.default.string().regex(new RegExp('^[a-zA-Z0-9]{8,32}$')).required()
                };
                _context.next = 4;
                return _joi.default.validate(req.body, schema);

              case 4:
                next();
                return _context.abrupt("return", true);

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", res.status(400).json({
                  status: false,
                  message: String(_context.t0.details[0].message),
                  type: 'validation'
                }));

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 8]]);
      }));

      function validateRegister(_x, _x2, _x3) {
        return _validateRegister.apply(this, arguments);
      }

      return validateRegister;
    }()
  }, {
    key: "validateLogin",
    value: function () {
      var _validateLogin = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(req, res, next) {
        var schema, _ref, error;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                schema = {
                  email: _joi.default.string().email().required(),
                  password: _joi.default.string().regex(new RegExp('^[a-zA-Z0-9]{8,32}$')).required()
                };
                _context2.next = 4;
                return _joi.default.validate(req.body, schema);

              case 4:
                _ref = _context2.sent;
                error = _ref.error;

                if (!error) {
                  _context2.next = 17;
                  break;
                }

                _context2.t0 = error.details[0].context.key;
                _context2.next = _context2.t0 === 'email' ? 10 : _context2.t0 === 'password' ? 12 : 14;
                break;

              case 10:
                res.status(400).send({
                  error: 'You must provide a valid email address'
                });
                return _context2.abrupt("break", 15);

              case 12:
                res.status(400).send({
                  error: "The password provided failed to match the following rules:\n              <br>\n              1. It must contain ONLY the following characters: lower case, upper case, numerics.\n              <br>\n              2. It must be at least 8 characters in length and not greater than 32 characters in length.\n            "
                });
                return _context2.abrupt("break", 15);

              case 14:
                res.status(400).send({
                  error: 'Invalid Login information'
                });

              case 15:
                _context2.next = 19;
                break;

              case 17:
                next();
                return _context2.abrupt("return", true);

              case 19:
                _context2.next = 24;
                break;

              case 21:
                _context2.prev = 21;
                _context2.t1 = _context2["catch"](0);
                return _context2.abrupt("return", res.status(400).json({
                  status: 'error',
                  message: String(_context2.t1.details[0].message),
                  type: 'validation'
                }));

              case 24:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 21]]);
      }));

      function validateLogin(_x4, _x5, _x6) {
        return _validateLogin.apply(this, arguments);
      }

      return validateLogin;
    }()
  }]);

  return AdminMiddlewares;
}();

var AdminMiddleware = new AdminMiddlewares();
var _default = AdminMiddleware;
exports.default = _default;
//# sourceMappingURL=adminMiddleware.js.map