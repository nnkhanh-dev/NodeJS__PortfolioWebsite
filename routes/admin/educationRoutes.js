const express = require('express');
const router = express.Router();
const isAdmin = require('../../middlewares/isAdmin');
const educationController = require('../../controllers/admin/educationController');

router.get('/', isAdmin, educationController.index);
router.get('/create', isAdmin, educationController.create);
router.post('/create', isAdmin, educationController.store);
router.get('/edit/:id', isAdmin, educationController.edit);
router.post('/edit/:id', isAdmin, educationController.update);
router.delete('/delete/:id', isAdmin, educationController.delete);

module.exports = router;
