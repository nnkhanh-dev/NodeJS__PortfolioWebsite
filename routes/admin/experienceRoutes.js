const express = require('express');
const router = express.Router();
const isAdmin = require('../../middlewares/isAdmin');
const experienceController = require('../../controllers/admin/experienceController');

router.get('/', isAdmin, experienceController.index);
router.get('/create', isAdmin, experienceController.create);
router.post('/create', isAdmin, experienceController.store);
router.get('/show/:id', isAdmin, experienceController.show);
router.get('/edit/:id', isAdmin, experienceController.edit);
router.post('/edit/:id', isAdmin, experienceController.update);
router.delete('/delete/:id', isAdmin, experienceController.delete);

module.exports = router;
