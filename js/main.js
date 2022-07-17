info_paises = {
    "colombia": { "moneda": "peso", "ISO": "COP" },
    "mexico": { "moneda": "peso", "ISO": "MXN" },
    "belice": { "moneda": "Dolar", "ISO": "BZD" },
    "guatemala": { "moneda": "quetzal", "ISO": "GTQ" },
    "salvador": { "moneda": "Dolar Gringo", "ISO": "USD" },
    "honduras": { "moneda": "lempira", "ISO": "HNL" },
    "nicaragua": { "moneda": "cordoba", "ISO": "NIO" },
    "costa_rica": { "moneda": "Colon Costarricense", "ISO": "CRC" },
    "panama": { "moneda": "balboa", "ISO": "PAB" },
    "venezuela": { "moneda": "bolivar", "ISO": "VES" },
    "guayanas": { "moneda": "dolar guayanes", "ISO": "GYD" },
    "peru": { "moneda": "sol", "ISO": "PEN" },
    "brazil": { "moneda": "real", "ISO": "BRL" },
    "bolivia": { "moneda": "boliviano", "ISO": "BOB" },
    "paraguay": { "moneda": "guarai", "ISO": "PYG" },
    "chile": { "moneda": "peso", "ISO": "CLP" },
    "argentina": { "moneda": "peso", "ISO": "ARS" },
    "uruguay": { "moneda": "peso", "ISO": "UYU" }
}

const yahoofinanceapi = "XWdDhn1dp339zhlY2bwel69dTqdOjVeG65TcWxte"
const headers_ = {
    "accept": "application/json",
    "X-API-KEY": yahoofinanceapi
}
dias_hacia_atras = 60
iso_symbol = "COP"
endpoint_instrument_info = `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=USD${iso_symbol}%3DX`
endpoint_historical_price = `https://yfapi.net/v8/finance/chart/USD${iso_symbol}%3DX?range=${dias_hacia_atras}d&region=US&interval=1d&lang=en&events=div%2Csplit`

async function get_instrument_info(endPoint_url) {
    try {
        const response = await fetch(endPoint_url, {
            method: "GET",
            headers: headers_
        })
        if (response.status == 200) {
            console.log(response.status)
            const data = response.json()
            return data
        } else {
            console.log("Ocurrrio un error realizando la consulta a la API")
            console.log("Codigo de la solicitud: " + response.status)
        }
    } catch (e) {
        console.log("Ocurrio un Error")
        console.log(e)
    }
}

function get_info_price_by_symbol(info_from_api) {
    ask = info_from_api["quoteResponse"]["result"][0]["ask"]
    bid = info_from_api["quoteResponse"]["result"][0]["bid"]
    info_precio = {
        "ask": ask,
        "bid": bid
    }
    return info_precio
}

function get_historical_price(info_from_api) {
    const precios = info_from_api["chart"]["result"][0]["indicators"]["quote"][0]["close"]
    const timestamp = info_from_api["chart"]["result"][0]["timestamp"]
    const fechas = convert_timstamp_to_date_format(timestamp)

    return info = {
        "precios": precios,
        "fechas": fechas
    }
}

function convert_timstamp_to_date_format(list_timestamp) {
    var lista_de_fechas = []
    for (var i = 0; i < list_timestamp.length; i++) {
        var milisegundos = list_timestamp[i] * 1000
        var date_objet = new Date(milisegundos)
        var formato_fecha = date_objet.toLocaleString()
        //remove time from formato_fecha 
        var formato_fecha = formato_fecha.split(' ')[0]
        console.log(formato_fecha)
        lista_de_fechas.push(formato_fecha)
    }
    return lista_de_fechas
}

function crear_grafico(fechas, precios, pais) {
    // console.log(pais)
    const $grafica = document.querySelector(`#chart_${pais}`)
    const labels = fechas
    const datos = {
        label: "Peso Colombiano Vs USD ultimos 90 dias",
        data: precios,
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 5,
    }
    new Chart($grafica, {
        type: "line",
        data: {
            labels: labels,
            datasets: [datos],
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        display: false,
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        display: true,
                        color: 'rgba(0, 0, 0, 1)',
                    },
                    grid: {
                        display: false
                    }
                },
            },
            plugins: {
                legend: {
                    labels: {
                        boxWidth: 0,
                        color: 'rgba(0, 0, 0, 1)'
                    },
                    display: true,
                    position: "bottom"
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            },
        }
    })
}

function crear_pais(info_paises){
    contenedor = document.querySelector("#contenedor")
    for (pais in info_paises){
        iso = info_paises[`${pais}`]["ISO"]
        div1 = document.createElement("div")
        div1.setAttribute("class", "col")

        div2 = document.createElement("div")
        div2.setAttribute("class", "card mb-4 rounded-3 shadow-sm")

        div3 = document.createElement("div")
        div3.setAttribute("class", "card-header py-3")

        h4 = document.createElement("h4")
        h4.setAttribute("class", "my-0 fw-normal")
        nombre_pais = document.createTextNode(`${pais}`)        
        h4.append(nombre_pais)
        div3.append(h4)

        div4 = document.createElement("div")
        div4.setAttribute("class", "card-body")
        canvas = document.createElement("canvas")
        canvas.setAttribute("id", `chart_${pais}`)
        canvas.style.ba
        div4.append(canvas)
        h1 = document.createElement("h1")
        precio = document.createTextNode("$Precio")
        h1.append(precio)
        div4.append(h1)

        link = document.createElement("a")
        link.setAttribute("href", `https://finance.yahoo.com/quote/${iso}=X/`)
        link.setAttribute("target", "_blank")
        boton = document.createElement("button")
        boton.setAttribute("type", "button")
        boton.setAttribute("class", "w-100 btn btn-lg btn-outline-primary")
        texto_boton = document.createTextNode("Mas informacion")
        boton.append(texto_boton)        
        link.append(boton)
        div4.append(link)

        div2.append(div3, div4)
        div1.append(div2)
        contenedor.append(div1)
    }

}

async function main() {
    // const info_api_by_symbol = await get_instrument_info(endpoint_instrument_info)
    // const historical_price = await get_instrument_info(endpoint_historical_price)
    // const precio = get_info_price_by_symbol(info_api_by_symbol)
    // const historical_data = get_historical_price(historical_price)
    const fechas = ["label1", "", "label2", "label3", "label4", "label5", "label6", "label7", "label8", "label9", "label10",]
    const precios = [3800, 3900, 3950, 4000, 4100, 4200, 4150, 4050, 4000, 4600,]    
    // crear_grafico(historical_data["fechas"], historical_data["precios"])
    // crear_grafico(fechas, precios)
    crear_pais(info_paises)
    for (pais in info_paises){
        crear_grafico(fechas, precios, pais)
    }
}
main()
