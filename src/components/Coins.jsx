import PropTypes from 'prop-types'
import Coin from '../assets/coin.png'
import './Coins.css'

const Coins = ({ coins }) => {
  const coinImages = Array.from({ length: coins }, (_, index) => (
    <img
      key={index}
      src={Coin}
      alt="coin"
      className="coin"
      style={{
        left: `${index * 10}px`,
        zIndex: coins - index
      }}
    />
  ));

  return (
    <div className="coins-container">{coinImages}</div>
  )
}

Coins.propTypes = {
  coins: PropTypes.number.isRequired,
}

export default Coins
