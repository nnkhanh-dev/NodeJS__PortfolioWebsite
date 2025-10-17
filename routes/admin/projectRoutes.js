const express = require('express');
const router = express.Router();
const isAdmin = require('../../middlewares/isAdmin');
const projectController = require('../../controllers/admin/projectController');
const upload = require('../../config/multer');

router.get('/', isAdmin, projectController.index);
router.get('/create', isAdmin, projectController.create);
router.post('/create', isAdmin, upload.single('thumbnail'), projectController.store);
router.get('/show/:id', isAdmin, projectController.show);
router.get('/edit/:id', isAdmin, projectController.edit);
router.post('/edit/:id', isAdmin, upload.single('thumbnail'), projectController.update);
router.delete('/delete/:id', isAdmin, projectController.delete);

module.exports = router;
