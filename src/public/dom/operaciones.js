limpiarObjeto = (objeto) => {
     if (objeto.hasChildNodes()) {
          while (objeto.childNodes.length >= 1){
               objeto.removeChild(objeto.firstChild);
          }
     };
}

redondearDos = (num) => {    
     return +(Math.round(num + "e+2")  + "e-2");
}

confirmacion = (texto) => {
     let confirmacion = confirm(texto);
     return confirmacion;
}


