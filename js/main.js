//Example fetch using pokemonapi.co

class GuessingGame {
  constructor() {
    // TODO - make some properties private 
    this.pokemon = ''; // lowercase name
    this.capitalized = '';
    this.score = 0;
    this.highScore = 0;
    this.outs = 5; // Incorrect attempts remaining
    this.correct = false;
    this.history = [];
    this.displayScore();
  }

  random() {
    // Generate an id number for a random pokemon
    const number = Math.ceil(Math.random() * 151);

    if ( !this.history.includes(number) ) {
      this.history.push(number); 
      return number;
    }

    return this.random();
  }
  getPokemon() {
    // Get a random pokemon based on id number
    const number = this.random();
    const url = `https://pokeapi.co/api/v2/pokemon/${number}`;

    fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        this.pokemon = data.name;
        // Capitalize word
        const letters = this.pokemon.split('');
        letters[0] = letters[0].toUpperCase();

        const capital = letters.join('');
        this.capitalized = capital;
        
        this.getScore();
        // Images of pokemon
        const dream = data.sprites.other['dream_world']['front_default'];
        const official = data.sprites.other['official-artwork']['front_default']

        // Use official image if dream is not present
        if (dream !== null) {
          document.querySelector('img').src = dream;
          document.querySelector('img').alt = `An image of a Pokemon in a soccer stadium.`;
        } else {
          document.querySelector('img').src = official;
          document.querySelector('img').alt = `An image of a Pokemon in a soccer stadium.`;
        }
      })
      .catch(err => {
        console.log(`error ${err}`)
      });
  }

  checkWin() {
    const text = document.querySelector('input').value;
    if (text.toLowerCase() === this.pokemon) {
      this.correct = true;
      this.score++;
      this.displayScore();
 
      document.querySelector('h3').setAttribute('hidden', true);
      document.querySelector('h2').removeAttribute('hidden');
      document.querySelector('h2').innerText = this.capitalized;
      document.querySelector('input').value = '';
    } else {
      this.correct = false;
      document.querySelector('h3').removeAttribute('hidden');
      document.querySelector('h3').innerText = 'WRONG! Try again.';
      document.querySelector('input').value = '';
      this.outs--;
      this.displayScore();
      

      if( this.isOver() ) {
        this.highScore = this.score;
        this.store();
        document.querySelector('h2').removeAttribute('hidden');
        document.querySelector('h2').innerText = 'GAME OVER.';
        document.querySelector('h3').removeAttribute('hidden');
        document.querySelector('h3').innerText = 'Play Again?';
      }

      
    }
  }

  isOver() {
    if ( this.outs === 0 ) {
      return true;
    }

    return false;
  }

  reset() {
    this.pokemon = ''; 
    this.capitalized = '';
    this.history = [];
    this.score = 0;
    this.outs = 3;

    document.querySelector('h3').setAttribute('hidden', true);
    this.showPokemon();
  }

  showPokemon() {
    document.querySelector('h2').setAttribute('hidden', true);
    document.querySelector('.bot').setAttribute('hidden', true);
    this.getPokemon();
    this.displayScore();
  }
  
  displayScore() {
    document.querySelector('#score').innerText = `Score: ${this.score}`;
    document.querySelector('#outs').innerText = `Lives: ${this.outs}`;
    document.querySelector('#high').innerText = `High Score: ${this.highScore}`;

  }

  store() {
    localStorage.setItem('highScore', JSON.stringify(this.highScore));
  }

  getScore() {
    const score = localStorage.getItem('highScore');
    if ( score !== null ) {
    document.querySelector('#high').innerText = `High Score: ${JSON.parse(score)}`;
    }
  }
}

const game = new GuessingGame();
game.getPokemon();

document.querySelector('h3').addEventListener('click', () => game.reset());
document.querySelector('input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
  
    if ( game.outs > 0 ) {
      game.checkWin();

      if (game.correct === true ) game.showPokemon();
    }
  }

});