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

function crear_grafico(fechas, precios) {
    console.log(fechas)
    console.log(precios)
    const $grafica_colombia = document.querySelector("#chart_colombia")
    const labels = fechas
    const datos = {
        label: "Peso Colombiano Vs USD ultimos 90 dias",
        data: precios,
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 5,
    }
    new Chart($grafica_colombia, {
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

async function main() {
    // const info_api_by_symbol = await get_instrument_info(endpoint_instrument_info)
    // const historical_price = await get_instrument_info(endpoint_historical_price)
    // const precio = get_info_price_by_symbol(info_api_by_symbol)
    // const historical_data = get_historical_price(historical_price)
    const precios = [3800, 3900, 3950, 4000, 4100, 4200, 4150, 4050, 4000, 4600,]
    const fechas = ["label1", "", "label2", "label3", "label4", "label5", "label6", "label7", "label8", "label9", "label10",]
    // crear_grafico(historical_data["fechas"], historical_data["precios"])
    crear_grafico(fechas, precios)
}
main()
