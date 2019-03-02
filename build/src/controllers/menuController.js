"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _menu = _interopRequireDefault(require("../models/menu"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var menuControllers =
/*#__PURE__*/
function () {
  function menuControllers() {
    _classCallCheck(this, menuControllers);
  }

  _createClass(menuControllers, [{
    key: "getTodayMenu",
    // method to get all menu
    value: function getTodayMenu(req, res) {
      var day = req.params.day;
      var todayMenu = [];
      var found = false;

      _menu.default.map(function (meal) {
        if (meal.day === day) {
          todayMenu.push(meal);
          found = true;
        }
      });

      if (found) {
        return res.status(200).send({
          success: true,
          message: 'menu for the day retrieved successfully',
          meals: todayMenu
        });
      }

      return res.status(404).send({
        success: false,
        message: 'Sorry, no menu for today'
      });
    } // create a menu for a specific day

  }, {
    key: "createMenu",
    value: function createMenu(req, res) {
      // validate body
      if (!req.body.name) {
        return res.status(400).send({
          success: false,
          message: 'name is required'
        });
      } else if (!req.body.day) {
        return res.status(400).send({
          success: false,
          message: 'day is required'
        });
      }

      var allMenu = {
        id: _menu.default.length + 1,
        name: req.body.name,
        day: req.body.day
      };

      _menu.default.push(allMenu);

      return res.status(201).send({
        success: true,
        message: "menu added to today's menu successfully",
        menu: _menu.default
      });
    }
  }]);

  return menuControllers;
}(); // create an instance of the class and export it


var menuController = new menuControllers();
var _default = menuController;
exports.default = _default;
//# sourceMappingURL=menuController.js.map