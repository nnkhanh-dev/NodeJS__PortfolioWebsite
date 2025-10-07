const { index } = require("./homeController");

class dashController {
    // [GET] /dashboard
    index(req, res) {
        res.render('admin/dashboard', { user: req.user });
    }
}