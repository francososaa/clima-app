
require('colors');
const inquirer = require('inquirer');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Que desea hacer?',
        choices: [
            {
                value: '1',
                name: `${'1.'.green} Crear tarea`
            },
            {
                value: '2',
                name: `${'2.'.green} Listar tarea`
            },
            {
                value: '0',
                name: `${'0.'.green} Salir`
            },
        ]
    }
];


const inquirerMenu = async() => {

    console.clear();

    console.log('==========================='.green);
    console.log('   Seleccione una opcion   '.white);
    console.log('===========================\n'.green)

    const { opcion } = await inquirer.prompt(preguntas);
    return opcion;
}


const pausa = async() => {

    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${ 'enter'.green } para continuar`
        }
    ]

    console.log('\n');
    await inquirer.prompt( question );
}

const leerInput = async( message ) => {

    const question = [
        {
            type: 'input',
            name: 'descripcion',
            message,
            validate( value ){
                if ( value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true
            }
        }
    ];

    const { descripcion } = await inquirer.prompt( question );
    return descripcion;

}


const listadoTareasBorrar = async( tareas = [] ) => {

    const choices = tareas.map( ( tarea, i ) => {

        const idx = `${ i + 1 }.`.green;

        return {
            value: tarea.id,
            name: `${ idx } ${ tarea. descripcion} `
        }

    } );

    choices.unshift({
        value: '0',
        name: '0.'.green + 'Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'borrar',
            choices
        }
    ];

    const { id } = await inquirer.prompt( preguntas );
    
    return id;
}

const confirmar = async( message ) => {

    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];

    const { ok } = await inquirer.prompt( question );
    return ok;

}

const mostrarListadoChecklist = async( tareas = [] ) => {

    const choices = tareas.map( ( tarea, i ) => {

        const idx = `${ i + 1 }.`.green;

        return {
            value: tarea.id,
            name: `${ idx } ${ tarea. descripcion} `,
            checked: ( tarea.completadoEn ) ? true : false
        }

    } );

    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices
        }
    ];

    const { ids } = await inquirer.prompt( pregunta );
    
    return ids;
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listadoTareasBorrar,
    confirmar,
    mostrarListadoChecklist
}