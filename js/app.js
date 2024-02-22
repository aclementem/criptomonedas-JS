const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

//Crear un Promise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
});

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();
    formulario.addEventListener('submit', submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

async function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    // fetch(url)
    //     .then(respuesta => respuesta.json())
    //     .then(resultado => obtenerCriptomonedas(resultado.Data))
    //     .then(criptomonedas => selectCriptomonedas(criptomonedas))
    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomonedas(resultado.Data);
        selectCriptomonedas(criptomonedas);

    } catch (error) {
        console.log(error);
    }
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo;
        //console.log(Name)
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
    //console.log(objBusqueda)
}

function submitFormulario(e) {
    e.preventDefault();

    const { moneda, criptomoneda } = objBusqueda;

    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    consultarAPI();
}

function mostrarAlerta(mensaje) {
    const error = document.querySelector('.error');

    if (!error) {
        const alerta = document.createElement('div');
        alerta.classList.add('error')
        alerta.textContent = mensaje;
        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

async function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        mostrarCotizacion(resultado.DISPLAY[criptomoneda][moneda]);
    } catch (error) {
        console.log(error);
    }

    // setTimeout(() => {
    //     fetch(url)
    //         .then(respuesta => respuesta.json())
    //         .then(resultado => mostrarCotizacion(resultado.DISPLAY[criptomoneda][moneda]))
    // }, 500);
}

function mostrarCotizacion(cotizacion) {
    //console.log(cotizacion)
    const { LOWDAY, HIGHDAY, PRICE, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    limpiarHTML();

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio  es: <span>${PRICE}</span>`;

    const precioMin = document.createElement('p');
    precioMin.innerHTML = `El Precio más bajo del día: <span>${LOWDAY}</span>`;

    const precioMax = document.createElement('p');
    precioMax.innerHTML = `El Precio más alto del día: <span>${HIGHDAY}</span>`;

    const ultimas24horas = document.createElement('p');
    ultimas24horas.innerHTML = `Variación últimas 24h: <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `Última actualización: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioMax);
    resultado.appendChild(precioMin);
    resultado.appendChild(ultimas24horas);
    resultado.appendChild(ultimaActualizacion);
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('sk-circle', 'color-red');
    spinner.innerHTML = `
    <div class="sk-circle1 sk-child"></div>
    <div class="sk-circle2 sk-child"></div>
    <div class="sk-circle3 sk-child"></div>
    <div class="sk-circle4 sk-child"></div>
    <div class="sk-circle5 sk-child"></div>
    <div class="sk-circle6 sk-child"></div>
    <div class="sk-circle7 sk-child"></div>
    <div class="sk-circle8 sk-child"></div>
    <div class="sk-circle9 sk-child"></div>
    <div class="sk-circle10 sk-child"></div>
    <div class="sk-circle11 sk-child"></div>
    <div class="sk-circle12 sk-child"></div>
    `;

    resultado.appendChild(spinner);
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}