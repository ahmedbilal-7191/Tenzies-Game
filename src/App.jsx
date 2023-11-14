import { useEffect, useState } from 'react'
import Die from './Components/Die'
import './App.css'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

function App() {
//tom under stand minutes formula and state for minute to keep track
//idhar ich random number ki jagah random dots generate karna padhta

  const [dice, setDice] = useState(allNewDice())

  const [rollcount,setRollCount]=useState(0)

  const [tenzies, setTenzies] = useState(false)//it is in roll dice

  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  //tenzies dalke chode is
  // console.log("try")

  useEffect(() => {
    // console.log("timer")
    let timer;

    if (isRunning) {
      timer = setInterval(() => {
        setTotalSeconds((prevTotalSeconds) => prevTotalSeconds + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isRunning]);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;




  useEffect(() => {
    // console.log("dice state changed")
    const allHeld = dice.every(die => die.isHeld)
    const firstval = dice[0].value
    const allsame = dice.every(die => die.value == firstval)
    if (allHeld && allsame) {
      setTenzies(true)
      // console.log("you won") 
      setIsRunning(val=>!val)
      
      setRollCount(0)
      console.log(minutes,seconds)
      localStorage.setItem("timetaken",minutes.toString()+":"+seconds.toString())
      //we need to give minutes a state

    }


  }, [dice])

  function generateNewDie() {
    return {
      value: Math.floor(Math.random() * 6 + 1),
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice() {
    const arr = []
    for (let i = 0; i < 10; i++) {
      arr.push(generateNewDie())
    }
    return arr
    
  }

  function rollDice() {

    setRollCount(prevCount=>prevCount+1)
    
    if (!tenzies) {
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ? die : generateNewDie()
      }))
      
      
    } else {
      setTenzies(false)
      setDice(allNewDice)
      setIsRunning(val=>!val)
      console.log(minutes,seconds,"end")
      setTotalSeconds(0)
      const x=localStorage.getItem("timetaken")
      console.log(x,"thestorage")
      
      
    }
  }


  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ?
        { ...die, isHeld: !die.isHeld } :
        die
    }))
    // console.log(id)
  }


  const diceElement = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ))

  return (
    <main>
      {tenzies && <Confetti
      // width={width}
      // height={height}
      />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className='dice-container'>
        {diceElement}
      </div>
      <div>
        <button className='roll-dice' onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
      </div>
      <div>
        <h3>Roll's Taken :{rollcount}</h3>
      </div>
      <div>
        <h2>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</h2>
      </div>
    </main>

  )

}

export default App
