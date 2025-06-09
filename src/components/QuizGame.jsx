import { useState, useEffect } from "react"
import {nanoid} from "nanoid"
import StarScore from "./StarScore"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons'
import "../styles/QuizGame.css"

export default function QuizGame({quizOptions}){
  const [questionsData, setQuestionsData] = useState(null)
  const [userAnswers, setUserAnswers] = useState({})
  const [areAnswersSubmitted, setAreAnswersSubmitted] = useState(false)
  const [pageNumber, setPageNumber] = useState(0)
  const cantCorrectAnswers = questionsData?.filter((questionData, i) => {  
    return (questionData.correctAnswer === userAnswers[`answerQuestion${i}`])
  }).length

  useEffect(() => {
    if (questionsData)
      setUserAnswers(questionsData.reduce((totalAnswers, questionData, i) => {
        return {
          ...totalAnswers, 
          [`answerQuestion${i}`]:""
        }
      }, {}))
  }, [questionsData])

  useEffect(_ => {
    asyncSetQuestionsData()
  }, [])

  async function asyncSetQuestionsData(){
    const decodedQuestions = await getDecodedQuestions()
    setQuestionsData(decodedQuestions)
  }

  function handleChange(e){
    const input = e.target;
    setUserAnswers(prevUserAnswers => {
      return ({
        ...prevUserAnswers,
        [input.name]: input.value
      })
    })
  }

  function handleSubmit(e){
    e.preventDefault()
    setAreAnswersSubmitted(true)
  }

  async function getDecodedQuestions(){
    const res = await fetch(
      `https://opentdb.com/api.php?category=${quizOptions.categoryNumber}&difficulty=${quizOptions.difficulty}&type=multiple&amount=20`)
    const data = await res.json();
    return (data.results.map((encodedData) => {
      const question = decodeHTML(encodedData.question)
      const correctAnswer = decodeHTML(encodedData.correct_answer)
      const incorrectAnswers = shuffleArray(encodedData.incorrect_answers.slice(0,3)).map(answer => decodeHTML(answer))
      const shuffledAnswers = shuffleArray([...incorrectAnswers, correctAnswer])
      return {question, correctAnswer, incorrectAnswers, shuffledAnswers}
    }))
  }

  
  const quizFields = questionsData?.slice(pageNumber*5, pageNumber*5+5).map((questionData,i) => {
    const radioAnswers = questionData.shuffledAnswers.map((answer,j) => {
      const answerStateStyle = (areAnswersSubmitted)
        ? (answer === questionData.correctAnswer)
          ? "correct"
          : "incorrect" 
        : ""
      const randomId = "answer" + nanoid()
      return (
        <div className="quiz-game__radio-answer" key={`answer-${i+pageNumber*5}-${j}`}>
          <input 
            type="radio"
            name={`answerQuestion${i+pageNumber*5}`}
            id={randomId}
            className="quiz-game__radio-input input--invisible"
            value={answer}
            required
            onChange={handleChange}
            disabled={areAnswersSubmitted}
          />
          <label 
            className={`quiz-game__radio-label ${answerStateStyle}`} 
            htmlFor={randomId}
            >
              {answer}
          </label>
        </div>
      )
    })
    return (
      <div key={`container-${i}`}>
        <div className="quiz-game__field">
          <p className="quiz-game__question">{questionData.question}</p>
          <div className="quiz-game__answers">
            {radioAnswers}
          </div>
        </div>
        <hr className="quiz-game__separator"/>
      </div>
    )
  })
      
  function decodeHTML(encodedString){
    const decodedString = document.createElement("p")
    decodedString.innerHTML = encodedString
    return decodedString.textContent
  }

  function shuffleArray(array){
    return array.sort(() => Math.random() - 0.5)
  }

  function handleNextButton(){
    document.querySelector(".quiz-game__form").reset()
    setPageNumber(prevPageNumber => prevPageNumber + 1)
    setAreAnswersSubmitted(false)
  }

  function resetGame(){
    asyncSetQuestionsData().then(_ => setPageNumber(0))
  }

  return(
    <div className="quiz-game">
      {(pageNumber === 4)
        ? <div className="quiz-game__end">
            <h2 className="quiz-game__title"> You completed the Quiz! </h2>
            <p className="quiz-game__text-score">{`You scored ${cantCorrectAnswers}/${questionsData.length} correct answers`}</p>
            <StarScore starQuantity={5} scoreRatio={cantCorrectAnswers/questionsData.length} />
            <div className="quiz-game__navigation">
              <button className="quiz-game__link" onClick={_ => location.reload()}>
                <FontAwesomeIcon icon={faRightFromBracket} />
                {"To front page"}
              </button>
              <button className="quiz-game__link" onClick={resetGame}>
                {"Replay"}
                <FontAwesomeIcon icon={faArrowRotateLeft} />
              </button>
            </div>
          </div>
        : <form className="quiz-game__form" onSubmit={handleSubmit}>
            {quizFields}
            <div className="quiz-game__bottom">
              {areAnswersSubmitted
                ? <>
                    <div className="quiz-game__score">
                      <StarScore starQuantity={5} scoreRatio={cantCorrectAnswers/questionsData.length}/>
                      <p className="quiz-game__text-score">{`${cantCorrectAnswers}/${questionsData.length} correct answers`}</p>
                    </div>
                    <button type="button" className="quiz-game__button quiz-game__next-button" onClick={handleNextButton}>Next</button>
                  </>
                : <button className="quiz-game__button">Check Answers</button>
              }
            </div>
          </form>
      }
    </div>
  )
}