const express = require('express');
const router = express.Router();
const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');
const PDF = require('pdfkit');
const fs = require('fs');

router.get('/',isLoggedIn, (req, res) => {
     res.redirect('alumno/listaAlumnos');
})

router.get('/listaAlumnos',isLoggedIn, async (req, res) => {
     const [alumnos] = await pool.query('CALL sp_listaDeAlumnos()');
     res.render('alumno/listaAlumnos', {alumnos});
})

router.post('/listaAlumnos2', async (req, res) => { 
     const {id,
          apellidos,
          nombre,
          escuela,
          situacion,
          desaprobados,
          ponderado
     } = req.body;
     
     let bandera;
     let length;
     if(Array.isArray(id)){
          bandera = true;
          length= id.length;
     }
     else{
          bandera = false;
     }
     

     let doc = new PDF();
     try{
          doc.pipe(fs.createWriteStream(__dirname + '../../../pdf/lista_de_alumnos.pdf'));

          doc.text('Lista de alumnos', {
               align: 'center'
          });
     
          let salto_de_linea = `
          `;
     
          doc.text(salto_de_linea, {
               columns: 3,
               align: 'justify'
          })
          
          if(bandera == true){
               for(let i = 0; i<length ; i++){
                    let nombreCompleto = apellidos[i].toUpperCase();
                    nombreCompleto += ', ';
                    nombreCompleto += nombre[i].toLowerCase();
          
                    let nuevaEscuela='';
                    if(escuela[i] == 'sis'){
                         nuevaEscuela = 'sistemas';
                    }
                    else if (escuela[i] == 'sw'){
                         nuevaEscuela = 'software';
                    }
          
                    let nuevoPonderado = '';
                    
                    if(ponderado[i].length == 3){
                         console.log('Hola Mundo');
                         
                         nuevoPonderado += '  ';
                    }
                    nuevoPonderado += ponderado[i].toString();
          
                    
                    doc.text(id[i],50,(i*15 + 100),{});
                    doc.text(nombreCompleto,110,(i*15 + 100),{});
          
                    doc.text(nuevaEscuela,350,(i*15 + 100),{});
                    doc.text(situacion[i],430,(i*15 + 100),{});
                    doc.text(desaprobados[i],480,(i*15 + 100),{});
                    doc.text(nuevoPonderado,500,(i*15 + 100),{});
               }
          }
          else{
               let nombreCompleto = apellidos.toUpperCase();
               nombreCompleto += ', ';
               nombreCompleto += nombre.toLowerCase();
     
               let nuevaEscuela='';
               if(escuela == 'sis'){
                    nuevaEscuela = 'sistemas';
               }
               else if (escuela == 'sw'){
                    nuevaEscuela = 'software';
               }
     
               let nuevoPonderado = '';
               
               if(ponderado.length == 3){
                    console.log('Hola Mundo');
                    
                    nuevoPonderado += '  ';
               }
               nuevoPonderado += ponderado.toString();

               doc.text(id,50,(15 + 100),{});
               doc.text(nombreCompleto,110,(15 + 100),{});
     
               doc.text(nuevaEscuela,350,(15 + 100),{});
               doc.text(situacion,430,(15 + 100),{});
               doc.text(desaprobados,480,(15 + 100),{});
               doc.text(nuevoPonderado,500,(15 + 100),{});
          }

     
          doc.end();
     
          console.log('Archivo generado');
          res.redirect('/alumno/listaAlumnos');
     }catch(e){
          throw e;
     }
})

