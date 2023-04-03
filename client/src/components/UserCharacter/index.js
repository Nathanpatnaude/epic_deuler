const UserCharacter = ({ data }) => {
  console.log(data);
  return (
    
    <div className="container">
      <div className="has-text-centered ">
      Stats
      </div>
      <div className=" container box has-text-weight-bold is-size-6 has-text-centered pt-0 pb-0 ml-1 mr-1" style={{ border: '2px solid rgba(1, 1, 1, 1)', borderRadius: '20px', marginTop: '-4px'}}>
        <div className="dropdown user-record columns is-mobile is-gapless mb-0">
          <span className="column ">RECORD:  </span>
          <span className="column">{data.me.wins}-{data.me.deaths}</span>
          </div>
        <div className="dropdown user-hp columns is-mobile is-gapless mb-0">
          <span className="column is-right">HP:  </span>
          <span className="column">{data.me.statblock.hp}</span>
          </div>
        <div className="dropdown user-damage columns is-mobile is-gapless mb-0">
          <span className="column is-right">DAMAGE:  </span>
          <span className="column">{data.me.statblock.attack + 1}-{data.me.statblock.range + data.me.statblock.attack}</span>
          </div>
        <div className="dropdown user-defense columns is-mobile is-gapless mb-0">
          <span className="column is-right">DEFENSE:  </span>
          <span className="column">{data.me.statblock.defense}</span>
          </div>
        <div className="dropdown user-crit columns is-mobile is-gapless  mb-0">
          <span className="column is-right">CRIT:  </span>
          <span className="column">{data.me.statblock.crit}</span>
          </div>
        <div className="dropdown user-parry columns is-mobile is-gapless mb-0">
          <span className="column is-right">PARRY:  </span>
          <span className="column">{data.me.statblock.parry}</span>
          </div>
      </div>

      
    </div>
  )
}
export default UserCharacter;