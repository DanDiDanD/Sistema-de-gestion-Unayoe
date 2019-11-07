const express = require('express');
const router = express.Router();
const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/',isLoggedIn, (req, res) => {
     res.redirect('alumno/listaAlumnos');
})

router.get('/listaAlumnos',isLoggedIn, async (req, res) => {
     const [alumnos] = await pool.query('CALL sp_listaDeAlumnos()');
     console.log(alumnos);
     
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

router.post('/listaAlumnos',isLoggedIn, async (req, res) => {
     let {nombre,
               escuela,
               observacion,
               desaprobados,
               ponderado} = req.body;
     
     if(escuela == 1){
          escuela = 'sis';
     }
     else if(escuela == 2){
          escuela = 'sw';
     }

     if(observacion == 1){
          observacion = 'ansiedad';
     }
     else if(observacion == 2){
          observacion = 'depresion';
     }

     let query = `select  a.idAlumno as codigo 
                         ,a.alumnoApellidoPaterno as ApePaterno
                         ,a.alumnoApellidoMaterno as ApeMaterno
                         ,a.alumnoNombre as Nombre
                         ,a.alumnoEscuela as Escuela
                         ,s.sumSituacionAcademica as SitAcademica
                         ,s.sumCantDesaprobados as NumDesaprobados
                         ,s.sumPromedioPonderado as Ponderado
                         ,o.ocObservacionPsicologica as Observacion
                         from  alumno a
                         left join SUM s 
                         on s.Alumno_idAlumno=a.idAlumno
                         left join ocaClinica o 
                         on o.Alumno_idAlumno= a.idAlumno `;

     let bandera = false;
     let condiciones = '';

     if(nombre.length != 0){
          condiciones += `(a.alumnoNombre like '${nombre}%'
                    or a.alumnoApellidoPaterno like '${nombre}%'  
                    or a.alumnoApellidoMaterno like '${nombre}%' 
                    or a.alumnoDni like '${nombre}%' 
                    or a.idAlumno like'${nombre}%') ` ;
          bandera = true;
     }
     if(escuela!=0){
          if(bandera == true){
               condiciones += 'AND ';
          }
          condiciones += `a.alumnoEscuela = '${escuela}' `;
          bandera = true;
     }
     if(observacion!=0){
          if(bandera == true){
               condiciones += 'AND ';
          }
          condiciones += `o.ocObservacionPsicologica like '${observacion}' `;
          bandera = true;
     }
     if(desaprobados.length!=0){
          if(bandera == true){
               condiciones += 'AND ';
          }
          condiciones += `s.sumCantDesaprobados >= '${desaprobados}' `;
          bandera = true;
     }
     if(ponderado.length!=0){
          if(bandera == true){
               condiciones += 'AND ';
          }
          condiciones += `s.sumPromedioPonderado <= '${ponderado}' `;
          bandera = true;
     }

     if(bandera==true){
          query+='WHERE ';
          query+=condiciones;
     }
     query += `order by a.idAlumno desc;`;
                              
     
     console.log(query);
     
     const a = await pool.query(query);
     console.log(a);
     

     if(escuela == 'sis'){
          escuela = 1;
     }
     else if(escuela == 'sw'){
          escuela = 2;
     }

     if(observacion == 'ansiedad'){
          observacion = 1;
     }
     else if(observacion == 'depresion'){
          observacion = 2;
     }


     const filtros = {
          nombre,
          escuela: parseInt(escuela),
          observacion,
          desaprobados,
          ponderado
     };
     console.log(filtros);
     
     res.render('alumno/listaAlumnosFiltrada', {alumnos: a, filtros: filtros});    
     
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