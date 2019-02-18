import orders from '../models/orders';
import menu from '../models/menu';

class ordersController {
  getAllOrders(req, res) {
    return res.status(200).send({
      success: true,
      message: 'orders retrieved successfully',
      meals: orders
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

  // get a single order
  getOrder(req, res) {
    let found = false;
    const id = parseInt(req.params.id, 10);
    orders.map(order => {
      if (order.id === id) {
        found = true;
        return res.status(200).send({
          success: true,
          message: 'order retrieved successfully',
          order
        });
      }
    });
    if (!found) {
      return res.status(404).send({
        success: false,
        message: 'meal does not exist'
      });
    }
    // check for invalid meal id and return false
  }
}

// create an instance of the class and export it
const orderController = new ordersController();
export default orderController;
