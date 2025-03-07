import { useEffect, useState } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import './Game.css'

const Game = () => {
  const { gameId } = useParams()
  const [game, setGame] = useState(null)
  const [currentNode, setCurrentNode] = useState(null)
  const [history, setHistory] = useState([])
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const loadGame = async () => {
      try {
        const response = await fetch(`/games/${gameId}.json`)
        const data = await response.json()
        setGame(data)
        setCurrentNode(data.start)
      } catch (error) {
        console.error('Error loading the game:', error)
      }
    }

    loadGame()
  }, [gameId])

  if (!currentNode) {
    return <p>Loading...</p>
  }

  const handleChoice = (nextNode) => {
    if (game && game[nextNode]) {
      setHistory((prevHistory) => {
        return [...prevHistory, currentNode]
      })
      setCurrentNode(game[nextNode])
    }
  }

  const handleBack = () => {
    if (history.length > 0) {
      const previousNode = history[history.length - 1]
      setHistory((prevHistory) => {
        return prevHistory.slice(0, -1)
      })
      setCurrentNode(previousNode)
    }
  }

  return (
    <div className="game-container">
      <div className="title-container">
        <h2 className="game-title">{location.state.gameName || 'Text-Based Adventure'}</h2>
        <button className="back_button" onClick={() => navigate('/')}>
          Home
        </button>
      </div>
      <p className="game-text">{currentNode.text}</p>
      {currentNode.choices.length > 0 ? (
        <ul className="choice-list">
          {currentNode.choices.map((choice, index) => (
            <li key={index}>
              <button className="choice-button" onClick={() => handleChoice(choice.next)}>
                {choice.text}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="game-end">The End.</p>
      )}
      {history.length > 0 && (
        <button className="back-button" onClick={handleBack}>Back</button>
      )}
    </div>
  )
}

export default Game
