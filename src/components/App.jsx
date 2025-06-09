import { useState, StrictMode } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../styles/App.css'
import Introduction from "./Introduction"
import QuizGame from "./QuizGame"
import blob1 from "../assets/blob1.png"
import blob2 from "../assets/blob2.png"
import StarScore from "./StarScore"

export default function App() {
  const [quizOptions, setQuizOptions] = useState(null)
  return (
    <>
      <div className="blob-background">
        <img className="blob blob-one" src={blob1}></img>
        <img className="blob blob-two" src={blob2}></img>
      </div> 
      { quizOptions
        ? <QuizGame quizOptions={quizOptions}/> 
        : <Introduction setQuizOptions={setQuizOptions}/> }
    </>
  )
}

