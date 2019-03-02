"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _meals = _interopRequireDefault(require("../models/meals"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var mealsController =
/*#__PURE__*/
function () {
  function mealsController() {
    _classCallCheck(this, mealsController);
  }

  _createClass(mealsController, [{
    key: "getAllMeals",
    // method to get all meals
    value: function getAllMeals(req, res) {
      return res.status(200).send({
        success: true,
        message: 'meals retrieved successfully',
        meals: _meals.default
      });
    } // get a single meal

  }, {
    key: "getMeal",
    value: function getMeal(req, res) {
      var found = false;
      var id = parseInt(req.params.id, 10);

      _meals.default.map(function (meal) {
        if (meal.id === id) {
          found = true;
          return res.status(200).send({
            success: true,
            message: 'meal retrieved successfully',
            meal: meal
          });
        }
      });

      if (!found) {
        return res.status(404).send({
          success: false,
          message: 'meal does not exist'
        });
      } // check for invalid meal id and return false

    } // create a meal

  }, {
    key: "createMeal",
    value: function createMeal(req, res) {
      // validate body
      if (!req.body.name) {
        return res.status(400).send({
          success: false,
          message: 'name is required'
        });
      } else if (!req.body.quantity) {
        return res.status(400).send({
          success: false,
          message: 'quantity is required'
        });
      } else if (!req.body.price) {
        return res.status(400).send({
          success: false,
          message: 'price is required'
        });
      }

      var meal = {
        id: _meals.default.length + 1,
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price
      };

      _meals.default.push(meal);

      return res.status(201).send({
        success: true,
        message: 'meal added successfully',
        meal: meal
      });
    } // update a meal

  }, {
    key: "updateMeal",
    value: function updateMeal(req, res) {
      var id = parseInt(req.params.id, 10);
      var mealFound;
      var itemIndex;

      _meals.default.map(function (meal, index) {
        if (meal.id === id) {
          mealFound = meal;
          itemIndex = index;
        }
      });

      if (!mealFound) {
        return res.status(404).send({
          success: false,
          message: 'meal not found'
        });
      } // validate body


      if (!req.body.name) {
        return res.status(400).send({
          success: false,
          message: 'name is required'
        });
      } else if (!req.body.quantity) {
        return res.status(400).send({
          success: false,
          message: 'quantity is required'
        });
      } else if (!req.body.price) {
        return res.status(400).send({
          success: 'false',
          message: 'price is required'
        });
      }

      var newMeal = {
        id: mealFound.id,
        name: req.body.name || mealFound.name,
        quantity: req.body.quantity || mealFound.quantity,
        price: req.body.price || mealFound.price
      };

      _meals.default.splice(itemIndex, 1, newMeal);

      return res.status(201).send({
        success: true,
        message: 'meal updated successfully',
        newMeal: newMeal
      });
    } // delete a meal

  }, {
    key: "deleteMeal",
    value: function deleteMeal(req, res) {
      var id = parseInt(req.params.id, 10);
      var mealFound;
      var itemIndex;

      _meals.default.map(function (meal, index) {
        if (meal.id === id) {
          mealFound = meal;
          itemIndex = index;
        }
      });

      if (!mealFound) {
        return res.status(404).send({
          success: false,
          message: 'meal not found'
        });
      }

      _meals.default.splice(itemIndex, 1);

      return res.status(200).send({
        success: true,
        message: 'meal deleted successfuly'
      });
    }
  }]);

  return mealsController;
}(); // create an instance of the class and export it


var mealController = new mealsController();
var _default = mealController;
exports.default = _default;
//# sourceMappingURL=mealController.js.map