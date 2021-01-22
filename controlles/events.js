const express = require('express')
const Evento = require('../models/Evento')

const getEvento= async (req, res = express.response )=>{

    const eventos = await Evento.find().populate('user', 'name');
 
    res.json(
        {
        ok:true,
        eventos
        } 
    )   
}

const crearEvento= async (req, res = express.response )=>{

    const evento = new Evento(req.body);

    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save();
        res.json({
            ok:true,
            evento:eventoGuardado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

    //verificar que tengo el evento.
    console.log(req.body);
 
}

const actualizarEvento= async (req, res = express.response )=>{

    const eventoId=req.params.id;
    const uid = req.uid;
    
    try {

        const evento = await Evento.findById(eventoId);
        

        if(!evento){
            return res.status(404).json(
                {
                ok:false,
                msg:'Evento no encontrado'
                } 
            ) 
        }
        //console.log(uid)
        if( evento.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg:'No tiene permisos para editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user:uid
        }
        /*Para mostrar actualizacion en mongo usar {new: true} */
        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true});
        res.json(
            {
            ok:true,
            evento: eventoActualizado
            } 
        ); 
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }
 
}
const eliminarEvento=async(req, res = express.response )=>{
 
    const eventoId=req.params.id;
    const uid = req.uid;
    
    try {

        const evento = await Evento.findById(eventoId);
        

        if(!evento){
            return res.status(404).json(
                {
                ok:false,
                msg:'Evento no encontrado'
                } 
            ) 
        }
        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            });
        }

        
        
        await Evento.findByIdAndDelete(eventoId);
        res.json(
            {
            ok:true
            } 
        ); 
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    } 
}   

module.exports={
    getEvento,
    crearEvento,
    actualizarEvento,
    eliminarEvento
};