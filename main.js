const yahoofinanceapi = "XWdDhn1dp339zhlY2bwel69dTqdOjVeG65TcWxte"
const headers_ = {
    "accept": "application/json",
    "X-API-KEY": yahoofinanceapi
}
dias_hacia_atras = 90
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
        formato_fecha = date_objet.toLocaleString()
        lista_de_fechas.push(formato_fecha)
    }
    return lista_de_fechas
}

async function main() {
    const info_api_by_symbol = await get_instrument_info(endpoint_instrument_info)
    const historical_price = await get_instrument_info(endpoint_historical_price)
    precio = get_info_price_by_symbol(info_api_by_symbol)
    const historical_prices = get_historical_price(historical_price)
    // show
    console.log(historical_prices)
}
main()