import express from 'express';
import mealController from '../controllers/mealController';
import menuController from '../controllers/menuController';
import orderController from '../controllers/orderController';

// set router
const router = express.Router();

// meal router
router.get('/api/v1/meals', mealController.getAllMeals);
router.get('/api/v1/meals/:id', mealController.getMeal);
router.post('/api/v1/meals', mealController.createMeal);
router.put('/api/v1/meals/:id', mealController.updateMeal);
router.delete('/api/v1/meals/:id', mealController.deleteMeal);

// Menu routes

router.get('/api/v1/menu/:day', menuController.getTodayMenu);
router.post('/api/v1/menu', menuController.createMenu);

// order routes
router.get('/api/v1/orders', orderController.getAllOrders);
router.post('/api/v1/orders', orderController.createOrder);
router.get('/api/v1/orders/:id', orderController.getOrder);
router.put('/api/v1/orders/:id', orderController.updateOrder);
router.delete('/api/v1/orders/:id', orderController.deleteOrder);

export default router;

//   // Test to get single meal record
//   it('should get a SINGLE meal on /meal GET', done => {
//     const id = 1;
//     chai
//       .request(server)
//       .get(`api/v1/meals/${id}`)
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.be.a('object');
//         res.body.should.have.property('name');
//         res.body.should.have.property('price');
//         res.body.should.have.property('quantity');
//         done();
//       });
//   });

//   it('should update a SINGLE meal on /meal PUT', done => {
//     const id = req.params;
//     let meal = {
//       name: 'wheat',
//       quantity: 5,
//       price: 580
//     };
//     chai
//       .request(server)
//       .put(`api/v1/meals${id}`)
//       .send(meal)
//       .end((err, res) => {
//         res.should.have.status(201);
//         res.body.should.be.a('object');
//         res.body.should.have.property('name');
//         res.body.should.have.property('price');
//         res.body.should.have.property('quantity');
//         done();
//       });
//   });
//   // Test to delete a single meal record
//   it('should delete a SINGLE meal on /meal DELETE', done => {
//     const id = 2;
//     chai
//       .request(server)
//       .delete(`ap1/v1/meals${id}`)
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.should.be.json;
//         res.body.should.be.a('object');
//         res.body.should.have.property('REMOVED');
//         res.body.REMOVED.should.be.a('object');
//         res.body.REMOVED.should.have.property('name');
//         res.body.REMOVED.should.have.property('id');
//         res.body.REMOVED.name.should.equal('price');
//         res.body.REMOVED.name.should.equal('quantity');
//         done();
//       });
//   });
//   //
// });
