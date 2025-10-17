const express = require('express');
const router = express.Router();
const isAdmin = require('../../middlewares/isAdmin');
const technicalController = require('../../controllers/admin/technicalController');


router.get('/', isAdmin, technicalController.index);
router.get('/create', isAdmin, technicalController.create);
router.post('/create', isAdmin, technicalController.store);
router.delete('/delete/:id', isAdmin, technicalController.delete);
router.get('/edit/:id', isAdmin, technicalController.edit);
router.post('/edit/:id', isAdmin, technicalController.update);


module.exports = router;
