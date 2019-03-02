import orders from '../models/orders';
class ordersController {
  getAllOrders(req, res) {
    return res.status(200).send({
      success: true,
      message: 'orders retrieved successfully',
      meals: orders
    });
  }
  createOrder(req, res) {
    if (!req.body.name) {
      return res.status(400).send({
        success: false,
        message: 'name is required'
      });
    } else if (!req.body.price) {
      return res.status(400).send({
        success: false,
        message: 'quantity is required'
      });
    } else if (!req.body.quantity) {
      return res.status(400).send({
        success: false,
        message: 'price is required'
      });
    }
    const order = {
      id: orders.length + 1,
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity
    };
    orders.push(order);
    return res.status(200).send({
      success: true,
      message: 'order  sucessfully created.',
      meals: order
    });
  }
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
        message: 'Order does not exist'
      });
    }
  }
  updateOrder(req, res) {
    const id = parseInt(req.params.id, 10);
    let orderFound;
    let itemIndex;
    orders.map((order, index) => {
      if (order.id === id) {
        orderFound = order;
        itemIndex = index;
      }
    });
    if (!orderFound) {
      return res.status(404).send({
        success: false,
        message: 'meal not found'
      });
    }
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
    const newOrder = {
      id: orderFound.id,
      name: req.body.name || orderFound.name,
      quantity: req.body.quantity || orderFound.quantity,
      price: req.body.price || orderFound.price
    };
    orders.splice(itemIndex, 1, newOrder);

    return res.status(201).send({
      success: true,
      message: 'order updated successfully',
      createOrder: {
        data: newOrder
      }
    });
  }
  deleteOrder(req, res) {
    const id = parseInt(req.params.id, 10);
    let orderFound;
    let itemIndex;
    orders.map((order, index) => {
      if (order.id === id) {
        orderFound = order;
        itemIndex = index;
      }
    });
    if (!orderFound) {
      return res.status(404).send({
        success: false,
        message: 'order not found'
      });
    }
    orders.splice(itemIndex, 1);
    return res.status(200).send({
      success: true,
      message: 'order deleted successfuly'
    });
  }
}
const orderController = new ordersController();
export default orderController;
