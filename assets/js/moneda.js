
let dataIndicador = [];
let myChart;

function calcularTipoCambio() {

    const indicador = document.getElementById('select-monedas');
    const index = indicador.selectedIndex;
    const value = indicador.options[index].value;

    getDataIndicador(value);

}


async function getDataIndicador(tipo) {
    try {

        const simbolo = {
            dolar: 'USD',
            euro: '€'
        }

        if (tipo === 'non') {
            alert("Debe seleccionar una moneda");
            return;
        }

        const res = await fetch(`https://mindicador.cl/api/${tipo}`);
        const data = await res.json();
        
        const indicadorActualizado = data.serie[0];
        dataIndicador = data.serie;

        const input = document.getElementById("input-monto");
        const monto = parseInt(input.value);

        if (input.value.trim() === '') {
            alert("Debe ingresar un monto");
            return;
        }

        const totalCambio = monto / indicadorActualizado.valor;

        document.getElementById("output-monto").innerText = totalCambio.toFixed(2) +' '+ simbolo[tipo];
        
        if (myChart !== undefined) {
            myChart.destroy();
        }

        mostrarGrafico(tipo);

    } catch (e) {
        console.log(e);
        alert('Ocurrio un error con la información.');
    }
}

function mostrarGrafico(tipo) {
    var ctx = document.getElementById('area-grafico');
    const dias = dataIndicador.slice(0, 10);
    const valor = [];
    const fechas = [];

    dias.map((indicador) => {
        valor.push(indicador.valor);
        let formatearFecha = formatoFecha(indicador.fecha);
        fechas.push(formatearFecha);
    });


    myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: fechas,
          datasets: [{
          label: 'Indicador ' + tipo,
          data: valor,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]}
      });
}

function formatoFecha(inputDate) {
    const date = new Date(inputDate);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear(); 
    return `${day}-${month}-${year}`;
}