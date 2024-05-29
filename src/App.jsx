import { useState, useEffect } from 'react'
import { Deck } from './assets/casitarobada'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from './itemTypes'

import './App.css'

function Card({card}){

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { card },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult()
      if (item && dropResult) {
        for (let key in dropResult){
          console.log("key is ", key, " value is ", item[key] );
        }
        alert(`You dropped ${item.value} into ${dropResult.name}!`)
//       dropResult.setWell([...dropResult.well, item.card])
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))
  
  return (
    <div ref={drag}>
    
    <div className='cardBody'>
      
     
      
      {card.value}{card.suit}
     
      </div>
    
    </div>
  )
}

function App() {
  const [cards, setCards] = useState([])
  const [turn, setTurn] = useState(true)
  const [playerA, setA] = useState({name: "A", hand:[], house:[]})
  const [playerB, setB] = useState({name: "B", hand:[], house:[]})
  const [well, setWell] = useState([])

  function Player({player, setPlayer, dealCard, stealFromWell, dropToWell, name, other, setOther, turn}){
    
    return(
      <div className={turn ? "player red" :"player blue"}>
        <div> {name}</div>
        
        {
          player.hand.length < 1 ? <button onClick={()=> dealCard(player,setPlayer)}>deal</button>:""
        }
        
      <div className="hand">

      {player.hand.length 
      
      ? player.hand.map( (card, index) => {
          return (
           
           
                <div className='playingCard' key={card.id}>
              <div className='cardButton' onClick={()=>dropToWell(player, setPlayer, card)}>⬇️</div>
              <Card card={card} key={index} />
              <div className='cardButton' onClick={()=>stealFromWell(player, setPlayer, card)}>⬆️</div>
              <div className='cardButton' onClick={()=>stealHouse(player, setPlayer, card, other, setOther)}>🏚️</div>
            </div>


           
                        )}) 
      
      : ""
      }

      </div>
      <div>house {player.house.length}</div>
      <div className="deck">
        {
          player.house.map(c => <div className='cardback'></div>)
        }
      </div>
      {
      player.house.length > 0 
      ?  <Card card={player.house[player.house.length-1]}/>
      :""
      }
      
      <div>other house</div>
      
      {
        other && other.house.length > 0
        ? <Card card={other.house[other.house.length-1]} />
        :""
      }
      
      </div>
    )
  
  }

  function Well({well, setWell}) {
    
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
      accept: ItemTypes.CARD,
      drop: () => ({name:'well'}),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }))


    return(
     
      <div ref={drop} className='well' data-name="well">

       {
       well.length 
          ? well.map( (card, index) => <Card card={card} key={index} />) 
          : <button onClick={dealToWell}>deal to Well</button>
        }

       </div>
    )


  }
  

 
  
  const dealCard = ( player, setPlayer ) => {
    let cardsToAdd = cards.slice(-3)
    setPlayer({hand:[...player.hand, ...cardsToAdd], house: player.house})
    setCards([...cards.slice(0,-3)])

  }
  
  const dealToWell = () => {
    let cardsToAdd = cards.slice(-4)
    setWell([...well, ...cardsToAdd])
    setCards([...cards.slice(0,-4)])
  }

  const stealFromWell = (player, setPlayer, card) =>{
    const target = well.find(wellCard => wellCard.value == card.value)
    if (target){
      let newHand = player.hand.filter(handCard => handCard.id !== card.id)
      let newHouse = [...player.house, card, target]
      setPlayer({hand:newHand, house:newHouse})
      let newWell = well.filter(wellCard => wellCard.id !== target.id)
      setWell([...newWell])
      setTurn(!turn)
    }
  }

  const stealHouse = (player, setPlayer, card, other, setOther) => {
      if( other.house[other.house.length-1].value == card.value){
          let newHouse = [...player.house, ...other.house]
          let newHand = player.hand.filter(playercard => playercard.id !== card.id)
          setPlayer({house: [...newHouse], hand:[...newHand]})
          setOther({house:[], hand:[...other.hand]})
          setTurn(!turn)
      }
  }

  const dropToWell = (player, setPlayer, card) => {
    setWell([...well, card])
    let newHand = player.hand.filter(handCard => handCard.id !== card.id)
    setPlayer({hand:newHand, house:player.house})
    setTurn(!turn)
  }

  useEffect(() => {
    
    let deck = new Deck;
    deck.shuffle()
    setCards(deck.cards)

  }, [])

  //console.log("cards", cards);
  
  return (
    <>
    <div >
      deck {cards.length}
    </div>
    

    <div className="deck">
    {
     // cards.length > 0 ? <Card card={cards[cards.length-1]} /> : ""
     cards.length > 0 && cards.map(c => <div key={c.id} className='cardback'> </div>)
    }
    </div>

    
    <Well well={well} />
   
    
    
    <div className="players">
    {
      turn 
      ? <Player 
          player={playerA} 
          setPlayer={setA} 
          dealCard={dealCard} 
          stealFromWell={stealFromWell} 
          dropToWell={dropToWell}
          stealHouse={stealHouse}
          name="A"
          other={playerB}
          setOther={setB}
          turn={turn}/>
      : <Player 
          player={playerB} 
          setPlayer={setB} 
          dealCard={dealCard} 
          stealFromWell={stealFromWell} 
          dropToWell={dropToWell}
          stealHouse={stealHouse}
          name="B" 
          other={playerA}
          setOther={setA}
          turn={turn}/>
    }
   
    
    

    </div>
    
    
   
    
    </>
  )
}

export default App
