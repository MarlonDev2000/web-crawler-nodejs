const puppeteer = require('puppeteer')
const fs = require('fs')

async function init() {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.goto(
    'https://go.olx.com.br/grande-goiania-e-anapolis/autos-e-pecas/carros-vans-e-utilitarios',
    { timeout: 60000 }
  )
  await page.screenshot({ path: 'print-tela.png' })

  const data = await page.evaluate(() => {
    const cars = []

    document.querySelectorAll('.fnmrjs-1').forEach((item) => {
      const titulo = item.querySelector('h2').innerText
      const preco = item.querySelector('span.sc-ifAKCX.eoKYee').innerText
      const endereco = item.querySelector('span.sc-7l84qu-1.ciykCV.sc-ifAKCX').innerText
      const img = item.querySelector('img')?.dataset?.src

      cars.push({
        titulo: titulo,
        preco: preco,
        imagem: img,
        endereco: endereco,
      })
    })
    return { cars }
  })

  const carsJson = JSON.stringify(data.cars)

  // console.log(carsJson)

  fs.writeFile('data.json', carsJson, () => {})

  await browser.close()
}

init()
