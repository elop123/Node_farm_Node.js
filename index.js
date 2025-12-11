const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('../final/modules/replaceTemplate.js')

/* const text = fs.readFileSync('./txt/input.txt', 'utf-8')
console.log(text)

const textOut = `This is wat we know abut avocado ${text} created on: ${Date.now()} `

fs.writeFileSync('./txt/output.txt', textOut)
console.log('file written')

//non-blocking asyncronous way
fs.readFile('./txt/start.txt', 'utf-8', (err, data)=>{
    console.log(data)
}); */

//server
const tempOverview = fs.readFileSync('./templates/overview.html', 'utf-8')
const tempCard = fs.readFileSync('./templates/card.html', 'utf-8')
const tempProduct = fs.readFileSync('./templates/product.html', 'utf-8')

const data = fs.readFileSync('./dev-data/data.json', 'utf-8')
const dataObj = JSON.parse(data)

const server = http.createServer((req, res)=>{
    //console.log(req.url)
    const { query, pathname } = url.parse(req.url, true);
    

//overview page
    if (pathname  === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-Type': 'text/html'})
        const cardHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
        //console.log(cardHtml)
        const output = tempOverview.replace('product-card', cardHtml)
        
        res.end(output);
//product page
    } else if (pathname === '/product'){
        res.writeHead(200, {'Content-Type': 'text/html'})
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.end(output)
        //console.log(query)
//API
    } else if(pathname === '/api') {
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(data);
        }
//not found page
    else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
            'my-own-header': 'hello-world!'
        })
        res.end('<h1>Page not found!</h1>');
    }
})
server.listen(8000, '127.0.0.1', ()=>{
    console.log('Listening to request on port 8000')
})
