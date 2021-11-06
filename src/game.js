import Boot from './boot.js';
import Title from './title.js';
import Select from './level_select.js';
import Debug from './debug.js';
import End from './end.js';

const initGame = () => {
/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
    type: Phaser.AUTO,
    width:  1280,
    height: 720,
    resolution: window.devicePixelRatio,
    scale: {
        // mode: Phaser.Scale.FIT,  
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    pixelArt: true,
    scene: [Boot, End, Debug, Title, Select],
    physics: { 
        default: 'arcade', 
        arcade: { 
            gravity: { y: 2000 }, 
            debug: false 
        } 
    }
};


new Phaser.Game(config);
}

//Código de Iván para cargar la fuente usada en la pantalla de carga.
const WebFontConfig = {
    google: {
        families: [ 'Caveat' ]
    },
    active : () => {
        initGame();
    }
};

//El juego se carga cuando la fuente esté lista
let script = document.createElement('script');
script.onload = function () {
    WebFont.load(WebFontConfig);    
};
script.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';

document.head.appendChild(script);