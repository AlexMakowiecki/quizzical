import { useState, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import "../styles/Star.css"

export default function Star({ratio, id, transitionDuration}){
  const [percentageVisible, setPercentageVisible] = useState("0%")

  useEffect(() => {
    setPercentageVisible(`${ratio * 100}%`)
  },[])

  const animationSettings = (transitionDuration) 
    ? {
        transitionDuration: `${transitionDuration}s`,
        transitionDelay: `${id*transitionDuration}s`,
        animationDelay: `${id*transitionDuration+transitionDuration/1.2}s`
      }
    : { 
        transitionDelay: `${id}s`,
        animationDelay: `${id+id/1.1}s`
      }
  const completedStyle = (percentageVisible === "100%") ? "star--completed" : ""
  return (

    <div className="star" id={`star-${id}`}>
      <FontAwesomeIcon icon={faStar} className="star__background-icon"/>
      <div className={`star__filling ${completedStyle}`} style={{width: percentageVisible, ...animationSettings}}>
        <FontAwesomeIcon icon={faStar} className="star__icon"/>
      </div>
    </div>
  )
}