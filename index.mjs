import puppeteer from 'puppeteer';
import { productos } from './productos.js';;

//*-------------------------------------
const tiempoRetardo = 2000;
//*-------------------------------------

async function encontrarPrecio(url) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Emula un User-Agent personalizado para hacer que la solicitud se parezca a un navegador real
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const html = await page.content();

  await browser.close();

  function encontrarHighPrice(texto) {
    const regex = /"price":"(\d+(\.\d+)?)"/
    const coincidencia = texto.match(regex);

    if (coincidencia && coincidencia[1]) {
      return coincidencia[1];
    } else {
      return null;
    }
  }
  //console.log(html)

  const precio = encontrarHighPrice(html);
  if (precio !== null) {
    return precio
  } else {
    return null
  }
}

const iterarProductos = async () => {
  let index = 0;

  const iterarConRetardo = async () => {
    if (index < productos.length) {
      const producto = productos[index];

      try {
        const precioActual = await encontrarPrecio(producto.urlOriginal);
        //console.log(precioActual);
        const productoTable = {
          Nombre:  producto.nombre.slice(0, 30) ,
          Precio:  precioActual + ' - (' + producto.precioFijado + ')',
          URL_Venta:  producto.urlVenta,
          URL_Original: producto.urlOriginal,
        };
        if (precioActual < producto.precioFijado || precioActual == null) {
          console.log('\x1b[31mFALLO\x1b[0m ' +  index + 1)
          console.table(productoTable);
        }
        else {
          console.log('\x1b[32mcorrecto\x1b[0m ' + '\x1b[37m' + producto.nombre.slice(0, 30)/*  + '\x1b[0m ' + '\x1b[34m' + producto.urlVenta + '\x1b[0m' */);
        }
      } catch (error) {
        console.error("Error al obtener el precio:", error);
      }
      index++;
      setTimeout(iterarConRetardo, tiempoRetardo);
    }
    else {
      iterarProductos();
    }
  };
  iterarConRetardo();
};

iterarProductos()
