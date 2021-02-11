var jwt = require("jsonwebtoken");
const db = require("../models");
 
async function checkToken(token) {
    let localID = null;
    try {
       const { id } = await jwt.decode(token);
       localID = id;
    } catch (error) {
        return false;
    }
    const user = await db.Usuario.findOne({where: {
        id : localID,
        estado : 1
    }});
    if (user) {
        const token = encode(user);
        return { token, rol: user.rol};  
    } else {
        return false;
    }
}

module.exports = {
  //generar el token
  encode: async (user) => {
    const token = jwt.sign(
      {
        rol: user.rol,
        id: user.id,
        nombre: user.nombre,
        email: user.email,
      },
      "HolaSoyUnaCadenaSecreta",
      {
        expiresIn: '1d', // 24 horas
      });
    return token;
  },
  //permite decodificar el token
  decode: async (token) => {
    try {
        const{ id } = await jwt.verify(token, "HolaSoyUnaCadenaSecreta");
        const user = await db.Usuario.findOne({where: {
            id :  id,
            estado : 1
        }});
        if (user) {
            return user;
        } else {
            return false;
        }
    } catch (error) {
        const newToken = await checkToken(token);
        return newToken;
    }
  },
};
