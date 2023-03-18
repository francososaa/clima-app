
const fs = require('fs');
const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath = './db/dataBase.json';

    constructor(){
        this.leerDB();
    }

    get historialCapitalizado(){

        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' ');

        })
    }

    get paramsMapbox(){
        return {
            'limit': 5,
            'language' : 'es',
            'access_token': process.env.MAPBOX_KEY,
        }
    }

    get paramsOpenweather(){
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es',
        }
    }

    async ciudad( lugar = '' ){
        
        try{

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();

            // retornar los lugares que coincidan con el lugar qeu escribio la persona
            return resp.data.features.map( lugar => ({

                id: lugar.id,
                nombre: lugar.place_name,
                longitud: lugar.center[0],
                latitud: lugar.center[1],

            }));

        } catch ( error ){
            return []; 
        }
        
    };

    async climaLugar( lat, lon ){

        try {

            // Busca en la api los datos del clima del pais
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenweather, lat, lon }
            });

            const resp = await instance.get();
            const { weather ,main } = resp.data;

            // retornar los datos del clima de dicho pais
            return {
                
                descripcion: weather[0].description,
                temp_minima: main.temp_min,
                temp_maxima: main.temp_max,
                temperatura: main.temp
                
            };

        } catch ( error ){
            console.log( error );
        }

    }

    agregarHistorial( lugar = ''){

        if ( this.historial.includes( lugar.toLocaleLowerCase() ) ){
            return;
        }

        // Mantengo solo 5 paises en el historial
        this.historial = this.historial.splice( 0, 5); 

        this.historial.unshift( lugar.toLocaleLowerCase() );

        // Guardar en DB
        this.guardarDB();
    }

    guardarDB(){

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ));
    }

    leerDB(){

        if( !fs.existsSync( this.dbPath ) ) return;
        
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' } );
        const data = JSON.parse( info );

        this.historial = data.historial;



    }

}

module.exports = Busquedas;