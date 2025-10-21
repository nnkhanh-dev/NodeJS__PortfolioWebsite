const express = require('express');
const router = express.Router();
const { postController, upload } = require('../../controllers/admin/postController');
const isAdmin = require('../../middlewares/isAdmin');

router.get('/', isAdmin, postController.index);
router.get('/create', isAdmin, postController.create);
router.post('/create', isAdmin, upload.single('thumbnail'), postController.store);
router.get('/edit/:id', isAdmin, postController.edit);
router.post('/edit/:id', isAdmin, upload.single('thumbnail'), postController.update);
router.post('/delete/:id', isAdmin, postController.destroy);

module.exports = router;
