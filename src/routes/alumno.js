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

router.post('/perfilAlumno/:idAlumno', isLoggedIn, async (req, res) => {
     const {idAlumno} = req.params;
     await pool.query('CALL sp_EliminarAlumno(?)', [idAlumno]);
     res.redirect('/alumno/listaAlumnos');
})


router.get('/editarPerfilAlumno/:idAlumno', isLoggedIn, async (req, res) => {
     const {idAlumno} = req.params;
     const [alumnoCompleto] = await pool.query('CALL sp_alumnoCompleto(?)', [idAlumno])

     res.render('alumno/editarPerfilAlumno', {a: alumnoCompleto[0]});
})

router.post('/editarPerfilAlumno/:idAlumno', isLoggedIn, async(req, res) => {
     const {idAlumno} = req.params;
     const _Alumno_idAlumno= idAlumno;
     const{
          ocColegioProced,
          ocDependeDe,
          ocTrabajo,
          ocViveCon,
          ocTipoVivienda,
          ocTiempoTransporte,
          ocDicapacidad,
          ocTipoSeguro,
          ocEstadoCivil,
          ocCorreoPersonal,
          ocNumeroMovil,
          ocApoderado,
          ocCorreoApoderado,
          ocTelefCasa,
          ocMovilApoderado
     } = req.body;
     
     const newObject = {
          _ocColegioProced: ocColegioProced,
          _ocDependeDe: ocDependeDe,
          _ocTrabajo: ocTrabajo,
          _ocViveCon: ocViveCon,
          _ocTipoVivienda: ocTipoVivienda,
          _ocTiempoTransporte: ocTiempoTransporte,
          _ocDicapacidad: ocDicapacidad,
          _ocTipoSeguro: ocTipoSeguro,
          _ocApoderado: ocApoderado,
          _ocCorreoApoderado: ocCorreoApoderado,
          _ocTelefCasa: ocTelefCasa,
          _ocMovilApoderado: ocMovilApoderado,
          _ocEstadoCivil: ocEstadoCivil,
          _ocNumeroMovil: ocNumeroMovil,
          _ocCorreoPersonal: ocCorreoPersonal
     }
     console.log(newObject);
     await pool.query('CALL sp_editarAlumnos(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
          _Alumno_idAlumno, 
          newObject._ocColegioProced,
          newObject._ocDependeDe,
          newObject._ocTrabajo,
          newObject._ocViveCon,
          newObject._ocTipoVivienda,
          newObject._ocTiempoTransporte,
          newObject._ocDicapacidad,
          newObject._ocTipoSeguro,
          newObject._ocApoderado,
          newObject._ocCorreoApoderado,
          newObject._ocTelefCasa,
          newObject._ocMovilApoderado,
          newObject._ocEstadoCivil,
          newObject._ocNumeroMovil,
          newObject._ocCorreoPersonal
     ]);

     const [alumnoCompleto] = await pool.query('CALL sp_alumnoCompleto(?)', [idAlumno]); //a de alumnos
     res.render('alumno/perfilAlumno', {a: alumnoCompleto[0]});
})
module.exports = router;