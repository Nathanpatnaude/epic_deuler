const UserCharacter = ({ data }) => {
  console.log(data);
  return (
    
    <div className="container">
      <div className="has-text-centered ">
      Stats
      </div>
      <div className="container box has-text-weight-bold is-size-6 has-text-centered" style={{ border: '4px solid rgba(1, 1, 1, 1)', borderRadius: '40px'}}>
        <div className="user-gold columns"><span className="column is-right">GOLD:  </span><span className="column">{data.me.gold} 💎</span></div>
        <div className="user-wins columns"><span className="column is-right">WINS:  </span><span className="column">{data.me.wins}</span></div>
        <div className="user-deaths columns"><span className="column is-right">DEATHS:  </span><span className="column">{data.me.deaths}</span></div>
        <div className="user-rating columns"><span className="column is-right">RATING:  </span><span className="column">{data.me.rating}</span></div>
        <div className="user-deaths columns"><span className="column is-right">HP:  </span><span className="column">{data.me.statblock.hp}</span></div>
        <div className="user-range columns"><span className="column is-right">RANGE:  </span><span className="column">1-{data.me.statblock.range}</span></div>
        <div className="user-name columns"><span className="column is-right">ATTACK:  </span><span className="column">{data.me.statblock.attack}</span></div>
        <div className="user-wins columns"><span className="column is-right">DEFENSE:  </span><span className="column">{data.me.statblock.defense}</span></div>
        <div className="user-gold columns"><span className="column is-right">CRIT:  </span><span className="column">{data.me.statblock.crit}</span></div>
        <div className="user-rating columns"><span className="column is-right">PARRY:  </span><span className="column">{data.me.statblock.parry}</span></div>
      </div>

      
    </div>
  )
}
export default UserCharacter;