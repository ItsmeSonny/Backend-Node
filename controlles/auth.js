const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const {generarJWT} = require('../helpers/jwt');
const {EventoSchema} = require('../models/Evento')


const crearUsuario = async(req, res = express.response)=>{

    //Identificar que valores tiene req
    //console.log(req);

    const {email, password} = req.body;
    try {
        let usuario = await Usuario.findOne({ email:email});

        if(usuario){
            return res.status(400).json({
                ok:false,
                msg: 'El usuario existe con ese correo electronico'
            });
        }
        
        usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();
        //Generar nuestro Jason web token JWT
        const token = await generarJWT(usuario.id, usuario.name);

        //Se creó correctamente
        res.status(201).json({
            ok:true,
            uid:usuario.id,
            name:usuario.name,
            token
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg: 'Porfavor hable con el administrador'
        });
    }
}

const loginUsuario = async (req, res = express.response)=>{
    
    const {email, password} = req.body;
    
    try {
        const usuario = await Usuario.findOne({ email:email});

        if(!usuario){
            return res.status(400).json({
                ok:false,
                msg: 'El usuario no existe con ese email'
            });
        }
        //Confirmar las contraseñas
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'password incorrecto'
            })
        }

        //Generar nuestro Jason web token JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok:true,
            uid:usuario.id,
            name:usuario.name,
            token
        });
    
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg: 'Porfavor hable con el administrador'
        });
    }
    
}

const revalidarToken = async (req, res = express.response)=>{

    const uid = req.uid;
    const name = req.name;
    
    const token = await generarJWT(uid, name);


    res.status(201).json({
        ok:true,
        //uid,
        //name,
        token
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}