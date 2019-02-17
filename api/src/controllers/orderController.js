import order from '../models/order';

class ordersController {
  getAllOrders(req, res) {
    return res.status(200).send({
      success: true,
      message: 'orders retrieved successfully',
      meals: order
    });
  }
  getOrder(req, res) {
    const id = parseInt(req.params.id, 10);
    db.map(meal => {
      if (meal.id === id) {
        return res.status(200).send({});
      }
    });

    // check for invalid meal id and return false
    return res.status(404).send({
      success: 'false',
      message: 'meal does not exist'
    });
  }

  createOrder(req, res) {
    const { orderItem, day } = req.body;
    let found = false;
    let order;
    menu.map(meal => {
      if (orderItem == meal.name && day == meal.day) {
        found = true;
        order = meal;
      }
    });
    if (found) {
      return res.status(200).send({
        success: true,
        message: 'order  sucessfully placed',
        meals: order
      });
    }
    return res.status(404).send({
      success: false,
      message: "Sorry, we do not have this meal in today's menu"
    });
  }
}

// create an instance of the class and export it
const orderController = new ordersController();
export default orderController;
