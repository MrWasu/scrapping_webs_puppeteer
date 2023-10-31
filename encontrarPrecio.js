import puppeteer from 'puppeteer';

export async function encontrarPrecio(url) {
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