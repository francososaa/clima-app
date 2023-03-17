
require('colors');
const { inquirerMenu, 
        pausa,
        leerInput,
        listadoTareasBorrar,
        confirmar,
        mostrarListadoChecklist
} = require('./helpers/inquirer');

const main = async() => {

    let opt = '';

    do {
        opt = await inquirerMenu();

        switch ( opt ){
            case '1': 
                
            break;

            case '2': 
                
            break;

        }
        await pausa();
        
    } while (opt !=='0');
    
}

main();