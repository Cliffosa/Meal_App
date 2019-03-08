"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _user = _interopRequireDefault(require("../models/user"));

var _jwt = _interopRequireDefault(require("../util/jwt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var UsersController =
/*#__PURE__*/
function () {
  function UsersController() {
    _classCallCheck(this, UsersController);
  }

  _createClass(UsersController, [{
    key: "registerUser",
    value: function () {
      var _registerUser = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(req, res) {
        var _req$body, name, email, phone, password, existUser, hash, user, ordinaryUser, ONE_WEEK, jwtTokenkey;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _req$body = req.body, name = _req$body.name, email = _req$body.email, phone = _req$body.phone, password = _req$body.password;
                _context.next = 4;
                return _user.default.findOne({
                  where: {
                    email: email
                  }
                });

              case 4:
                existUser = _context.sent;

                if (!existUser) {
                  _context.next = 7;
                  break;
                }

                throw new Error('User with that email Already exist');

              case 7:
                _context.next = 9;
                return _bcrypt.default.hash(password, 8);

              case 9:
                hash = _context.sent;
                _context.next = 12;
                return _user.default.create({
                  name: name,
                  email: email,
                  phone: phone,
                  password: hash
                });

              case 12:
                user = _context.sent;
                //declare user without password
                ordinaryUser = {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  phone: user.phone
                }; //create token and its expiration

                ONE_WEEK = 60 * 60 * 24 * 7;
                _context.next = 17;
                return _jsonwebtoken.default.sign({
                  user: ordinaryUser
                }, _jwt.default, {
                  expiresIn: ONE_WEEK
                });

              case 17:
                jwtTokenkey = _context.sent;
                return _context.abrupt("return", res.status(201).json({
                  status: 'success',
                  message: 'User Registered Successfully',
                  token: "Bearer ".concat(jwtTokenkey),
                  user: ordinaryUser
                }));

              case 21:
                _context.prev = 21;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", res.status(500).json({
                  status: 'error',
                  message: _context.t0.message
                }));

              case 24:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 21]]);
      }));

      function registerUser(_x, _x2) {
        return _registerUser.apply(this, arguments);
      }

      return registerUser;
    }()
  }, {
    key: "loginUser",
    value: function () {
      var _loginUser = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(req, res) {
        var _req$body2, email, password, user, result, ordinaryUser, ONE_WEEK, jwtTokenkey;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
                _context2.next = 4;
                return _user.default.findOne({
                  where: {
                    email: email
                  }
                });

              case 4:
                user = _context2.sent;

                if (user) {
                  _context2.next = 7;
                  break;
                }

                throw new Error('User with that email does not exist');

              case 7:
                _context2.next = 9;
                return _bcrypt.default.compare(password, user.password);

              case 9:
                result = _context2.sent;

                if (result) {
                  _context2.next = 12;
                  break;
                }

                throw new Error('login information does not match our records');

              case 12:
                ordinaryUser = {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  phone: user.phone
                }; //create token and its expiration

                ONE_WEEK = 60 * 60 * 24 * 7;
                _context2.next = 16;
                return _jsonwebtoken.default.sign({
                  user: ordinaryUser
                }, _jwt.default, {
                  expiresIn: ONE_WEEK
                });

              case 16:
                jwtTokenkey = _context2.sent;
                return _context2.abrupt("return", res.status(200).json({
                  status: 'success',
                  message: 'Login Successfully',
                  token: "Bearer ".concat(jwtTokenkey),
                  user: ordinaryUser
                }));

              case 20:
                _context2.prev = 20;
                _context2.t0 = _context2["catch"](0);
                return _context2.abrupt("return", res.status(500).json({
                  status: 'error',
                  message: _context2.t0.message
                }));

              case 23:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 20]]);
      }));

      function loginUser(_x3, _x4) {
        return _loginUser.apply(this, arguments);
      }

      return loginUser;
    }()
  }]);

  return UsersController;
}();

var UserController = new UsersController();
var _default = UserController;
exports.default = _default;
//# sourceMappingURL=userController.js.map