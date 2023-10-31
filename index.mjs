import { productos } from './productos.js';
import { obtenerHoraActual } from './obtenerHora.js';
import { encontrarPrecio } from './encontrarPrecio.js';

//*-------------------------------------
const tiempoRetardo = 2000;
//*-------------------------------------

async function iterarProductos() {
 
  let indexProduct = 0;

  const iterarConRetardo = async () => {
    if (indexProduct < productos.length) {
     
      const producto = productos[indexProduct];

      try {
       
        const precioActual = await encontrarPrecio(producto.urlOriginal);
        // console.log(precioActual);
        
        const productoTable = {
          Nombre:  producto.nombre.slice(0, 30) ,
          Precio:  precioActual + ' - (' + producto.precioFijado + ')',
          URL_Venta:  producto.urlVenta,
          URL_Venta_2:  producto.urlVenta2,
          URL_Original: producto.urlOriginal,
        };
       
        if (precioActual > producto.precioFijado) {
          console.log( obtenerHoraActual() + '\x1b[31m ALERTA DE PRECIO\x1b[0m ' + ' Producto Nº:' + (indexProduct + 1))
          console.table(productoTable);
        } else {
          // console.log('\x1b[32mcorrecto\x1b[0m ' + '\x1b[37m' + producto.nombre.slice(0, 30)/*  + '\x1b[0m ' + '\x1b[34m' + producto.urlVenta + '\x1b[0m' */);
        }

      } catch (error) {
       
        const productoTable = {
          Nombre:  producto.nombre.slice(0, 30) ,
          URL_Venta:  producto.urlVenta,
          URL_Venta_2:  producto.urlVenta2,
          URL_Original: producto.urlOriginal,
        };

        console.log( obtenerHoraActual() + '\x1b[31m FALLO AL ENCONTRAR EL PRODUCTO\x1b[0m '  + ' Producto Nº:' + (indexProduct + 1))
        console.table(productoTable);
      }
      indexProduct++;
      setTimeout(iterarConRetardo, tiempoRetardo);
    }
    else {
      // Se reinicia el ciclo
      let numeroCiclo = 1;
      console.log( `Ciclo Nº${numeroCiclo} finalizado / ` + obtenerHoraActual())
      numeroCiclo++;
      iterarProductos(); 
    }
  };
  iterarConRetardo(); 
};






iterarProductos()