router.post('/imprimirAlumno', async (req, res) => { 
     let {
          imprimir_idAlumno,
          imprimir_alumnoDni,
          imprimir_alumnoFacultad,
          imprimir_alumnoEscuela,
          imprimir_alumnoApellidoPaterno,
          imprimir_alumnoApellidoMaterno,
          imprimir_alumnoNombre,
          imprimir_alumnoFechaNacimento,
          imprimir_alumnoSexo,
          imprimir_alumnoCorreoIns,
          imprimir_alumnoPlan,
          imprimir_ocColegioProced,
          imprimir_ocDependeDe,
          imprimir_ocTrabajo,
          imprimir_ocViveCon,
          imprimir_ocTipoVivienda,
          imprimir_ocTiempoTransporte,
          imprimir_ocDicapacidad,
          imprimir_ocTipoSeguro,
          imprimir_ocApoderado,
          imprimir_ocCorreoApoderado,
          imprimir_ocTelefCasa,
          imprimir_ocMovilApoderado,
          imprimir_ocEstadoCivil,
          imprimir_ocNumeroMovil,
          imprimir_ocCorreoPersonal,
          imprimir_ocObservacionPsicologica,
          imprimir_sumPromedioPonderado,
          imprimir_sumCantDesaprobados,
          imprimir_sumCiclo,
          imprimir_sumPermanencia,
          imprimir_sumSituacionAcademica,
          imprimir_sumDocenteTutor
     } = req.body;

     let doc = new PDF();
     try{
          doc.pipe(fs.createWriteStream(__dirname + `'../../../pdf/alumnos_${imprimir_idAlumno}.pdf`));

          doc.text(`${imprimir_alumnoApellidoPaterno} ${imprimir_alumnoApellidoMaterno} ${imprimir_alumnoNombre}`, {
               align: 'center'
          });
     
          let salto_de_linea = `
          `;
     
          doc.text(salto_de_linea, {
               columns: 3,
               align: 'justify'
          })
          
          

          if(imprimir_alumnoEscuela == 'sis'){
               imprimir_alumnoEscuela = 'sistemas';
          }
          else if (imprimir_alumnoEscuela == 'sw'){
               imprimir_alumnoEscuela = 'software';
          }

          if(imprimir_sumSituacionAcademica == 'regul'){
               imprimir_sumSituacionAcademica = 'regular';
          }
          else if (imprimir_sumSituacionAcademica == 'obser'){
               imprimir_sumSituacionAcademica = 'observado';
          }

          if(imprimir_sumPromedioPonderado.length == 3){
               imprimir_sumPromedioPonderado = imprimir_sumPromedioPonderado + ' ';
          }


          
          
          let i = 0;
          i++;

          doc.text('Apellido paterno: ',            50,(15*i + 100),{});                doc.text(imprimir_alumnoApellidoPaterno,      220,(15*i + 100),{});     i++;    
          doc.text('Apellido materno: ',            50,(15*i + 100),{});                doc.text(imprimir_alumnoApellidoMaterno,      220,(15*i + 100),{});     i++;
          doc.text('Nombre: ',                      50,(15*i + 100),{});                doc.text(imprimir_alumnoNombre,               220,(15*i + 100),{});     i++;
          doc.text('Codigo: ',                      50,(15*i + 100),{});                doc.text(imprimir_idAlumno,                   220,(15*i + 100),{});     i++;
          doc.text('DNI: ',                         50,(15*i + 100),{});                doc.text(imprimir_alumnoDni,                  220,(15*i + 100),{});     i++;
          doc.text('Facultad: ',                    50,(15*i + 100),{});                doc.text(imprimir_alumnoFacultad,             220,(15*i + 100),{});     i++;
          doc.text('Escuela: ',                     50,(15*i + 100),{});                doc.text(imprimir_alumnoEscuela,              220,(15*i + 100),{});     i++;
          doc.text('Plan de estudios: ',            50,(15*i + 100),{});                doc.text(imprimir_alumnoPlan,                 220,(15*i + 100),{});     i++;
          doc.text('Correo institucional: ',        50,(15*i + 100),{});                doc.text(imprimir_alumnoCorreoIns,            220,(15*i + 100),{});     i++;
          doc.text('Fecha de nacimiento: ',         50,(15*i + 100),{});                doc.text(imprimir_alumnoFechaNacimento,       220,(15*i + 100),{});     i++;
          doc.text('Sexo: ',                        50,(15*i + 100),{});                doc.text(imprimir_alumnoSexo,                 220,(15*i + 100),{});     i++; i++;
          doc.text('Colegio de precedencia: ',      50,(15*i + 100),{});                doc.text(imprimir_ocColegioProced,            220,(15*i + 100),{});     i++;
          doc.text('Depende de alguien: ',          50,(15*i + 100),{});                doc.text(imprimir_ocDependeDe,                220,(15*i + 100),{});     i++;
          doc.text('Trabajo: ',                     50,(15*i + 100),{});                doc.text(imprimir_ocTrabajo,                  220,(15*i + 100),{});     i++;
          doc.text('Vive con alguien: ',            50,(15*i + 100),{});                doc.text(imprimir_ocViveCon,                  220,(15*i + 100),{});     i++;
          doc.text('Tipo de vivienda: ',            50,(15*i + 100),{});                doc.text(imprimir_ocTipoVivienda,             220,(15*i + 100),{});     i++;
          doc.text('Tiempo de transporte: ',        50,(15*i + 100),{});                doc.text(imprimir_ocTiempoTransporte,         220,(15*i + 100),{});     i++;
          doc.text('Discapacidad presente: ',       50,(15*i + 100),{});                doc.text(imprimir_ocDicapacidad,              220,(15*i + 100),{});     i++;
          doc.text('Tipo de seguro: ',              50,(15*i + 100),{});                doc.text(imprimir_ocTipoSeguro,               220,(15*i + 100),{});     i++;
          doc.text('Observacion psicológica: ',     50,(15*i + 100),{});                doc.text(imprimir_ocObservacionPsicologica,   220,(15*i + 100),{});     i++;
          doc.text('Estado civil: ',                50,(15*i + 100),{});                doc.text(imprimir_ocEstadoCivil,              220,(15*i + 100),{});     i++;
          doc.text('Correo institucional: ',        50,(15*i + 100),{});                doc.text(imprimir_ocCorreoPersonal,           220,(15*i + 100),{});     i++;
          doc.text('Número de celular: ',           50,(15*i + 100),{});                doc.text(imprimir_ocNumeroMovil,              220,(15*i + 100),{});     i++;
          doc.text('Apoderado: ',                   50,(15*i + 100),{});                doc.text(imprimir_ocApoderado,                220,(15*i + 100),{});     i++;
          doc.text('Correo del apoderado: ',        50,(15*i + 100),{});                doc.text(imprimir_ocCorreoApoderado,          220,(15*i + 100),{});     i++;
          doc.text('Telefono de casa: ',            50,(15*i + 100),{});                doc.text(imprimir_ocTelefCasa,                220,(15*i + 100),{});     i++;
          doc.text('Movil del apoderado: ',         50,(15*i + 100),{});                doc.text(imprimir_ocMovilApoderado,           220,(15*i + 100),{});     i++; i++;
          doc.text('Ciclo actual del estudiante: ', 50,(15*i + 100),{});                doc.text(imprimir_sumCiclo,                   220,(15*i + 100),{});     i++;
          doc.text('Promedio ponderado: ',          50,(15*i + 100),{});                doc.text(imprimir_sumPromedioPonderado,       220,(15*i + 100),{});     i++;
          doc.text('N° cursos desaprobados: ',      50,(15*i + 100),{});                doc.text(imprimir_sumCantDesaprobados,        220,(15*i + 100),{});     i++;
          doc.text('Permanencia académica: ',       50,(15*i + 100),{});                doc.text(imprimir_sumPermanencia,             220,(15*i + 100),{});     i++;
          doc.text('Situacion académicao: ',        50,(15*i + 100),{});                doc.text(imprimir_sumSituacionAcademica,      220,(15*i + 100),{});     i++;
          doc.text('Docente tutor: ',               50,(15*i + 100),{});                doc.text(imprimir_sumDocenteTutor,            220,(15*i + 100),{});     i++;


     
          doc.end();
     
          console.log('Archivo generado');
          res.redirect(`/alumno/perfilAlumno/${imprimir_idAlumno}`);
     }catch(e){
          throw e;
     }
})


