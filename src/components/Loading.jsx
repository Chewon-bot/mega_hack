import loadingCoin from '../assets/loading_coin.svg'
import './Loading.css'

const Loading = () => {
  return (
    <div className="loading-container">
      <img src={loadingCoin} alt="Loading..." className="loading-icon" />
      <p className="loading-text">Loading...</p>
    </div>
  )
}

export default Loading
