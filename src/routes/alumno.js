const express = require('express');
const router = express.Router();
const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/',isLoggedIn, (req, res) => {
     res.redirect('alumno/listaAlumnos');
})

router.get('/listaAlumnos',isLoggedIn, async (req, res) => {
     const [alumnos] = await pool.query('CALL sp_listaDeAlumnos()');
     res.render('alumno/listaAlumnos', {alumnos});
})

router.get('/perfilAlumno/:idAlumno', isLoggedIn, async (req, res) => {
     const {idAlumno} =req.params;

     const [alumnoCompleto] = await pool.query('CALL sp_alumnoCompleto(?)', [idAlumno]); //a de alumnos
     
     res.render('alumno/perfilAlumno', {a: alumnoCompleto[0]});
})

module.exports = router;