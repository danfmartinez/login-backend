const db = require("../models");
const bcrypt = require("bcryptjs");
const tokenServices = require('../services/token');

exports.login = async (req, res, next) => {
  try {
    const user = await db.User.findOne({ where: { email: req.body.email } });
    if (user) {
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (passwordIsValid) {
        const token = await tokenServices.encode(user);//se exporta el token 
        res.status(200).json({
          //auth: true,
          user : user,
          tokenReturn: token
        });
      } else {
        res.status(401).send({ auth:false, accessToken: null, reason:'Invalid Password!'});
      }
    } else {
      res.status(404).send('User Not Found.');
    }
  } catch (error) {
    res.status(500).send({
      message: "Error!!",
    });
    next(error);
  }
};


exports.add = async (req, res, next) => {
  try {
    const user = await db.User.findOne({where: {email: req.body.email}});
    if (user){
      res.status(409).send({
        message:'sorry your request has a conflict with our system state, maybe the email is already in use.'
      })
    }else{
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      const user = await db.User.create(req.body);
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).send({
      message: 'Error->'
    })
    next(error);
  }
};

exports.list = async(req, res, next) =>{
  try {
      const user = await db.User.findAll();
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).send({
          message:'There is not user in the system'
        })
      }
  } catch (error) {
    res.status(404).send({
      message: 'Error!!'
    })
    next(error);
  }
};

// actualiza la informacion
exports.update = async(req, res, next) => {
  try {
    let pas = req.body.password;
    const reg0 = await db.User.findOne({ where: {id: req.body.id } });
    if (pas !=  reg0.password) {
      req.body.password =await bcrypt.hash(req.body.password, 10);
    }
    const user = await db.User.update({rol: req.body.rol, nombre: req.body.nombre, password: req.body.password, email:req.body.email}, {where :{ id: req.body.id }});
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send({
      message: 'Ocurrió un error'
    });
    next(error);
  }
}

exports.activate = async(req, res, next) =>{
  try {
    const user = await db.User.update(
      {estado: 1}, { where: { id: req.body.id }}
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send({
      message:'Ocurrió un error'
    });
    next(error);
  }
}

exports.deactivate = async(req, res, next) =>{
  try {
    const user = await db.User.update(
      { estado: 0}, {where: { id: req.body.id }}
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send({
      message: 'Ocurrió un error'
    });
    next(error);
  }
}