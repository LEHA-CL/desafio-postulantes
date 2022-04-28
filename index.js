const puppeteer = require ('puppeteer');

(async()=>{
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.goto ('https://www.sii.cl/servicios_online/1047-nomina_inst_financieras-1714.html');
    
    const dataObj = {};
    dataObj ['titulo'] = await page.$eval('h2.title',text => {
       text.querySelector('script')?.remove();
       text = text.textContent.replace(/\s+/g,' ').trim();    
       
       return text;
    
    
    });
    dataObj ['descripcion']= await page.$eval('.col-sm-9.contenido  p:nth-child(4)', text => {   
        
        text = text.textContent.replace(/\s+/g,' ').trim();
        return text;
    });
    
    let data = await page.evaluate(
        () => Array.from(
          document.querySelectorAll('table[id="tabledatasii"] > tbody > tr'),
          row => Array.from(row.querySelectorAll('th, td'), cell => cell.innerText)
        )
    );

    data = data.map(element => {
        return {
            n : element[0],
            razonSocial : element[1],
            pais : element[2],
            datosInscripcion :  element[3],
            vigenciaHasta : element[4],
            datosUltimaActualizacion : element[5],
            estado : element[6],
        }
    });

    dataObj ['tabla'] = data;
  
    console.log(dataObj);
    await browser.close();
})();