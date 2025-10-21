const express = require('express');
const router = express.Router();
const categoryPostController = require('../../controllers/admin/categoryPostController');
const isAdmin = require('../../middlewares/isAdmin');

router.get('/', isAdmin, categoryPostController.index);
router.get('/create', isAdmin, categoryPostController.create);
router.post('/create', isAdmin, categoryPostController.store);
router.get('/edit/:id', isAdmin, categoryPostController.edit);
router.post('/edit/:id', isAdmin, categoryPostController.update);
router.post('/delete/:id', isAdmin, categoryPostController.destroy);

module.exports = router;
