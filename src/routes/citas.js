const express = require('express');
const router = express.Router();
const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/',isLoggedIn, (req, res) => {
     res.redirect('citas/listaCitas');
})

router.get('/listaCitas',isLoggedIn, async (req, res) => {
     const citas = await pool.query(`SELECT a.idAlumno, a.alumnoApellidoPaterno as ApePaterno
     ,a.alumnoApellidoMaterno as ApeMaterno
     ,a.alumnoNombre as Nombre
     ,a.alumnoEscuela as Escuela
     ,s.sumSituacionAcademica as SitAcademica, 
     c.citaFecha, c.citaMotivo, c.citaObservacion, c.idCita
     from CITA c left join alumno a on c.Alumno_idAlumno=a.idAlumno 
     left join SUM s on c.Alumno_idAlumno = s.Alumno_idAlumno ORDER BY c.citaFecha`);
     
     let length = citas.length;
     for(let i = 0 ; i < length; i++){
          let date = new Date(citas[i].citaFecha);
          mnth = ("0" + (date.getMonth()+1)).slice(-2),
          day  = ("0" + date.getDate()).slice(-2);
          hours  = ("0" + date.getHours()).slice(-2);
          minutes = ("0" + date.getMinutes()).slice(-2);
          citas[i].citaFecha = `${day}-${mnth}-${date.getFullYear()} `;
          let xm = 'a. m.';
          if(hours>12){
               hours = hours - 12;
               xm = 'p. m.';
          }
          let citaHora = `${hours} : ${minutes} ${xm}`;
          citas[i].citaHora = citaHora;
          citas[i].Nombre = citas[i].Nombre.toLowerCase();
     }
     
     
     res.render('citas/listaCitas', {citas});
})

router.get('/crearCita/:idAlumno', isLoggedIn, async (req, res) => {
     const {idAlumno} =req.params;

     const [alumnoCompleto] = await pool.query('CALL sp_alumnoCompleto(?)', [idAlumno]); //a de alumnos
     console.log(alumnoCompleto);
     
     res.render('citas/crearCita', {a: alumnoCompleto[0]});
     
})

router.get('/editarCita/:idCita', isLoggedIn, async (req, res) => {
     const {idCita} = req.params;
     const cita = await pool.query(`SELECT a.idAlumno, a.alumnoApellidoPaterno as ApePaterno
     ,a.alumnoApellidoMaterno as ApeMaterno
     ,a.alumnoNombre as Nombre
     ,a.alumnoEscuela as Escuela
     ,s.sumSituacionAcademica as SitAcademica, 
     c.citaFecha, c.citaMotivo, c.idCita, c.citaObservacion as observacion
     from CITA c left join alumno a on c.Alumno_idAlumno=a.idAlumno 
     left join SUM s on c.Alumno_idAlumno = s.Alumno_idAlumno WHERE c.idCita = ?`, [idCita]);

     let date = new Date(cita[0].citaFecha);
     mnth = ("0" + (date.getMonth()+1)).slice(-2),
     day  = ("0" + date.getDate()).slice(-2);
     hours  = ("0" + date.getHours()).slice(-2);
     minutes = ("0" + date.getMinutes()).slice(-2);
     cita[0].citaFecha = `${date.getFullYear()}-${mnth}-${day}T${hours}:${minutes}:00`;     
     
     res.render('citas/editarCita', {c: cita[0]});
     
})

router.post('/editarCita/:idCita', isLoggedIn, async (req, res) => {
     const {idCita} = req.params;
     const {fecha, motivo, idAlumno} = req.body;
     const newLink = {
          citaFecha: fecha,
          citaMotivo: motivo,
     };
     await pool.query('UPDATE cita SET ? WHERE idCita = ? ', [newLink, idCita]);
     res.redirect(`/alumno/perfilAlumno/${idAlumno}`);
     
})

router.post('/crearCita/:idAlumno', isLoggedIn, async (req, res) => {
     const {idAlumno} =req.params;
     const {fecha, motivo} = req.body;

     const newLink = {
          citaFecha: fecha,
          citaMotivo: motivo,
          Alumno_idAlumno: idAlumno
     };
     await pool.query('INSERT INTO cita SET ?', [newLink]);
     res.redirect(`/alumno/perfilAlumno/${idAlumno}`);
     
})

router.get('/verCita/:idCita', isLoggedIn, async (req, res) => {
     const {idCita} = req.params;
     const cita = await pool.query(`SELECT a.idAlumno, a.alumnoApellidoPaterno as ApePaterno
     ,a.alumnoApellidoMaterno as ApeMaterno
     ,a.alumnoNombre as Nombre
     ,a.alumnoEscuela as Escuela
     ,s.sumSituacionAcademica as SitAcademica, 
     c.citaFecha, c.citaMotivo, c.idCita, c.citaObservacion as observacion
     from CITA c left join alumno a on c.Alumno_idAlumno=a.idAlumno 
     left join SUM s on c.Alumno_idAlumno = s.Alumno_idAlumno WHERE c.idCita = ?`, [idCita]);
     
     let length = cita.length;
     for(let i = 0 ; i < length; i++){
          let date = new Date(cita[i].citaFecha);
          mnth = ("0" + (date.getMonth()+1)).slice(-2),
          day  = ("0" + date.getDate()).slice(-2);
          hours  = ("0" + date.getHours()).slice(-2);
          minutes = ("0" + date.getMinutes()).slice(-2);
          cita[i].citaFecha = `${day}-${mnth}-${date.getFullYear()} `;
          let xm = 'a. m.';
          if(hours>12){
               hours = hours - 12;
               xm = 'p. m.';
          }
          let citaHora = `${hours} : ${minutes} ${xm}`;
          cita[i].citaHora = citaHora;
     }

     console.log(cita);
     
     
     res.render('citas/verCita', {c: cita[0]});
})

router.post('/editarObservaciones/:idCita', isLoggedIn, async (req, res) => {
     const {idCita} = req.params;
     const {observacion} = req.body;
     const newLink = {
          citaObservacion: observacion
     };
     
     await pool.query('UPDATE cita SET ? WHERE idCita = ? ', [newLink, idCita]);
     res.redirect('/citas/ListaCitas');
})

router.post('/eliminarCita/:idCita', isLoggedIn, async (req, res) => {
     const {idCita} = req.params;
     const {idAlumno}= req.body;
     console.log(idAlumno);
     console.log('Hola Mundo');
     
     await pool.query('DELETE FROM cita WHERE idCita = ?', [idCita]);
     res.redirect(`/alumno/perfilAlumno/${idAlumno}`);
})

module.exports = router;