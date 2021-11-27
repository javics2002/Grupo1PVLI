import Boot from './boot.js';
import Title from './title.js';
import Select from './level_select.js';
import Debug from './debug.js';
import Tower1 from './tower1.js';
import Tower2 from './tower2.js';
import Tower3 from './tower3.js';
import Tower4 from './tower4.js';
import Tower5 from './tower5.js';
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
        //resolution: window.devicePixelRatio,
        scale: {
            mode: Phaser.Scale.FIT,  
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        pixelArt: true,
        scene: [Boot, End, Debug, Title, Select, Tower1, Tower2, Tower3, Tower4, Tower5 ],
        physics: { 
            default: 'matter', 
            matter: { 
                gravity: { y: 2 }, 
                debug: false
            } 
        }
    };

    let game = new Phaser.Game(config);

    game.levelsInfo = [];

    // Número de nivel actual. 0 es uno de los menús
    game.levelsInfo[0] = 0;

    game.levelsInfo[1] = {
        record: 0,
        winHeight: 600
    }
    game.levelsInfo[2] = {
        record: 0,
        winHeight: 600
    }
    game.levelsInfo[3] = {
        record: 0,
        winHeight: 600
    }
    game.levelsInfo[4] = {
        record: 0,
        winHeight: 600
    }
    game.levelsInfo[5] = {
        record: 0,
        winHeight: 600
    }
 
    game.audioConfig = {
        mute: false,
        volume: 1,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: true,
        delay: 0,
      };
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
