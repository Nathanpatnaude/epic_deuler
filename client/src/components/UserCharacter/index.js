const UserCharacter = ({ data }) => {
  console.log(data);
  return (
    
    <div className="container">
      <div className="has-text-centered ">
      Stats
      </div>
      <div className="container box has-text-weight-bold is-size-6 has-text-centered" style={{ border: '4px solid rgba(1, 1, 1, 1)', borderRadius: '40px'}}>
        <div className="user-gold columns is-mobile is-gapless">
          <span className="column is-right">RECORD:  </span>
          <span className="column">{data.me.wins}-{data.me.deaths}</span>
          </div>
        <div className="user-deaths columns is-mobile is-gapless">
          <span className="column is-right">HP:  </span>
          <span className="column">{data.me.statblock.hp}</span>
          </div>
        <div className="user-range columns is-mobile is-gapless">
          <span className="column is-right">DAMAGE:  </span>
          <span className="column">{data.me.statblock.attack + 1}-{data.me.statblock.range + data.me.statblock.attack}</span>
          </div>
        <div className="user-wins columns is-mobile is-gapless">
          <span className="column is-right">DEFENSE:  </span>
          <span className="column">{data.me.statblock.defense}</span>
          </div>
        <div className="user-gold columns is-mobile is-gapless">
          <span className="column is-right">CRIT:  </span>
          <span className="column">{data.me.statblock.crit}</span>
          </div>
        <div className="user-rating columns is-mobile is-gapless">
          <span className="column is-right">PARRY:  </span>
          <span className="column">{data.me.statblock.parry}</span>
          </div>
      </div>

      
    </div>
  )
}
export default UserCharacter;