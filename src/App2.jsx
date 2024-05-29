import { useState, useEffect, useCallback } from 'react'
import { Deck } from './assets/casitarobada'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from './itemTypes'
import './App.css'

function App2() {

  const [cards, setCards] = useState([])
  const [userHouse, setUserHouse] = useState([])
  const [userHand, setUserHand] = useState([])
  const [machineHouse, setMachineHouse] = useState([])
  const [machineHand, setMachineHand] = useState([])
  const [well, setWell] = useState([])
  const [playerTurn, setPlayerTurn] = useState(true)
  const [isWaiting, showWaiting] = useState(false)

  const getMachineMove = useCallback(() => {
    console.log("getting machine move");
    //try to steal user house
    showWaiting(true)
    
    let target = userHouse[userHouse.length -1]
    let houseStealer = target && machineHand.find( c => c.value == target.value)
    
    if ( houseStealer) {
      console.log("stealing house");
      setTimeout(() => {
        let newHand = machineHand.filter(c => c.id !== houseStealer.id)
      setMachineHand(newHand)
      setMachineHouse([...machineHouse, ...userHouse, houseStealer])
      setUserHouse([])
      setPlayerTurn(true)


      }, 1000);
      showWaiting(false)

      

    } else {
    //try to steal from well
      let handValues = machineHand.map( c => c.value)
      console.log("hand values", handValues)
      showWaiting(true)
      let target = well.find( card => handValues.includes(card.value))
      
      if (target) {        
        console.log("stealing from well");  
        
        let machineCard = machineHand.find( card => card.value == target.value)
        let newHand = machineHand.filter( card => card.id !== machineCard.id)
        setMachineHand(newHand)
        setMachineHouse([...machineHouse, machineCard, target])
        setTimeout(() => {
          setWell(well.filter( card => card.id !== target.id))    
        }, 1000);
        showWaiting(false)
        setPlayerTurn(true)

        
      } else {

        console.log("no target");
        showWaiting(true)
        //drop to well
        setTimeout(() => {
          const cardToDrop = machineHand[0]
        setWell([...well, cardToDrop])
        
        setMachineHand(machineHand.slice(1))
        showWaiting(false)
        setPlayerTurn(true)

          
        }, 1000);  
        
        }
      } 
         

  }, [machineHand, machineHouse, userHouse, playerTurn, isWaiting])
  
  const handleDrop = useCallback((item) => {
    
    let exists = well.find(c => c.id === item.id)
    if (exists) return 

    let cardInWell = well.find(c => c.value == item.value)
    
    if (cardInWell) {
      
      let newWell = well.filter(c => c.id !== cardInWell.id)
      setWell(newWell)
      
      setUserHouse([...userHouse, item, cardInWell])
      
      let newHand = userHand.filter(c => c.id !== item.id)
      setUserHand(newHand)
      setPlayerTurn(false)


    }
    else {
      let newHand = userHand.filter(c => c.id !== item.id)
      setUserHand(newHand)
      setWell([...well, item])
      setPlayerTurn(false)
     
    }
    
  },[well, userHouse, userHand, playerTurn])

  const stealMachineHouse = useCallback((item) => {
    console.log("STALING MACHINE WITH", item);
    if (item.value == machineHouse[machineHouse.length-1].value){
      
      let newHand = userHand.filter( c => c.id !== item.id)
      setUserHand(newHand)
      setUserHouse([...userHouse, ...machineHouse, item])
      setMachineHouse([])
      setPlayerTurn(false)


    }



  },[userHand, userHouse, machineHouse, playerTurn])

  const deal = useCallback(()=>{
      setUserHand(cards.slice(-6,-3))
      setMachineHand(cards.slice(-3))
      setCards(cards.slice(0,-6))

  },[userHand, machineHand, cards])
  

  useEffect(()=>{
    console.log("well updated", well);
  },[well])
  
  
  useEffect(()=> {
    if(!playerTurn){
      getMachineMove()
    }
  }, [playerTurn])



  useEffect(() => {
    
    let deck = new Deck;
    deck.shuffle()
    setMachineHand(deck.cards.slice(3,6))
    setUserHand(deck.cards.slice(0,3))
    setWell(deck.cards.slice(-4))
    setCards(deck.cards.slice(6,-4)
    
  )

  }, [])

  function Card({card}){

    const [{  }, drag] = useDrag(() => ({
      
      type: ItemTypes.CARD,
      item: card,
      end: (item, monitor) => {
        
          
         //card is in item.card
      }
      
    }))
    
    return (
      <div ref={drag} className='cardBody'>
      
        {card.value}{card.suit}
      
      </div>
    )
  }
  
  function Well({well, onDrop}){
  
      
      const [{  }, drop] = useDrop(
          () => ({
            accept: ItemTypes.CARD,
            drop: (item) => onDrop(item)
            
          }),
          [],
        )
        
  
    return (
      <div ref={drop} className='well' >
      
        {
          well.length > 0 && well.map(card => <Card card={card} key={card.id}/> )
        }
        
      </div>
    )
  
  }

  function MachineHouse({house, onDrop}) {

    const [{  }, drop] = useDrop(
      () => ({
        accept: ItemTypes.CARD,
        drop: (item) => onDrop(item)
        
      }),
      [],
    )
    

  return (
    <div ref={drop} className='machinHouse' >
      <div>machine  {house.length}</div>

      {house.length > 0 && <Card card={house[house.length-1]} />}
    </div>
   )   
  }

  function Waiting({show}){

      if (show) return (
        <div className="waiting">
        <h1>🤔</h1>
        </div>
      )

  }

  //console.log("cards", cards);
  
  return (
    
    <div className='app2'>
    <Waiting show={isWaiting}/>
    <div >
      deck {cards.length}
    </div>
    <button onClick={()=>deal()}>deal</button>
    
    <Well well={well} onDrop={handleDrop} />
      hand
      {
        userHand.length && <div className="deck">
        {
          userHand.map(card => <Card card={card} />)
        }
        </div>

      }
    
    <div className="users">
      <div className="user">
        User  {userHouse.length}

      {
        userHouse.length && <Card card={userHouse[userHouse.length-1]} />

      }
      </div>
      <div className="machine">

        {/* <div>machine</div>
        <div className='deck'>
        {
          machineHand.length && machineHand.map( card => <Card card={card} key={card.id} />)
        }

        </div> */}
    
      </div>

      <MachineHouse house={machineHouse} onDrop={stealMachineHouse}/> 

    </div>
    
    
    
    </div>
    
  )
}

export default App2
