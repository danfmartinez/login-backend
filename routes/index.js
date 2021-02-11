const router = require('express').Router();
const apiUsuarioRouter = require('./api/users')

//.com/api/user
//.com/api/user/listar
//....
router.use('/user', apiUsuarioRouter);


module.exports = router;
