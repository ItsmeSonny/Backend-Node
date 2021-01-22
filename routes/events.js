/*
    Events routes
    /api/events
*/

const express = require('express');
const {validarJWT} = require('../middlewares/validar-jwt')
const router = express.Router();
const {check} = require('express-validator');
const {getEvento,
    crearEvento,
    actualizarEvento,
    eliminarEvento}= require('../controlles/events');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

//router.use(validarJWT); // lo que hace es que cada una de las peticiones que esten
//debajo de esta linea, requiera un token    

//Obtener eventos
router.get(
    '/', 
    validarJWT, 
    getEvento);

//Crear nuevo evento
router.post(
    '/', 
    validarJWT, 
    [   check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('title', 'El titulo debe de tener más de 2 caracteres').isLength({min:2}),
        check('start', 'Debe indicar la fecha de inicio').custom(isDate),
        check('end', 'Debe indicar la fecha de termino').custom(isDate),
        validarCampos
    ],
    crearEvento);


   
//Actualizar evento
router.put('/:id', 
    validarJWT, 
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de finalización es obligatoria').custom(isDate),
        validarCampos
    ], 
    actualizarEvento);

//Actualizar evento
router.delete('/:id', validarJWT, eliminarEvento);

module.exports = router;