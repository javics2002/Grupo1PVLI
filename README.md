# Vertigo Tower
[¡Juégalo aquí!](https://javics2002.github.io/Grupo1PVLI/)

[Comprueba el estado del desarrollo](https://www.pivotaltracker.com/n/projects/2534253)

**VERTIGO TOWER**

![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 001](https://user-images.githubusercontent.com/61164466/146969488-f17adf7b-a364-468a-9384-410445056432.png)


Grupo 1

- Jonathan Sebastián Andrade Gordillo
- Daniel Alonso Hernandez
- Pablo Arredondo Nowak
- Javier Cano Salcedo



**ASPECTOS GENERALES**


**Resumen en una frase**

Subir pisos de la torre para alcanzar a Judy antes de que caiga en un simple juego en red de plataformas 2D contrarreloj inspirado en la película Vertigo de 1958.


**Fases de una Partida Típica**

Empezamos en el menú principal, con una imagen de fondo y con un único botón de *Play*.

Una vez pulsemos en él, veremos el menú de selección de niveles, y elegiremos una de las torres disponibles(si es la primera vez que inicias el juego, solo está disponible la primera). En ellas, veremos inicialmente a Judy a punto de caerse y la cámara desciende hasta el primer piso, donde se encuentra el jugador. Tras 3 segundos, comienza la partida. La partida se basa en subir pisos (al subir escaleras), en los que, generalmente, tendremos que resolver ciertos puzzles para poder avanzar.

Durante la partida, vemos en la zona izquierda de pantalla a la sombra, ascendiendo a velocidad constante. 

El objetivo general de la partida es llegar a Judy antes de que llegue la sombra, en cuyo caso superaremos el nivel, accediendo directamente al siguiente (si lo hay), repitiendo la secuencia ya explicada; y en caso contrario el jugador perderá, pudiendo ver como Judy cae desde lo alto del último piso. Tras esto se reinicia automáticamente el nivel, empezando directamente desde abajo (sin la cinemática que muestra a Judy y la torre).


**Experiencia Deseada**

Se busca un desafío de plataformas ligero, al que se añade un factor de resolución de problemas, basados en la interacción con el entorno, ya sea moviendo cajas o arreglando escaleras, para así poder continuar.

Se buscan sesiones de juego cortas. El atractivo no es solo completar todos los niveles, sino mejorar el récord personal de tiempo en cada uno.


Arquitectura del Juego


**JUGABILIDAD**

**Mecánicas del Personaje Jugable**

Movimiento horizontal del jugador a velocidad constante (valor relativo 1) pulsando las teclas A y D para moverse a izquierda y derecha respectivamente. Los cambios de velocidad son instantáneos.

Además, el jugador puede saltar presionando la tecla espacio (pulsar A y D permite al jugador moverse en el aire igual que si se estuviera en el suelo, a velocidad relativa 1 constante y cambios instantáneos). La altura máxima del salto es aproximadamente 3 veces el jugador. Se trata de un salto amplio que permite bastante movimiento horizontal, creado por un impulso hacia arriba. Si soltamos el botón antes de empezar a caer, un impulso extra hacia abajo nos ayudará a llegar antes al suelo. Sólo se puede saltar una vez por pulsación. El salto cuenta con Coyote Time: podemos saltar incluso un poco después de salirnos de una plataforma; y con buffer: si saltamos de nuevo poco antes de aterrizar, el jugador saltará al aterrizar automáticamente para facilitar la encadenación de saltos.

El jugador puede interactuar con diferentes elementos del escenario, que se distinguen estéticamente del fondo por los colores y los bordes.

![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 002](https://user-images.githubusercontent.com/61164466/146969531-b17a98e1-8ff5-4901-a25a-88f4306f2f32.png)


Las posibles interacciones son:

- **Subir escaleras**: al estar delante de una nos agarraremos a ella. Con los botones de dirección verticales podremos subir o bajar por ella, y con los botones de dirección horizontales podremos movernos hasta salirnos de ella. Todos estos movimientos tienen una velocidad relativa 1.![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 003](https://user-images.githubusercontent.com/61164466/146969569-c76b94b2-0b5d-4c81-9c74-f31fa2ce5d9d.png)


- **Empujar cajas**: al andar contra ellas empujaremos una caja a velocidad relativa 0,5.

- **Agarrar** **fragmentos de escalera** al contacto, que se usan para resolver puzles sencillos. Una vez agarrado, el fragmento de escalera aparecerá sobre la cabeza del jugador. ![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 004](https://user-images.githubusercontent.com/61164466/146969594-1c8bf503-2298-477f-8db1-7687ac3271f1.png)

- **Arreglar escaleras:** tocándolas con el fragmento de escalera cogido. Esta acción “gasta” el fragmento de escalera. ![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 005](https://user-images.githubusercontent.com/61164466/146969664-f3585faf-0163-4055-98f2-c7378f4e9ece.png)


- **Agarrarse a una cuerda,** tocándola en el aire. El jugador puede balancearse con las teclas de dirección cuando Scottie está agarrado en ella. Si no, se quedará quieta. El jugador se puede soltar saltando.

Una vez el jugador alcance el piso superior, ganará automáticamente (salvando a Judy) y pudiendo pasar al siguiente nivel. En caso de que haya completado todos los niveles se volverá al menú de selección de torre.

Desde este menú podremos compartir nuestro récord en cada torre a través de Twitter, gracias a un botón que aparecerá al lado del récord.

El estado del jugador se determina mediante estos parámetros:

- Agarrado a una Cuerda (Sí/No)
- Empujando Caja (Sí/No)
- En el Aire (Sí/No) ![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 006](https://user-images.githubusercontent.com/61164466/146969702-cffbd3a9-5194-4635-8a06-c24c52907302.png)

- Con fragmento de Escalera (Sí/No)
- Puede escalar (Si/No)


**Mecánicas del Escenario**

- **Escaleras:** Alcanzar la escalera en un piso te permite avanzar hasta el principio del piso siguiente . Algunas escaleras están rotas, así que necesitamos un fragmento de Escalera (que está en el mismo piso, pero no junto a la escalera) para avanzar. Alcanzar una escalera rota no hace nada. 

![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 007](https://user-images.githubusercontent.com/61164466/146969745-6d0fd96c-47f3-4e02-8626-841c98079ded.png)


- **Fragmentos de Escalera:** Tocar un fragmento de escalera hace que flote sobre la cabeza de Scottie hasta librarnos de él, tocando una escalera rota. El fragmento de escalera se coloca automáticamente sobre la escalera rota al contacto del jugador con ella, arreglándola. Una vez arreglada, la escalera se comporta como cualquier otra, nos permite avanzar al siguiente nivel. ![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 008](https://user-images.githubusercontent.com/61164466/146969759-ed326203-3521-41c1-9803-e8d659f4ca0e.png)

- **Cajas:** Cuando Scottie anda contra una caja, la empuja y reduce su propia velocidad de movimiento horizontal. 

- **Cuerdas:** Las cuerdas cuelgan del techo. Al tocar una, Scottie se agarra automáticamente a la altura a la que la haya tocado (tocar un punto alto de la cuerda no hace que Scottie baje al extremo inferior para balancearse). Agarrarse a una cuerda bloquea el movimiento normal, y lo cambia a aplicar una fuerza hacia la izquierda y a la derecha para conseguir un balanceo como un columpio. Para soltar la cuerda, se pulsa el botón de salto. Esto hace que Scottie salte desde la cuerda y desbloquea al instante las teclas de movimiento horizontal. El salto es igual que uno desde el suelo: sin pulsar una tecla de movimiento horizontal, Scottie salta hacia arriba, no se aplica inercia. ![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 009](https://user-images.githubusercontent.com/61164466/146969995-3fb04f7a-5459-41e4-b881-54264aeb4b36.png)


![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 010](https://user-images.githubusercontent.com/61164466/146970016-89a5799b-fbd7-49cb-ab09-a202c94cacec.png)


**Tiempo Récord**

`	`Si terminamos una torre por primera vez, o más rápido que nunca, se actualizará nuestro tiempo récord de ese nivel, y se quedará reflejado en el menú de selección de niveles. Estos tiempos se guardan en nuestro navegador, por lo que podremos conservarlos entre sesiones.


**Enemigos![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 011](https://user-images.githubusercontent.com/61164466/146970044-438c6156-6c1d-4f47-b9eb-8383c476e036.png)
**

Sombra: Sube por una escalera de caracol a la izquierda de la pantalla. Si llega a la cima antes que el jugador, el jugador pierde. No se interactúa con ella de ninguna otra manera.

Si la sombra se sale de la pantalla (por estar muy arriba o muy abajo), una flecha al borde apunta hacia ella.

Cumple el papel de timer, representa el tiempo restante antes de perder.


**Controles**


|**Movimiento Horizontal**|**Teclas A y D**|**Flechas Izquierda y Derecha**|
| - | - | - |
|**Salto**|**Tecla Espacio**|**Tecla W**|**Flecha Arriba**|



**Cámara**

Al empezar un nivel, la cámara comienza en lo alto de la torre, mostrando a Judy y descendiendo verticalmente mediante una animación hasta la planta baja donde empezamos. Durante el resto de la partida, la cámara se centra en la fracción de la torre en el que estamos. Si el jugador se mueve de esta fracción, la cámara se moverá hacia donde esté Scottie. También se puede ver un pequeño fragmento del piso siguiente y el anterior. A la izquierda, la sombra avanza verticalmente a velocidad constante, y a la derecha, el cielo (o suelo, si estamos en el primer piso), por donde veremos caer a Judy si la sombra llega a la cima antes que nosotros.

Si la fracción es más grande que el tamaño del canvas, la cámara tendrá libertad de movimiento vertical dentro de esa fracción, siguiendo a Scottie.

![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 013](https://user-images.githubusercontent.com/61164466/146970107-c341d36e-e648-4569-aaca-3bebf5f4e984.png)


**Dinámica**

Debemos subir a la torre para agarrar a Judy antes de que la sombra la asuste. Para subir los pisos, debemos alcanzar escaleras, que a veces están rotas, ayudándonos de cuerdas y cajas para llegar a ellas.

Una sombra sube a asustarla para hacerla caer. Vemos esa sombra a la izquierda de la pantalla, volando hacia arriba. En caso de que ésta llegue a Judy antes que nosotros, perdemos, reiniciando el nivel.

Cuando llegamos a rescatarla, empezamos el siguiente nivel con una torre más difícil. Así seguiremos hasta que acaben las 5 torres.

![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 014](https://user-images.githubusercontent.com/61164466/146970206-c54bdb98-d80f-4f9e-9c59-a5a615d642fc.png)


En caso de que no haya niveles restantes, el jugador regresa al menú principal donde podrá repetir sus niveles para mejorar sus tiempos récord en ellos.

- **Victoria:** Llegamos al último piso de la torre. Rescatamos a Judy y empieza el siguiente nivel, si lo hay.


- **Derrota:** La sombra llega antes de nosotros a Judy y la hace caer. La vemos caer y hacer un agujero en el suelo propio de los dibujos animados. El nivel vuelve a comenzar directamente.

![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 015](https://user-images.githubusercontent.com/61164466/146970258-1704eb5f-0579-45a6-96a8-52b1b0f5ff91.png)
**Estética![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 016](https://user-images.githubusercontent.com/61164466/146970319-dd0840f5-b6f7-42d4-acac-7724499133c3.png)
**

Tiene un estilo cartoon, inspirado en animaciones de los años 50 y anteriores, ya que Vertigo es del año 1958. Los personajes tienen proporciones Chibi. El juego es a color, pero todos los tonos son poco saturados.



El protagonista es Scottie, y la mujer a punto de caer es Judy.

![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 017](https://user-images.githubusercontent.com/61164466/146970344-5a5fcf01-81ab-4f0f-9f85-b21a3c8236dd.png)
![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 018](https://user-images.githubusercontent.com/61164466/146970345-f78aae76-db30-4c4b-a339-dc08cb40c1fc.png)
![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 019](https://user-images.githubusercontent.com/61164466/146970347-1ceba1af-11a9-46c6-ab8e-54b50b9cffbe.png)


La torre está hecha de ladrillos y las escaleras de madera. El exterior está nublado.![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 020](https://user-images.githubusercontent.com/61164466/146970383-78904961-574d-47a1-8028-85093e7a35fb.png)


La banda sonora está sacada de la película. En el menú, sonará *Prelude and Rooftop*. En la torre, sonará un fragmento de *Farewell and The Tower* de manera que llegue al clímax siempre en el momento que la sombra tire a Judy y perdamos, es decir, que cuanto más alto sea el tiempo límite, antes se empezará en la canción para terminar siempre sincronizados. La canción ha sido acelerada para aumentar

Al ganar una torre, sonará un pequeño fragmento de *Scene D'Amour*, también acelerado.

Los sonidos incluidos en el juego son:

- Salto: suena cada vez que el jugador salta
- Empujar caja (Credit: **All Sounds**): suena cuando empujamos una caja
- Coger fragmento de escalera: suena cuando cogemos un fragmento de escalera
- Arreglar escalera: suena cuando gastamos un fragmento de escalera en reparar una
- Subir por una escalera (Credit: **All Sounds**): suena cuando subimos por una escalera
- Judy gritando (Credit: Nintendo): suena en la cinemática inicial.
- Judy cayendo (Sacado de la película): suena cuando perdemos
- Judy estampandose (Credit: Warner Bros): suena cuando perdemos

![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 021](https://user-images.githubusercontent.com/61164466/146970405-7fb0783f-2ff1-4759-9ab4-5004cf6519e4.png)

**MENÚS Y MODO DE JUEGO**

**Selección de Niveles (Torres)**

Menú principal simple, solo con el botón de PLAY, que nos lleva a un menú de selección de niveles para que podamos seleccionar directamente la torre en la que queremos intentar batir nuestro récord. En este menú podemos consultar nuestro récord individual (tiempo) en cada una de las torres. Cada torre se representará con una columna como esta:


**Interfaz in-game**

![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 022](https://user-images.githubusercontent.com/61164466/146970429-7f666213-b95b-4816-8c68-472a613e4c5a.png)

Antes de iniciar partida solo está el botón de play en la zona inferior de la pantalla. Se entra al nivel al hacer click en la misma.

Durante el juego tenemos acceso a ciertas funciones e información:

- En la esquina superior izquierda hay un botón de salir al menú y un botón de sonido bajo el cronómetro permite silenciar el juego.![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 023](https://user-images.githubusercontent.com/61164466/146970441-b59ea43e-7aed-4c79-aa7b-0c8a3a3afd0c.png)


- En la esquina superior derecha se encuentra el número de la torre actual, debajo un cronómetro ascendente que mide el tiempo de la partida y el límite de tiempo en rojo.![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 024](https://user-images.githubusercontent.com/61164466/146970479-bf255653-81fc-420a-b653-d69afa99e8a4.png)
![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 025](https://user-images.githubusercontent.com/61164466/146970483-9155baff-16dd-4e05-9149-99e355703faa.png)


Además, cuando la sombra se encuentre fuera del rango de la cámara, se mostrará una flechita apuntando hacia arriba en caso de que la sombra vaya por delante o hacia abajo en caso de que vayamos por delante nosotros.


**CONTENIDO**

**Historia**

![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 026](https://user-images.githubusercontent.com/61164466/146970513-5b544b22-bf58-441e-9623-43722879e58e.png)


Judy necesita ayuda para no caerse de la torre, y una sombra maligna quiere asustarla para hacerla caer. Debemos llegar a la cima antes que la sombra para salvarla. 


**Niveles**

El juego cuenta con 5 niveles predefinidos . Cada torre es un nivel, que se compone de varios pisos. Cada torre es una escena, así que todos los pisos de una torre son parte de una misma escena.

La torre 1 es la más fácil de todas, y pretende ser la toma de contacto con las mecánicas básicas del juego.

La torre 2 presenta las cajas y las escaleras rotas como forma de avanzar por la torre.

La torre 3 introduce las cuerdas.

La torre 4 ya complica las posibilidades, presentando caminos alternativos que harán pensar al jugador cual elegir, además de pequeñas necesidades de backtracking.

La torre 5 es la más difícil, y no tiene ninguna escalera arreglada (excepto la final obligatoria). Esta torre se tiene que escalar con el plataformeo.

![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 027](https://user-images.githubusercontent.com/61164466/146970540-e80e67f4-2488-4da6-ada5-0c6eafa93f70.png)
![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 028](https://user-images.githubusercontent.com/61164466/146970542-741037a3-dcc0-4264-9ac3-0b51ca42edfa.png)
![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 029](https://user-images.githubusercontent.com/61164466/146970543-5fdc7859-2aa2-4bfb-b824-99438fd229f3.png)
![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 030](https://user-images.githubusercontent.com/61164466/146970545-6171e571-99e2-40d8-ab61-71ee062763f7.png)
![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 031](https://user-images.githubusercontent.com/61164466/146970539-99b303de-52b7-458b-bb0f-1bebd1dbca24.png)

Torres de 1 a 5, de menor a mayor.

**Personajes**

Scottie, el protagonista.

Judy, la mujer en apuros en la cima de la torre.

![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 032](https://user-images.githubusercontent.com/61164466/146970619-1c8ba390-195a-4687-a4b3-a03c6d5449f4.png)
![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 033](https://user-images.githubusercontent.com/61164466/146970621-d6adb0bc-41cf-4290-bcbc-3f5a5ae2d9de.png)


La sombra, que sube la torre para tirar a Judy.

![Aspose Words e19c3987-c387-41b0-8837-c9e1790f7a7c 034](https://user-images.githubusercontent.com/61164466/146970651-19548848-f9c5-4de3-938d-3c0789d797c3.png)


**Gestión y comunicación**

Se ha usado Pivotal Tracker para la gestión del desarrollo y WhatsApp y Discord para la comunicación entre los desarrolladores.

Hemos seguido iteraciones de trabajo semanales, en las que intentábamos quedar 2 días a la semana, para revisar cómo va cada uno y planear las siguientes iteraciones.

Para el control de versiones, hemos utilizado GitHub.

**Otra info relevante:** redes sociales.

Tenemos una cuenta de Twitter en la que hemos compartido de vez en cuando avances importantes sobre el desarrollo, y algún que otro meme.

**REFERENCIAS**

Vertigo (Alfred Hitchcock, 1958) - Ambientación

Cuphead, cortos de Oswald The Lucky Rabbit y de Mickey Mouse - Estilo

Donkey Kong (Original) - Jugabilidad

### UML
![vertigo_tower_uml](https://user-images.githubusercontent.com/61164466/146971961-5dd78751-9db7-4ab8-aaef-4c9d46d13043.png)

### Enlaces Importantes
Página del juego https://javics2002.github.io/Grupo1PVLI/

Pivotal Tracker https://www.pivotaltracker.com/n/projects/2534253
