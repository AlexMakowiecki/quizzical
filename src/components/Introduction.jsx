import {useState, useEffect} from "react"
import emojiData from "../libraries/emojiData"
import "../styles/Introduction.css"

export default function StartQuiz({setGameStarted, setQuizOptions}){
  const [quizData, setQuizData] = useState(null)
  const [quizChosenOptions, setQuizChosenOptions] = useState({
    categoryNumber: "",
    difficulty: ""
  })
  const [moreOptionsShowed, setMoreOptionsShowed] = useState(false)

  useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
      .then(res => res.json())
      .then(data => {
        const categories = data.trivia_categories.map(category => {
          category.name = category.name.replace("Entertainment: ","").replace("Science: ","")
          return category
        })
        setQuizData({
          categories, 
          difficulties: ["easy", "medium", "hard"]
        })
      })
  },[])

  // TODO: change this
  function updateQuizChosenOptions(e){
    const select = e.target;
    setQuizChosenOptions((prevQuizChosenOptions) => {
      return {
        ...prevQuizChosenOptions,
        [select.name]: select.value
      }
    })
  }

  
  const categoryOptions = quizData?.categories.map(category => {
    const inputId = `category-input-${category.id}`
    return (
      <option id={inputId} key={inputId} value={category.id} className="introduction__option">
        {emojiData[category.name]} {category.name}
      </option>
    )
  })

  const difficultyInputs = quizData?.difficulties.map((difficulty,i) => {
    const inputId = `difficulty-input-${i}`
    const difficultyMessage = 
        (difficulty === "easy") ? "😊 Easy"
      : (difficulty === "medium") ? "😐 Medium"
      : (difficulty === "hard") ? "😓 Hard" 
      : "(Error)"
    return (
      <option id={inputId} key={inputId} value={difficulty} className="introduction__option">
        {difficultyMessage}
      </option>
    )
  })

  return (
  <div className="introduction">
    <h1 className="introduction__title">Quizzical</h1>
    <p className="introduction__description">Test your knowledge!</p>
    <form className="introduction__form" onSubmit={() => setQuizOptions(quizChosenOptions)}>
      <button
        className="introduction__more-options-button"
        type="button"
        onClick={() => setMoreOptionsShowed(prevMoreOptionsShowed => !prevMoreOptionsShowed)}
      >{(moreOptionsShowed) ? "- Hide more" : "+ Show more"} options</button>
      {moreOptionsShowed && <div className="introduction__more-options-container">
        <div className="form-field-container">
          <label htmlFor="category-select">Category: </label>
          <select
            id="category-select"
            name="categoryNumber"
            value={quizChosenOptions.categoryNumber}
            className="introduction__select"
            onChange={updateQuizChosenOptions}>
            <option value="">💯 All</option>
            {categoryOptions}
          </select>
        </div>
        <div className="form-field-container" >
          <label htmlFor="difficulty-select">Difficulty: </label>
          <select
            id="difficulty-select"
            name="difficulty"
            value={quizChosenOptions.difficulty}
            className="introduction__select"
            onChange={updateQuizChosenOptions}>
            <option value="">🤪 Any</option>
            {difficultyInputs}
          </select>
        </div>
      </div>}

      <button
        className="introduction__start-button"
      > Start quiz </button>
    </form>

  </div>
  )
}