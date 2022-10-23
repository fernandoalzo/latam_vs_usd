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

// const yahoofinanceapi = "PuE7Rqe48MnVsysW7mxI5CJupd4afqGL0cJqM8i0"
// const yahoofinanceapi = "sdcyIni7kuaucmyJUJkYW55n6ilQL2306XYkXjPU"
const yahoofinanceapi = "IQBxSohM1T7AnrIu01RLP1RPlgacbJgT49ZeW0gn"

const headers_ = {
    "accept": "application/json",
    "X-API-KEY": yahoofinanceapi
}

async function get_instrument_info(endPoint_url) {
    console.log("####################################")
    console.log(endPoint_url)
    console.log("####################################")
    try {
        const response = await fetch(endPoint_url, {
            method: "GET",
            headers: headers_
        })
        if (response.status == 200) {
            const data = response.json()
            return data
        } else if (response.status == 429) {
            console.log("Hacen falta licencias para funcionar")
            $('#exampleModal').modal('show');

        } else {
            console.log("Ocurrrio un error realizando la consulta a la API")
            console.log("Codigo de la solicitud: " + response.status)
        }
    } catch (e) {
        console.log("Ocurrio un Error")
        console.log(e)
    }
}

// function get_info_price_by_symbol(info_from_api) {
//     precio = info_from_api["quoteResponse"]["result"][0]["regularMarketPrice"]
//     ask = info_from_api["quoteResponse"]["result"][0]["ask"]
//     bid = info_from_api["quoteResponse"]["result"][0]["bid"]
//     info_precio = {
//         "precio" : precio,
//         "ask" : ask,
//         "bid" : bid
//     }
//     return info_precio
// }

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
        lista_de_fechas.push(formato_fecha)
    }
    return lista_de_fechas
}

function crear_grafico(fechas, precios, pais, dias) {
    const $grafica = document.querySelector(`#chart_${pais}`)
    const labels = fechas
    const datos = {
        label: `Moneda de ${pais} Vs USD ultimos ${dias} dias`,
        data: precios,
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 3,
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
        h2_precio = document.createElement("h2")
        h2_precio.setAttribute("id", `precio_${pais}`)
        div4.append(h2_precio)

        div4.setAttribute("class", "card-body")
        canvas = document.createElement("canvas")
        canvas.setAttribute("id", `chart_${pais}`)
        canvas.style.ba
        div4.append(canvas)       


        h3_apreciacion_value = document.createElement("h3")
        // h2_apreciacion_lable = ""
        h3_apreciacion_value.setAttribute("id", `apreciacion_price_${pais}`)
        div4.append(h3_apreciacion_value)

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
    crear_pais(info_paises)
    for (pais in info_paises){
        iso_symbol = info_paises[`${pais}`]["ISO"]
        const dias = 60
        // historical data
        endpoint_historical_price = `https://yfapi.net/v8/finance/chart/USD${iso_symbol}%3DX?range=${dias}d&region=US&interval=1d&lang=en&events=div%2Csplit`
        const historical_price = await get_instrument_info(endpoint_historical_price)
        const historical_data = get_historical_price(historical_price)
        // calcular la devauacion
        const precios = historical_data["precios"]
        const precio_inicial = Math.round(precios[0])
        console.log(precio_inicial)
        const precio_final = Math.round(precios[precios.length-1])
        console.log(precio_final)
        devaluacion = ((precio_inicial - precio_final) / precio_inicial) * 100
        console.log(devaluacion)
        //set price into HTML
        // precio_actual = info_recio["precio"]
        precio_actual = precio_final
        h1_precio = document.querySelector(`#precio_${pais}`)
        h1_precio.append(document.createTextNode('Precio: ' + precio_actual))
        //set apreciation into HTML
        h1_precio = document.querySelector(`#apreciacion_price_${pais}`)
        h1_precio.append(document.createTextNode(`${devaluacion.toFixed(1)}% `))
        //Crear graficos
        crear_grafico(historical_data["fechas"], historical_data["precios"], pais, dias)
    }
}
main()

window.onload = _=>{
    console.log("mensaje para cada recarga")
}
