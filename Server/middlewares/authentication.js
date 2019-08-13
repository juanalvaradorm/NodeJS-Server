var JWT = require('jsonwebtoken');


///==================================================
///Verificar Token
///==================================================



let CheckToken = (req, res, next) => {
    let Token = req.get('authentication');

    JWT.verify(Token, process.env.SeedAuth, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }
        req.Usuario = decoded.Usuario;
        next();
    });
}


///==================================================
///Verificar Admin Role
///==================================================
let VerificaAdminRole = (req, res, next) => {
    let Usuario = req.Usuario;

    if (Usuario.role != "ADMIN_ROLE") {
        res.json({
            ok: false,
            err: {
                message: "El Usuario no es administrador"
            }
        });
    }

}

module.exports = {
    CheckToken,
    VerificaAdminRole
}