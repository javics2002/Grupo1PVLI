# Vertigo Tower
[¡Juégalo aquí!](https://javics2002.github.io/Grupo1PVLI/)

[Comprueba el estado del desarrollo](https://www.pivotaltracker.com/n/projects/2534253)

### Grupo1PVLI
- Jonathan Sebastián Andrade Gordillo
- Daniel Alonso Herranz
- Pablo Arredondo Nowak
- Javier Cano Salcedo

### Aspectos generales
#### Resumen
**Sube pisos del campanario para alcanzar a Judy antes de que caiga en un simple juego en red de plataformas 2D.**

<img src="https://user-images.githubusercontent.com/49459590/135072511-3b6b4c70-94fa-45cd-b950-f45b79f6bdfd.png" width="546" height="502">

#### Partida típica
Empezamos en el menú principal, pulsamos *PLAY*, seleccionamos la torre deseada y comenzamos el nivel. 

Vemos a Judy en lo alto a punto de caerse y todos los pisos que debemos escalar. Avanzamos por los pisos y subimos escaleras, intentando alcanzar a Judy antes que la sombra a la izquierda de la pantalla. Por el camino, encontramos escaleras rotas para reparar, cajas para empujar y/o cuerdas para balancearnos. 

Si conseguimos llegar antes, la rescatamos, se guarda nuestro tiempo y da comienzo el siguiente nivel. Si no lo hay, volvemos al menú de selección de torres para mejorar nuestros tiempos. Por el contrario, si Judy se cae, perdemos el nivel y lo volvemos a comenzar inmediatamente.

#### Experiencia deseada

Se busca un **desafío de plataformas ligero**, al que se añade un factor de resolución de problemas, basados en la interacción con el entorno, ya sea moviendo cajas o arreglando escaleras, para así poder continuar. 

Se buscan **sesiones de juego cortas**, y el progreso no se guarda al terminar una partida. El atractivo no es completar todos los niveles, sino mejorar el récord personal de tiempo en cada uno.

## Jugabilidad

### Mecánicas del personaje jugable

**Movimiento horizontal** del jugador a velocidad constante pulsando las teclas A y D o ← y → para moverse a izquierda y derecha respectivamente.
Además, el jugador puede **saltar** presionando la tecla Espacio (pulsar A y D o ← y → permiten al jugador moverse en el aire)

El jugador puede interactuar con diferentes elementos del escenario, que se distinguen del fondo (por colores y bordes).

Las posibles interacciones son:
- **Subir escaleras**, automáticamente al tacto.
- **Empujar cajas**, al andar contra ellas. Este movimiento es más lento que el movimiento sin carga.
- **Agarrar objetos** como trozos de escalera al contacto, que se usan para resolver puzles sencillos.
- **Arreglar escalera** (tocándola con el trozo de escalera cogido)
- **Agarrarse a una cuerda** (tocándola en el aire). La cuerda se balancea automáticamente, incluso cuando el jugador no está agarrado a ella. El jugador se puede soltar saltando.

Una vez el jugador alcance el piso superior, ganará automáticamente (salvando a Judy) y pudiendo pasar al siguiente nivel. En caso de que haya completado todos los niveles se le mostrará una pantalla de victoria y un botón para volver al menú principal.

#### Atributos del Personaje Jugable

- Velocidad de Movimiento
- Velocidad Empujando una caja
- Altura de Salto
- Tamaño

#### Controles

- Movimiento horizontal: teclas A y D / teclas ← y →
- Salto: tecla Espacio

### Mecánicas del Escenario

- **Escaleras** (pueden estar Rotas)
- **Trozos de Escalera** (arreglan Escaleras Rotas)
- **Cajas**
- **Cuerdas**

### Enemigos

Sombra: Sube por una escalera de caracol a la izquierda de la pantalla. Si llega a la cima antes que el jugador, el jugador pierde. No se interactúa con ella de ninguna otra manera.

Si la sombra se sale de la pantalla (por estar muy arriba o muy abajo), una flecha al borde apunta hacia ella.

Cumple el papel de timer: representa el tiempo restante antes de perder.

### Puntuación

Al terminar un nivel (es decir, una torre), nuestra puntuación se determina según el tiempo que hayamos tardado en completar el nivel. Cada milisegundo que hayamos llegado por delante de la sombra es un punto.

(Ej: Llegar 2 segundos y medio antes que la sombra son 2500 puntos).

### Cámara

Al empezar un nivel, comienza en lo alto de la torre, mostrando a Judy y descendiendo verticalmente hasta la planta baja donde empezamos. A continuación, se centrará en el piso en el que estamos. También se pueden ver una parte del piso siguiente y el anterior. A la izquierda, una escalera de caracol por la que avanza una sombra, y a la derecha, el cielo (o suelo, si estamos en el primer piso), por donde veremos caer a Judy si la sombra llega a la cima antes que nosotros.

<img src="https://user-images.githubusercontent.com/49459590/135069571-b92877be-17d1-4a6a-b9ea-0ca6595f9c09.png" width="512" height="384">

## Dinámica
**Debemos subir a la torre para coger a Judy antes de que se caiga.**
Para subir cada piso, usaremos escaleras, que a veces están rotas, además de cuerdas y cajas para llegar a ellas.
Una sombra sube a asustarla para hacerla caer. Vemos esa sombra a la izquierda de la pantalla, subiendo por una escalera de caracol.
Cuando lleguemos a rescatarla, empezaremos otro nivel con una torre más difícil. Así seguiremos hasta que acaben las *x* torres.
Se guardará el tiempo que hemos tardado en completarlo y se sumará el mejor intento de cada nivel a la puntuación total.

**Victoria:** llegamos al último piso de la torre. Rescatamos a Judy y empieza otro nivel.
**Derrota:** La sombra llega antes de nosotros a Judy y la hace caer. La vemos caer y hacer un agujero en el suelo propio de los dibujos animados. El nivel vuelve a comenzar directamente.

### Estética
Tendrá un **estilo cartoon**, inspirándonos un poco en dibujos animados de los años 50 (porque Vertigo es del 58). Los personajes tendrán proporciones Chibi.
El protagonista es Scottie y la mujer que se agarra en el borde es Judy.

<img src="https://user-images.githubusercontent.com/49459590/134153379-07b1a4f2-81d5-4cfa-b3d4-54f554adbfb5.png" width="400" height="300">

La torre esta hecha de ladrillos y el suelo y escaleras de madera. El exterior es nublado.

## Menús y modo de juego

### Selección de Niveles (Torres)

Menú principal simple, solo con el botón de *PLAY*, que nos lleva a un mapa de selección de niveles para que podamos seleccionar directamente la torre en la que queremos intentar batir nuestro récord. En este menú podemos consultar nuestro **récord individual** en cada una de las torres y la **puntuación total** en una esquina, siendo la suma de todas nuestras puntuaciones máximas.

### Interfaz in-game

Durante el juego tendremos acceso a ciertas funciones e información.

En la esquina superior izquierda hay un botón de salir al menú. 

En la esquina superior derecha se encuentra el número de la torre actual, y debajo un cronómetro ascendente que mide el tiempo de la partida. Un botón de sonido bajo el cronómetro permite silenciar el juego.

La pantalla de victoria mostrará un mensaje de felicitación y la puntuación total.

## Contenido
### Historia

Judy necesita ayuda para no caerse de la torre, y una sombra maligna quiere tirarla. Debemos llegar a la cima antes que ella para salvarla. 

### Niveles

El juego cuenta con *x* niveles predefinidos (por ahora, seguramente 5).
Por defecto la selección de niveles comenzará en el nivel 1, pudiendo avanzar entre niveles libremente.

### Personajes

- Scottie, el protagonista.
- Judy, la mujer en apuros en la cima de la torre.
- La sombra, que sube la torre también para tirar a Judy.

## Referencias

- Vertigo (Alfred Hitchcock, 1958): Ambientación
- Donkey Kong (1981): Jugabilidad
- Cuphead, cortos de Oswald The Lucky Rabbit y de Mickey Mouse: Estilo artístico

### UML
![image]![Untitled Diagram](https://user-images.githubusercontent.com/61164466/142723634-ec560e7d-8a45-4fe8-bba4-d4eace786451.png)



### Enlaces Importantes
Página del juego https://javics2002.github.io/Grupo1PVLI/

Pivotal Tracker https://www.pivotaltracker.com/n/projects/2534253
