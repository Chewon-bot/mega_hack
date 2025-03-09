import { useEffect, useState } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import Loading from '../components/Loading.jsx'
import Coins from '../components/Coins.jsx'
import './Game.css'
import { validateProgress } from '../utils/game_validators.js'

const Game = () => {
  const { gameId } = useParams()
  const [game, setGame] = useState(null)
  const [currentNode, setCurrentNode] = useState(null)
  const [history, setHistory] = useState([])
  const location = useLocation()
  const navigate = useNavigate()
  const [menuVisible, setMenuVisible] = useState(false)
  const [coins, setCoins] = useState(0)

  const getGameProgressKey = (gameId) => `game_progress_${gameId}`

  useEffect(() => {
    const loadGame = async () => {
      try {
        const response = await fetch(`/games/${gameId}.json`)
        const data = await response.json()
        setGame(data)
        setCurrentNode("start")
      } catch (error) {
        console.error('Error loading the game:', error)
      }
    }

    loadGame()
  }, [gameId])

  const handleChoice = (nextNode) => {
    if (game && game[nextNode]) {
      setHistory((prevHistory) => {
        const newHistory = [...prevHistory, currentNode]
        localStorage.setItem(getGameProgressKey(gameId), JSON.stringify(newHistory.concat(nextNode)))
        return newHistory
      })
      setCoins((prevState) => {
        return prevState + (game[nextNode].coins ?? 0)
      })
      setCurrentNode(nextNode)
    }
  }

  const handleBack = () => {
    if (history.length > 0) {
      const previousNode = history[history.length - 1]
      setHistory((prevHistory) => {
        if (prevHistory.length > 1) {
          localStorage.setItem(getGameProgressKey(gameId), JSON.stringify(prevHistory))
        } else {
          localStorage.removeItem(getGameProgressKey(gameId))
        }
        return prevHistory.slice(0, -1)
      })
      if (currentNode) {
        setCoins((prevState) => {
          return prevState - (game[currentNode].coins ?? 0)
        })
      }
      setCurrentNode(previousNode)
    }
  }

  const goToMainPage = () => navigate('/')

  const toggleMenu = (event) => {
    event.stopPropagation()
    setMenuVisible((prevState) => !prevState)
  }

  const loadProgress = () => {
    const progressString = localStorage.getItem(getGameProgressKey(gameId))
    if (!progressString || progressString.length === 0) {
      return
    }
    try {
      const progress = JSON.parse(progressString)
      const earnedCoins = validateProgress(game, progress)
      if (earnedCoins !== null) {
        setCurrentNode(progress[progress.length - 1])
        setHistory(progress.slice(0, -1))
        setCoins(earnedCoins)
      } else {
        localStorage.removeItem(getGameProgressKey(gameId))
      }
    } catch (error) {
      console.error('Error loading progress:', error)
      localStorage.removeItem(getGameProgressKey(gameId))
    }
  }

  const canLoadProgress = localStorage.getItem(getGameProgressKey(gameId)) !== null

  if (!currentNode) {
    return <Loading />
  }

  return (
    <div className="game-container" onClick={() => {setMenuVisible(false)}}>
      <div className="menu-container">
        <button className="menu-button" onClick={toggleMenu}>Menu</button>
        {menuVisible && (
          <div className="menu-box">
            <button className="menu-item" onClick={goToMainPage}>Main Page</button>
            <button
              className={`menu-item ${!canLoadProgress ? 'disabled' : ''}`}
              disabled={!canLoadProgress}
              onClick={loadProgress}
            >
              Load progress
            </button>
            <button className="menu-item">Music on/off</button>
          </div>
        )}
      </div>
      <h2 className="game-title">{location.state.gameName || 'Text-Based Adventure'}</h2>
      <Coins coins={Math.max(0, coins)} />
      <p className="game-text">{game[currentNode].text}</p>
      {game[currentNode].choices.length > 0 ? (
        <ul className="choice-list">
          {game[currentNode].choices.map((choice, index) => (
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
      <button className="back-button" onClick={history.length > 0 ? handleBack : goToMainPage}>Back</button>
    </div>
  )
}

export default Game
