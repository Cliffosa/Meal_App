import Order from '../models/orders';
import OrderItem from '../models/orderItems';
import Meal from '../models/meal';
import Menu from '../models/menu';

class ordersController {
  createOrder(req, res) {
    try {
      const { mealId, quantity } = req.body;
      const orderItem = OrderItem.findOne({ where: { mealId, userId: req.user.id } });
      const result = {};
      // check order exist
      if (orderItem) {
        result.body = {
          status: false,
          message: 'Orders Already Exist!!!'
        };
      } else {
        // create new order
        const newOrderItem = OrderItem.create({ mealId, quantity, userId: req.user.id });
        result.body = {
          status: true,
          message: 'Order Sucessfully Added!',
          createdOrder: newOrderItem
        };
      }
      return res.status(201).json(result.body);
    } catch (error) {
      return res.status(500).json({
        status: 'error creating order',
        message: error.message
      });
    }
  }
  getOrders(req, res) {
    try {
      const orders = Order.findAll({ where: { adminId: req.admin.id } });
      return res.status(200).json({
        status: true,
        message: 'Orders Retrieved Successfully!',
        fetchData: orders
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error fetching orders',
        message: error.message
      });
    }
  }

  modifyOrder(req, res) {
    try {
      const { orderId } = req.params;
      const { action } = req.body;
      const orderItem = OrderItem.findOne({
        where: { id: orderId, userId: req.user.id },
        include: [Meal]
      });
      if (action === 'increase') {
        orderItem.quantity++;
        if (orderItem.quantity > orderItem.meal.quantity) {
          throw new Error(
            `We only have ${orderItem.meal.quantity} of ${orderItem.meal.name} is available`
          );
        }
        OrderItem.update(
          {
            quantity: orderItem.quantity
          },
          { where: { id: orderItem.id } }
        );
      } else if (action === 'decrease') {
        orderItem.quantity--;
        if (orderItem.quantity === 0) {
          OrderItem.destroy({ where: { id: orderItem.id } });
        } else {
          OrderItem.update({ quantity: orderItem.quantity }, { where: { id: orderItem.id } });
        }
      } else if (action === 'delete') {
        OrderItem.destroy({ where: { id: orderItem.id } });
      }
      return res.status(200).json({
        status: true,
        message: 'Order Updated Successfully'
      });
    } catch (error) {
      return res.status(500).json({
        status: flase,
        message: error.message
      });
    }
  }
}

const orderController = new ordersController();
export default orderController;
