/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const express = require('express');
const {check} = require('express-validator');
const router = express.Router();
const {crearUsuario, loginUsuario, revalidarToken} = require('../controlles/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt')
router.post(
    '/new', 
    [ //middlewares, función o funciones que se ejecturará inmediatamante al entrar al post de crear usuario
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de más de 6 caracteres').isLength({min:6}), 
        validarCampos
    ], 
    crearUsuario);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('email', 'El email ingresado no es un email').isEmail(),
        check('password', 'El password debe ser de más de 6 caracteres').isLength({min:6}),
        validarCampos
    ],
    loginUsuario);

router.get(
    '/renew',
    validarJWT,
    revalidarToken);


module.exports = router;