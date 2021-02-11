const router = require('express').Router();
const usuarioController = require('../../controllers/UserController.js');

//.com/api/user/list
router.get('/list', usuarioController.list)

//.com/api/user/add
router.post('/add',usuarioController.add)

//.com/api/user/update
router.put('/update', usuarioController.update);

//.com/api/user/login
router.post('/login',usuarioController.login);

//.com/api/user/activate
router.put('/activate', usuarioController.activate);

//.com/api/user/deactivate
router.put('/deactivate',usuarioController.deactivate);

module.exports = router;


