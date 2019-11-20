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
     c.citaFecha, c.citaMotivo, c.citaObservación, c.idCita
     from CITA c left join alumno a on c.Alumno_idAlumno=a.idAlumno 
     left join SUM s on c.Alumno_idAlumno = s.Alumno_idAlumno`);
     
     console.log(citas);
     
     let length = citas.length;
     for(let i = 0 ; i < length; i++){
          let date = new Date(citas[i].citaFecha);
          mnth = ("0" + (date.getMonth()+1)).slice(-2),
          day  = ("0" + date.getDate()).slice(-2);
          hours  = ("0" + date.getHours()).slice(-2);
          minutes = ("0" + date.getMinutes()).slice(-2);
          citas[i].citaFecha = `${day}-${mnth}-${date.getFullYear()} `;
          citaHora = `${hours} : ${minutes}`;
          citas[i].citaHora = citaHora;

          citas[i].Nombre = citas[i].Nombre.toLowerCase();
     }
     
     
     res.render('citas/listaCitas', {citas});
})

module.exports = router;