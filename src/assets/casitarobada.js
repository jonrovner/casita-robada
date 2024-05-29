

export class Player {
  constructor(name){
    this.name = "player"+name
    this.hand = []
    this.house = []
  }
}

export class Game {
  constructor(numberOfPlayers) {
    this.deck = new Deck;
    
    this.players = new Array(numberOfPlayers)
    this.turn = 0
    
    for (let i = 0; i < numberOfPlayers; i++) {
      const player = new Player(i)
      this.players[i] = player
    }
    this.well = []
    this.deck.shuffle()
    this.deck.deal(this)
    
  }

  play(move){

    const {mode, player, card, target} = move
    
    if (mode == "steal"){

      if (target == "well"){
        player.house.push(card, well.find(wellCard => wellCard.value == card.value))
  
      }
      if (target == "house"){
        
        const targetPlayer = this.players.find(targetPlayer => targetPlayer.name !== player.name)
        
        if (targetPlayer.house[targetPlayer.house.length-1].value == card.value){
          player.house.push(...targetPlayer.house, card)
          targetPlayer.house = []
        }
  
      }

    }

    else if (mode == "drop"){

      if (target == "house"){
        player.house.push(card)
        //player.hand = player.hand.filter(handCard => handCard.value !== card.value )
      }

      if (target == "well"){
        this.well.push(card)
      }
    }
    const newHand = player.hand.filter( playerCard => playerCard.id !== card.id)
    player.hand = newHand
  }

}

export class Deck {

  constructor(){
    
    this.cards = [
      {
        "suit": "❤️",
        "value": 2
      },
      {
        "suit": "❤️",
        "value": 3
      },
      {
        "suit": "❤️",
        "value": 4
      },
      {
        "suit": "❤️",
        "value": 5
      },
      {
        "suit": "❤️",
        "value": 6
      },
      {
        "suit": "❤️",
        "value": 7
      },
      {
        "suit": "❤️",
        "value": 8
      },
      {
        "suit": "❤️",
        "value": 9
      },
      {
        "suit": "❤️",
        "value": 10
      },
      {
        "suit": "❤️",
        "value": "J"
      },
      {
        "suit": "❤️",
        "value": "Q"
      },
      {
        "suit": "❤️",
        "value": "K"
      },
      {
        "suit": "❤️",
        "value": "A"
      },
      {
        "suit": "♦️",
        "value": 2
      },
      {
        "suit": "♦️",
        "value": 3
      },
      {
        "suit": "♦️",
        "value": 4
      },
      {
        "suit": "♦️",
        "value": 5
      },
      {
        "suit": "♦️",
        "value": 6
      },
      {
        "suit": "♦️",
        "value": 7
      },
      {
        "suit": "♦️",
        "value": 8
      },
      {
        "suit": "♦️",
        "value": 9
      },
      {
        "suit": "♦️",
        "value": 10
      },
      {
        "suit": "♦️",
        "value": "J"
      },
      {
        "suit": "♦️",
        "value": "Q"
      },
      {
        "suit": "♦️",
        "value": "K"
      },
      {
        "suit": "♦️",
        "value": "A"
      },
      {
        "suit": "♣️",
        "value": 2
      },
      {
        "suit": "♣️",
        "value": 3
      },
      {
        "suit": "♣️",
        "value": 4
      },
      {
        "suit": "♣️",
        "value": 5
      },
      {
        "suit": "♣️",
        "value": 6
      },
      {
        "suit": "♣️",
        "value": 7
      },
      {
        "suit": "♣️",
        "value": 8
      },
      {
        "suit": "♣️",
        "value": 9
      },
      {
        "suit": "♣️",
        "value": 10
      },
      {
        "suit": "♣️",
        "value": "J"
      },
      {
        "suit": "♣️",
        "value": "Q"
      },
      {
        "suit": "♣️",
        "value": "K"
      },
      {
        "suit": "♣️",
        "value": "A"
      },
      {
        "suit": "♠️",
        "value": 2
      },
      {
        "suit": "♠️",
        "value": 3
      },
      {
        "suit": "♠️",
        "value": 4
      },
      {
        "suit": "♠️",
        "value": 5
      },
      {
        "suit": "♠️",
        "value": 6
      },
      {
        "suit": "♠️",
        "value": 7
      },
      {
        "suit": "♠️",
        "value": 8
      },
      {
        "suit": "♠️",
        "value": 9
      },
      {
        "suit": "♠️",
        "value": 10
      },
      {
        "suit": "♠️",
        "value": "J"
      },
      {
        "suit": "♠️",
        "value": "Q"
      },
      {
        "suit": "♠️",
        "value": "K"
      },
      {
        "suit": "♠️",
        "value": "A"
      }
    ].map( (e, i) => {
      return { suit: e.suit, value: e.value, id: i}
    })
    
  }
  
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
    
  }
  
  deal(game){
    for (let i = 0; i < 3; i++){
      game.players.forEach(player => {
        player.setHand(this.cards.pop())
      })
    }
    
    if (game.well.length < 1){
      for (let i = 0; i < 4; i++){
        game.well.push(this.cards.pop())
      }
    }
  }
}

//let game = new Game(2);

//console.log("game", game);
//game.players.forEach(p => console.log(p.name, ": ", p.hand))



