const express = require('express');
const router = express.Router();
const isAdmin = require('../../middlewares/isAdmin');
const techTypeController = require('../../controllers/admin/techTypeController');


router.get('/', isAdmin, techTypeController.index);
router.get('/create', isAdmin, techTypeController.create);
router.post('/create', isAdmin, techTypeController.store);
router.delete('/delete/:id', isAdmin, techTypeController.delete);
router.get('/edit/:id', isAdmin, techTypeController.edit);
router.post('/edit/:id', isAdmin, techTypeController.update);


module.exports = router;
