import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
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

  const full = games.filter((game) => game.full === true)
  const dev = games.filter((game) => !game.full)


  return (
    <div className="home-container">
      <GameList title="Full Game" games={full} />
      <GameList title="Development files" games={dev} />
    </div>
  )
}

const GameList = ({ title, games }) => {
  return (
    <div>
      <h1 className="home-title">{title}</h1>
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

GameList.propTypes = {
  title: PropTypes.string.isRequired,
  games: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default Home
