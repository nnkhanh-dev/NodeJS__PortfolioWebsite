const express = require('express');
const router = express.Router();
const isAdmin = require('../../middlewares/isAdmin');
const socialController = require('../../controllers/admin/socialController');

router.get('/', isAdmin, socialController.index);
router.get('/create', isAdmin, socialController.create);
router.post('/create', isAdmin, socialController.store);
router.get('/show/:id', isAdmin, socialController.show);
router.get('/edit/:id', isAdmin, socialController.edit);
router.post('/edit/:id', isAdmin, socialController.update);
router.delete('/delete/:id', isAdmin, socialController.delete);

module.exports = router;
