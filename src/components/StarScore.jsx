import Star from "./Star"
import "../styles/StarScore.css"

export default function StarScore({starQuantity, scoreRatio}){
  const totalFill = 1/starQuantity
  const stars = Array.from({length: starQuantity}, (_, i) => {
    const remainingValue = Math.min(totalFill, (scoreRatio - totalFill * i))  // If more than 0.2, set to 0.2
    const starRatio = (remainingValue > 0) // On negative value set to 0
      ? (remainingValue / totalFill)
      : 0
    return (
      <Star ratio={starRatio} id={i} key={i} transitionDuration={0.8}/>
    )
  })

  return (
    <div className="star-score">
      {stars}
    </div>
  )
}