import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  const [games, setGames] = useState([])

  useEffect(() => {
    const loadGames = async () => {
      try {
        const response = await fetch('/games/games.json')
        const data = await response.json()
        setGames(data.games)
      } catch (error) {
        console.error('Error loading games:', error)
      }
    }

    loadGames()
  }, [])

  return (
    <div className="home-container">
      <h1 className="home-title">Choose Your Adventure</h1>
      <ul className="game-list">
        {games.map((game) => (
          <li key={game.id}>
            <Link to={`/game/${game.id}`} state={{ gameName: game.name }} className="game-link">
              <h2>{game.name}</h2>
              <p>{game.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home
