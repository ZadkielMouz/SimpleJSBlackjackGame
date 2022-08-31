
//  Implementando Patrón Módulo
/*
    Esto evita que nuestro código sea posible leerlo o ejecutarlo desde la consola del navegador
    y se pueda acceder a metodos o variables del programa.

    Es recomendable usar el 'use strict' para que sea más eficaz la seguridad.
*/

const gameModule = (() => {
    'use strict'

    /*
    
    * C = CLubs
    * D = Diamonds
    * H = Hearts
    * S = Spades
    
    */

    //Iniciando Variables
    let deck = [];
    const tdeck = ['C', 'D', 'H', 'S'],
        letters = ['A', 'J', 'Q', 'K'];

    // let playerPoints = 0,
    //     computerPoints = 0;
    let playersPoints = [];

    // Referencias del HTML

    const btnGet = document.querySelector('#btnGet'),
        btnStop = document.querySelector('#btnStop'),
        btnNew = document.querySelector('#btnNew');

    const points = document.querySelectorAll('small');

    const playersCards = document.querySelectorAll('.divCards');

    const startGame = (numPlayers = 2) => {

        deck = createDeck();
        playersPoints = [];
        /*
            De acuerdo al número de jugadores, se añaden al array con un 0 que simboliza los puntos iniciales
            de cada jugador.
         */
           
        for (let i = 0; i < numPlayers; i++) {
            playersPoints.push(0);
        }

        points.forEach( elem => elem.innerHTML = 0);

        playersCards.forEach( elem => elem.innerHTML = '');

        btnGet.disabled = false;
        btnStop.disabled = false;
        


    }

    // Funcion para crear el deck
    const createDeck = () => {

        deck = [];

        tdeck.forEach((tdeck) => {
            let i = 2;

            while (i <= 10) {
                deck.push(i + tdeck);
                i++;
            }

            letters.forEach((letter) => {
                deck.push(letter + tdeck);
            });
        });

        return _.shuffle(deck);
    }

    // Función para tomar la carta del mazo
    const getCard = () => {

        if (deck.length == 0) {
            throw "No hay cartas en el deck";
        }

        return deck.pop();
    }


    const cardValue = (card) => {

        const value = card.substring(0, card.length - 1);

        return (isNaN(value))
            ? (value == 'A') ? 11 : 10
            : parseInt(value);
    }

    //Turno: 0 = primer jugador
    //Ultima posición del array = computadora
    const acumulatePoints = (card, turn) => {


        playersPoints[turn] = playersPoints[turn] + cardValue(card);
        points[turn].innerText = playersPoints[turn];

        return playersPoints[turn];
    }

    const createImgCard = (card, turno) => {

        const imgCard = document.createElement('img');
        imgCard.src = `assets/cartas/${card}.png`;
        imgCard.classList.add('carta');
        playersCards[turno].append(imgCard);
    }

    const determinateWinner = () => {

        const [minPoints, computerPoints] = playersPoints;

        // setTimeout(() => {
        if (computerPoints === minPoints) {
            // alert('Nadie gana! :(');
            Swal.fire({
                icon: 'info',
                title: 'Nadie gana :(',
            });
        } else if (minPoints > 21) {
            // alert('Computadora Gana! :(');
            Swal.fire({
                icon: 'error',
                title: 'La computadora Gana :(',
            });
        } else if (computerPoints > 21) {
            // alert('El jugador gana!!');
            Swal.fire({
                icon: 'success',
                title: 'El Jugador Gana!!',
            });
        } else if (computerPoints > minPoints && computerPoints <= 21) {
            Swal.fire({
                icon: 'error',
                title: 'La computadora Gana :(',
            });
        }
        // else {
        //     Swal.fire({
        //         icon: 'success',
        //         title: 'El Jugador Gana!!',
        //     });
        // }
        // }, 200);
    }

    const computerTurn = (minPoints) => {

        let computerPoints = 0;

        do {

            //Se obtiene la carta
            const card = getCard();
            //Se obtiene el valor y se coloca en el HTML
            computerPoints = acumulatePoints(card, playersPoints.length - 1);

            //Se crea la imagen y se coloca en el DOM
            createImgCard(card, playersPoints.length - 1);

            // if (minPoints > 21) {
            //     break;
            // }

        } while ((computerPoints < minPoints) && minPoints <= 21);

        determinateWinner();

    }

    // Eventos

    btnGet.addEventListener('click', () => {

        //Se obtiene la carta
        const card = getCard();
        //Se obtiene el valor y se coloca en el HTML
        const playerPoints = acumulatePoints(card, 0);

        //Se crea la imagen y se coloca en el DOM
        createImgCard(card, 0);

        if (playerPoints > 21) {
            console.warn('Lo siento mucho, perdiste.');
            btnGet.disabled = true;
            btnStop.disabled = true;
            computerTurn(playerPoints);
        } else if (playerPoints === 21) {
            console.warn('21, genial!!');
            btnGet.disabled = true;
            btnStop.disabled = true;
            computerTurn(playerPoints);
        }
    });

    btnStop.addEventListener('click', () => {

        btnGet.disabled = true;
        btnStop.disabled = true;
        computerTurn(playersPoints[0]);
    });

    btnNew.addEventListener('click', () => {
        startGame();
    });

    //En el patrón Modulo, este return hace público lo que coloquemos acá a cualquiera
    //Mientras que todo lo demás permanecerá privado

    return {
        newGame: startGame
    };

})();