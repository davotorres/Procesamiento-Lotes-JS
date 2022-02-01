document.addEventListener('DOMContentLoaded', function(){
    addEventListener();
    
});
let lote = [];
let lotes= [];
let numeroLotes, numeroProcesos, id = 0, Nlote = 0;

function addEventListener(){
    const botonIngresar =  document.querySelector('#ingresar');
    botonIngresar.addEventListener('click', ObtenerNumeroProcesos);   
}
 
function ObtenerNumeroProcesos(){
    const procesos = document.querySelector('#procesos');
    //Valida si es un numero mayor a 0
    if(validarNumero(procesos.value)){
       lote = [];
       lotes = [];
       numeroLotes =  redondear(procesos.value/5);
       numeroProcesos = procesos.value;
       menuProceso();
    }else{
        alert('Debe ser un numero mayor a 0');
    }   
}

function menuProceso( id= '', nombre = '', tiempo = '', operador = ''){
    const divProceso = document.querySelector('#proceso');

    if(numeroProcesos > 0){
        divProceso.innerHTML = `
        <p>Lotes: ${numeroLotes}<p>
        <form class="formulario">
            <fieldset>
                <legend> Proceso </legend>
                <p> Procesos: ${numeroProcesos}</p>

                <label for="IdProceso">ID</label>
                <input type="num" id="IdProceso" value ="${id}">

                <label for="nombre">Nombre</label>
                <input type="text" id="nombre" value ="${nombre}">
            
                <label for="tiempo">Tiempo Estimado</label>
                <input type="num" id="tiempo" value ="${tiempo}">
                
                <label for="operador">Operador</label>
                <input type="text" id="operador"  value ="${operador}">
            </fieldset>
            <input class="boton" type="submit" id="nuevoproceso" value="Ingresar">
        </form>
        `;

        const botonIngresar = document.querySelector('#nuevoproceso');  

        botonIngresar.addEventListener('click', ()=>{
            ingresarProceso();
        });
    }else{
        divProceso.innerHTML = ``;
        ejecutar();

    }
}

async function ejecutar(){
    const tablaProceso = document.querySelector('#loteProceso');
    dividirLotes();
    Nlote = 0;
    //Lotes
    for(const lote of lotes){
        Nlote++;1
        actualizarTabla(lote);
        for(const proceso of lote){
            procesoEjecucion(proceso);
            let tr = proceso.tiempoEstimado;
            for(let i = 0; i<proceso.tiempoEstimado; i++){
                const tiempos = document.querySelectorAll('#tiempo');
                const tiempoTotal = document.querySelector('#tiempoTotal');
                tiempos[0].innerHTML = `Tiempo Trascurrido: <span>${i}</span>`;
                tiempos[1].innerHTML = `Tiempo Restante: <span>${--tr}</span>`;
                tiempoTotal.innerHTML = `Tiempo Total de Simulacion: <span> ${++numeroProcesos} </span>segundos`;
                await sleep(1000);
                
            }
            ProcesosTerminados(proceso);
        }
        tablaProceso.innerHTML = ``;
    }
}

function actualizarTabla(lote){
    const tablaProceso = document.querySelector('#loteProceso');
    for(const proceso of lote){
        row = createTr();
        row.innerHTML = ` 
            <td>${Nlote}</td>
            <td>${proceso.id}</td>
            <td>${proceso.tiempoEstimado}</td>
        `;
        tablaProceso.appendChild(row);
    }
}

function ProcesosTerminados(proceso){
    const tbody  = document.querySelector('#procesoTerminado');
    const row = createTr();
    row.innerHTML = `
        <td>${Nlote}</td>
        <td>${proceso.id}</td>
        <td>${proceso.operacion}</td>
        <td>${proceso.resultado}</td>
    `;
    tbody.appendChild(row);
}

function createTr(){
    const tr = document.createElement('TR');
    return tr;
}

function procesoEjecucion(proceso){
    divProceso = document.querySelector('#procesoEjecucion');
     divProceso.innerHTML = `
        <p>ID: <span>${proceso.id}</span></p>
        <p>Nombre: <span>${proceso.nombre}</span></p>
        <p>Operacion: <span>${proceso.operacion}</span></p>
        <p>Tiempo Max. Estimado: <span>${proceso.tiempoEstimado}</span></p>
        <p id = "tiempo"></p>
        <p id = "tiempo"></p>
     `;
}

function ingresarProceso(){

    const id = document.querySelector('#IdProceso');
    const nombre = document.querySelector('#nombre');
    const tiempo = document.querySelector('#tiempo');
    const operador = document.querySelector('#operador');

    let errores = validar(id.value, nombre.value, tiempo.value, operador.value);

    if(isEmpty(errores)){
        const proceso = new Proceso(id.value, nombre.value , tiempo.value, operador.value);
        lote.push(proceso);
        alert('Proceso Agregado');  
        proceso.RealizarOperacion();
        --numeroProcesos
        menuProceso();
    }
    else{
        const div = document.querySelector('#errores');
        errores.forEach(error=> {
            console.log(error);
            const parrafo = document.createElement('P');
            parrafo.innerHTML = `${error}`;
            div.appendChild(parrafo);
        });
        menuProceso(id.value, nombre.value, tiempo.value, operador.value);
    }
}

function dividirLotes(){
    for (let i = 0; i < lote.length; i+=5){
        let pedazo = lote.slice(i, i + 5);
        lotes.push(pedazo);
    }
}

function validarNumero(numero){
    return numero > 0 ? true : false;
}

function validarOperador( operacion ){
    const regex = new RegExp('^[0-9]+[+-/%\*x]{1,1}[0-9]+$');
    return regex.test(operacion); // true o false
} 

function IsValidDivision(operacion){ //2/2
    const operador = operacion.match('[+-/%\*x]{1,1}')
    if( operador[0] ==='/' || operador [0]==='%' ){
        const operando = validarOperando(operacion, operador);
        if(operando === '0'){
           return false;
        }
    }
    return true
}
                         
   
function validarOperando (operacion, operando){ // 2342342 / 0 
    const operandos =  operacion.split(operando);
    return operandos[1];
}

function validarCadena(cadena){
    return cadena === '';
}

function validarID(id){
    for(const process of lote){
        if(process.id === id){
            return true;
        }
    }
    return false;
}

function validar(id, nombre, numero, operacion){
    const div = document.querySelector('#errores');
    div.innerHTML = ``;
    let errores = []

    if(validarCadena(id)){
        errores.push('El ID es obligatorio');
    }
    if(validarID(id)){
        errores.push('El ID: '+ id + ' ya fue registrado, ingrese uno nuevo');
    }
    if(validarCadena(nombre)){  
        errores.push('El nombre es obligatorio.');
    }
    if(!validarNumero(numero)){
        errores.push('El tiempo de espera debe ser mayor a 0.');
    }
    if(!validarOperador(operacion)){
        errores.push('El formato del operador no es valido');
    }else{
        if(!IsValidDivision(operacion)) {
            errores.push('El formato de Division o Residuo no es valido.');
        }
    }
    
    return errores;
}

function isEmpty(array){
    return array.length === 0;
}

function redondear(lotes){
    if(lotes <=1){
        return 1;
    }
    if(lotes >1 && lotes <=2){
        return 2
    }
    if(lotes >2 && lotes <=3){
        return 3
    }
    if(lotes >3 && lotes <=4){
        return 4
    }
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