router.get('/perfilAlumno/:idAlumno', isLoggedIn, async (req, res) => {
     const {idAlumno} =req.params;

     const [alumnoCompleto] = await pool.query('CALL sp_alumnoCompleto(?)', [idAlumno]); //a de alumnos
     const citas = await pool.query('SELECT * FROM cita WHERE Alumno_idAlumno = ?', [idAlumno]);
     
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

     }
     
     let date2 = new Date(alumnoCompleto[0].alumnoFechaNacimento);
     mnth = ("0" + (date2.getMonth()+1)).slice(-2),
     day  = ("0" + date2.getDate()).slice(-2);
     alumnoCompleto[0].alumnoFechaNacimento = `${date2.getFullYear()}-${mnth}-${day}`;   
     console.log(alumnoCompleto[0]);
     
     res.render('alumno/perfilAlumno', {a: alumnoCompleto[0], citas: citas});
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

     const a = await pool.query(query);
     

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

// doc.text('Apellido paterno: ',50,(15 + 100),{});
// doc.text('Apellido materno: ',50,(15 + 100),{});
// doc.text('Nombre: ',50,(15 + 100),{});
// doc.text('Codigo: ',50,(15 + 100),{});
// doc.text('DNI: ',50,(15 + 100),{});
// doc.text('Facultad: ',50,(15 + 100),{});
// doc.text('Escuela: ',50,(15 + 100),{});
// doc.text('Plan de estudios: ',50,(15 + 100),{});
// doc.text('Correo institucional: ',50,(15 + 100),{});
// doc.text('Fecha de nacimiento: ',50,(15 + 100),{});
// doc.text('Sexo: ',50,(15 + 100),{});
// doc.text('Colegio de precedencia: ',50,(15 + 100),{});
// doc.text('Depende de alguien: ',50,(15 + 100),{});
// doc.text('Trabajo: ',50,(15 + 100),{});
// doc.text('Vive con alguien: ',50,(15 + 100),{});
// doc.text('Tipo de vivienda: ',50,(15 + 100),{});
// doc.text('Tiempo de transporte: ',50,(15 + 100),{});
// doc.text('Discapacidad presente: ',50,(15 + 100),{});
// doc.text('Tipo de seguro: ',50,(15 + 100),{});
// doc.text('Observacion psicológica: ',50,(15 + 100),{});
// doc.text('Estado civil: ',50,(15 + 100),{});
// doc.text('Correo institucional: ',50,(15 + 100),{});
// doc.text('Número de celular: ',50,(15 + 100),{});
// doc.text('Apoderado: ',50,(15 + 100),{});
// doc.text('Correo del apoderado: ',50,(15 + 100),{});
// doc.text('Telefono de casa: ',50,(15 + 100),{});
// doc.text('Movil del apoderado: ',50,(15 + 100),{});
// doc.text('Ciclo actual del estudiante: ',50,(15 + 100),{});
// doc.text('Promedio ponderado: ',50,(15 + 100),{});
// doc.text('N° cursos desaprobados: ',50,(15 + 100),{});
// doc.text('Permanencia académica: ',50,(15 + 100),{});
// doc.text('Situacion académicao: ',50,(15 + 100),{});
// doc.text('Docente tutor: ',50,(15 + 100),{});