
require('dotenv').config();

const { inquirerMenu, 
        pausa,
        leerInput,
        listarLugares,
} = require('./helpers/inquirer');

const Busquedas = require('./models/busquedas');


const main = async() => {

    const busquedas = new Busquedas();
    let opt;

    do {
        
        opt = await inquirerMenu();

        switch ( opt ){
            case 1: 
                // Mostrar mensaje
                const ciudad = await leerInput('Ciudad: ');

                // Buscar los lugares
                const lugares = await busquedas.ciudad( ciudad );

                // Seleccionar el lugar
                const id = await listarLugares( lugares );

                if ( id === '0') continue;

                const lugarSeleccionado = lugares.find( l => l.id === id);

                //Guardar en DB
                busquedas.agregarHistorial( lugarSeleccionado.nombre );

                // Datos del clima
                const clima = await busquedas.climaLugar( lugarSeleccionado.latitud , lugarSeleccionado.longitud);

                // Mostrar resultado
                console.clear();
                console.log(`${ '\n ##### Informacion de la ciudad ##### \n ' }`.green);
                console.log('Ciudad: ', lugarSeleccionado.nombre);
                console.log('Longitud: ', lugarSeleccionado.longitud);
                console.log('Latitud: ', lugarSeleccionado.latitud);
                console.log('Temperatura: ', clima.temperatura);
                console.log('Minima: ', clima.temp_minima);
                console.log('Maxima: ', clima.temp_maxima);
                console.log('Estado del clima actual: ', clima.descripcion.yellow);
            break;

            case 2: 
                busquedas.historialCapitalizado.forEach ( ( lugar, i ) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log( `${ idx } ${ lugar }` );
                })
            break;
        }
        await pausa();
        
    } while (opt !== 0);
    
}

main();