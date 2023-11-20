//Example fetch using pokemonapi.co

class GuessingGame {
  constructor() {
    // TODO - make some properties private 
    this.pokemon = ''; // lowercase name
    this.capitalized = '';
    this.score = 0;
    this.highScore = 0;
    this.outs = 3; // Incorrect attempts remaining
    this.correct = false;
    this.history = [];
    this.displayScore();
    this.choices = [];
    this.pokemonNames = [
      "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon",
      "Charizard", "Squirtle", "Wartortle", "Blastoise", "Caterpie",
      "Metapod", "Butterfree", "Weedle", "Kakuna", "Beedrill", "Pidgey",
      "Pidgeotto", "Pidgeot", "Rattata", "Raticate", "Spearow", "Fearow",
      "Ekans", "Arbok", "Pikachu", "Raichu", "Sandshrew", "Sandslash",
      "Nidoran♀", "Nidorina", "Nidoqueen", "Nidoran♂", "Nidorino",
      "Nidoking", "Clefairy", "Clefable", "Vulpix", "Ninetales",
      "Jigglypuff", "Wigglytuff", "Zubat", "Golbat", "Oddish", "Gloom",
      "Vileplume", "Paras", "Parasect", "Venonat", "Venomoth", "Diglett",
      "Dugtrio", "Meowth", "Persian", "Psyduck", "Golduck", "Mankey",
      "Primeape", "Growlithe", "Arcanine", "Poliwag", "Poliwhirl",
      "Poliwrath", "Abra", "Kadabra", "Alakazam", "Machop", "Machoke",
      "Machamp", "Bellsprout", "Weepinbell", "Victreebel", "Tentacool",
      "Tentacruel", "Geodude", "Graveler", "Golem", "Ponyta", "Rapidash",
      "Slowpoke", "Slowbro", "Magnemite", "Magneton", "Farfetch'd",
      "Doduo", "Dodrio", "Seel", "Dewgong", "Grimer", "Muk", "Shellder",
      "Cloyster", "Gastly", "Haunter", "Gengar", "Onix", "Drowzee",
      "Hypno", "Krabby", "Kingler", "Voltorb", "Electrode", "Exeggcute",
      "Exeggutor", "Cubone", "Marowak", "Hitmonlee", "Hitmonchan",
      "Lickitung", "Koffing", "Weezing", "Rhyhorn", "Rhydon", "Chansey",
      "Tangela", "Kangaskhan", "Horsea", "Seadra", "Goldeen", "Seaking",
      "Staryu", "Starmie", "Mr. Mime", "Scyther", "Jynx", "Electabuzz",
      "Magmar", "Pinsir", "Tauros", "Magikarp", "Gyarados", "Lapras",
      "Ditto", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Porygon",
      "Omanyte", "Omastar", "Kabuto", "Kabutops", "Aerodactyl", "Snorlax",
      "Articuno", "Zapdos", "Moltres", "Dratini", "Dragonair", "Dragonite",
      "Mewtwo", "Mew"
    ];
    
  }

  random() {
    // Generate an id number for a random pokemon
    let number = Math.ceil(Math.random() * 151);

    while ( this.history.includes(number) ) {
      number = Math.ceil(Math.random() * 151);
    }
    
    return number;

  }

  setup() {
    // Get a random pokemon based on id number
    const number = this.random();
    const url = `https://pokeapi.co/api/v2/pokemon/${number}`;
    this.history.push(number);

    fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        this.choices = [];
        this.pokemon = data.name;
        console.log(this.pokemon);
        console.log(this.history);
        // Capitalize word
        this.capitalized = this.capitalize(this.pokemon);
        this.choices.push(this.capitalized);

        this.getScore();

        // Images of pokemon
        const dream = data.sprites.other['dream_world']['front_default'];
        const official = data.sprites.other['official-artwork']['front_default']
        document.querySelector('img').style.visibility = 'visible';
        
        // Use official image if dream is not present
        if (dream !== null) {
          document.querySelector('img').src = dream;
          document.querySelector('img').alt = `An image of a Pokemon in a soccer stadium.`;
        } else {
          document.querySelector('img').src = official;
          document.querySelector('img').alt = `An image of a Pokemon in a soccer stadium.`;
        }

        document.querySelector('img').style.filter = 'grayscale(100%) brightness(0)';
        this.displayChoices();
      })
      .catch(err => {
        console.log(`error ${err}`)
      });
  }

  checkWin(name) {
    const text = name;

    if (text.toLowerCase() === this.pokemon) {
      this.correct = true;
      this.score++;
      this.displayScore();

      if ( this.score > this.highScore ) {
        this.highScore = this.score;
        this.store();
      }

      document.querySelector('h3').setAttribute('hidden', '');
    } else {
      this.correct = false;
      document.querySelector('h3').removeAttribute('hidden');
      document.querySelector('h3').innerText = 'WRONG! Try again.';
      this.outs--;
      this.displayScore();


      if (this.isOver()) {
        this.highScore = this.score;
        this.store();
        document.querySelector('h3').setAttribute('hidden', '');
        document.querySelector('img').style.visibility = 'hidden';
        document.querySelector('h2').removeAttribute('hidden');
        document.querySelector('h2').innerText = 'GAME OVER.';
        document.querySelector('h4').removeAttribute('hidden');
        document.querySelector('h4').innerText = 'Play Again?';
      }


    }
  }

  isOver() {
    if (this.outs === 0) {
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

    document.querySelector('h3').setAttribute('hidden', '');
    document.querySelector('h4').setAttribute('hidden', '');
    this.showPokemon();
  }

  showPokemon() {
    document.querySelector('h2').setAttribute('hidden', '');
    this.setup();
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
    if (score !== null) {
      document.querySelector('#high').innerText = `High Score: ${JSON.parse(score)}`;
    }
  }

  capitalize(name) {
    const letters = name.split('');
    letters[0] = letters[0].toUpperCase();

    const capital = letters.join('');
    return capital
  }

  getChoices() {
    let num = this.random() - 1;
    let pokemon = this.pokemonNames[num];
    
    while ( this.choices.length < 4 ) {
      if ( pokemon !== this.capitalized )  {
        this.choices.push(pokemon);
      }
      num = this.random() - 1
      pokemon = this.pokemonNames[num];
    }
  }

  randomize() {
    let arr = [];
    let choices = [];
    let num = Math.floor(Math.random() * 4);
  
    while (arr.length < 4) {
      if (!arr.includes(num)) {
        arr.push(num);
      }
  
      num = Math.floor(Math.random() * 4)
    }
    
    for ( let i = 0; i < this.choices.length; i++ ) {
      choices[arr[i]] = this.choices[i];
    }

    this.choices = choices;
  }

  displayChoices() {
    const buttons = document.querySelectorAll('button');
    
    this.getChoices();
    this.randomize();

    for ( let i = 0; i < buttons.length; i++ ) {
      document.querySelector(`#btn${i}`).removeAttribute('hidden');
      document.querySelector(`#btn${i}`).innerText  = this.choices[i];
    }
  }

  reveal() {
    document.querySelector('img').style.filter = '';
  }

}
const game = new GuessingGame();
game.setup();

document.querySelector('h4').addEventListener('click', () => game.reset());

for ( let i = 0; i < 4; i++ ) {
  document.querySelector(`#btn${i}`).addEventListener('click', () => {
    let name = document.querySelector(`#btn${i}`).innerText;
    if (game.outs > 0) {
      game.checkWin(name);

      if (game.correct === true) {
        game.reveal();
        setTimeout(() => game.showPokemon() , 2000);
      }
    }
  });
}