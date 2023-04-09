import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_CHARACTERS, QUERY_ME } from "../utils/gql/queries";
import {UPDATE_INVENTORY } from '../utils/gql/mutations';
import { useNavigate } from "react-router-dom";
import Auth from '../utils/Auth';


    //

function Fight() {
    var opponentData;
    const { loading, data: data1, error} = useQuery(QUERY_CHARACTERS);
    const { loading: loadingMe, data: dataMe, error: errorMe } = useQuery(QUERY_ME);
    var token = Auth.getToken();
    if (!token || Auth.isTokenExpired(token)) {
      window.location.assign('/');
    }
    var data2;
    data1? opponentData = data1.characters : data2 = loading;

 
    // const opponentData = JSON.stringify(shopData.shop)
    let navigate = useNavigate();
        const routeChange = () =>{  
         let path = `/Battle`; 
          navigate(path);
    }

    const getPlayerIcon = (icon, slot) => {
        if (icon === '🚫' && slot === 'weapon') {
            return '👊';
        } else if (icon === '🚫' && slot === 'armor') {
            return '👶';
        } else {
            return icon;
        };
    };

    const sortOpponents = (opponents) => {
        var sortedOpponents = [];
        var ratingDistance = 0;
        console.log(dataMe.me);
        while (opponents.length != sortedOpponents.length) {
            for (let i = 0; i < opponents.length; i++) {
                if (opponents[i].rating === (dataMe.me.rating + ratingDistance) || opponents[i].rating === (dataMe.me.rating - ratingDistance)) {
                    sortedOpponents.push(opponents[i]);
                }
            }
            ratingDistance++;

        }
        return sortedOpponents;
    }

    const opponentCss = (rating, ratingMe) => {
        if (rating < (ratingMe - 3)) {
           return 'is-dark button is-large is-size-5-mobile sell';
        } else if (rating > (ratingMe + 3)) {
            return 'is-danger button is-large is-size-5-mobile sell';
        } else {
            return 'is-warning button is-large is-size-5-mobile sell';
        }
    }

    const opponentStyle = (rating, ratingMe) => {
        if (rating < (ratingMe - 3)) {
           return {backgroundColor: `#9d9d9d`, textShadow: '2px 2px 10px #ffffff', borderRadius: '20px', width: '328px', height: '322px'};
        } else if (rating > (ratingMe + 3)) {
            return {backgroundColor: `#a335ee`, textShadow: '2px 2px 10px #ffffff', borderRadius: '20px', width: '328px', height: '322px'};
        } else {
            return {backgroundColor: `#0070dd`, textShadow: '2px 2px 10px #ffffff', borderRadius: '20px', width: '328px', height: '322px'};
        }
    }
    const handleFight = async (opponent) => {
        console.log(opponent);
        localStorage.setItem('current_opponent', JSON.stringify(opponent));
        routeChange();

        
      };

    return (
        <>
        <div className="has-text-centered ">
      <h1 className="title has-text-centered is-size-2 mb-4 equip" style={{ backgroundColor: '#e6cc80', textShadow: '2px 2px 10px #a335ee', display: 'inline-block', fontSize: '33px', borderRadius: '60px', boxShadow: ' 0 0 8px #999', padding: '0.5em 0.6em', margin:'0px', borderBottom: '16px', borderBottomStyle: 'solid'}}><span className='span-outline'>⚔️</span></h1>
      </div>
                {loading || loadingMe? (
        <div>Loading...</div>
      ) : ( 
        <div className='m-0'>
             <ListGroup key='opponents' className="is-flex section field label box has-text-centered px-0 py-2 is-flex-wrap-wrap" style={{ border: '4px solid rgba(1, 1, 1, 1)', borderRadius: '40px', fontSize: '33px'}}>
                        
                 {sortOpponents(opponentData).map((opponent) => (
                   
                           
                   <div className={`dropdown pr-0 m-1 has-text-centered is-block`} key={opponent._id} style={opponentStyle(opponent.rating, dataMe.me.rating)}>
              <div className='columns column p-0 m-0 is-full is-mobile' style={{ height: '250px'}}>
                <div className=' pl-1 py-1' style={{ width: '148px' }}>               
                 <span className='button mb-2 is-size-5 p-1 equip' style={{ backgroundColor: `#e6cc80`, whiteSpace: 'normal', height: '4rem', border: '2px solid rgba(1, 1, 1, 1)', borderRadius: '40px', width: '316px', fontWeight: 'bold' }}>{opponent.name}</span>
                  <div className="mt-1 mb-2">
                  
                    <div className="bauble equip is-size-3 pl-4 pr-4 pb-1 pt-3">
                      <span>{getPlayerIcon(opponent.inventory.armor.icon, 'armor')}</span>
                    </div>
                  
                  </div>
                 
                  <div className="tag has-text-centered is-warning is-large">
                    {opponent.rating}
                  </div>
                </div>
                <div className='column px-1' style={{ paddingTop: '5.5rem'}}>
                  <ListGroup.Item className=" container box has-text-weight-bold is-size-5 has-text-centered pt-1 pb-0 px-2 mr-1" style={{ border: '2px solid rgba(1, 1, 1, 1)', borderRadius: '20px', height: '100%'}}>
                    <div className='p-1 columns is-gapless is-block' style={{ marginLeft: '4px', height: '100%'}}>
                        <div className='column is-full'>
                        Wins: {opponent.wins}
                        </div>
                        <div className='column is-full'>
                            Deaths: {opponent.deaths}
                        </div>
                        <div className='column is-full'>
                        <Button className='buy' style={{ backgroundColor: '#e6cc80', borderRadius: '40px', padding: '10px', paddingTop: '3px', paddingLeft:'20px', position: 'right', right: '160px', alignItems: 'center', width: 'fit-content', display: 'initial', fontSize: '25px', textShadow: '2px 2px 10px #ffffff' }} >{(opponent.rating*10) +25}<span className='span-outline'>💎</span></Button>
                        </div>
                    </div>
                  </ListGroup.Item>
                </div>
                
              </div>
              <div className='column is-full'>
                <Button className={opponentCss(opponent.rating, dataMe.me.rating)} onClick={() => handleFight(opponent.name)}  style={{ borderRadius: '40px', marginTop: '-7px', textShadow: '2px 2px 10px #ffffff', color: 'black', width: '100%' }}><span className='span-outline'>⚔️</span>FIGHT</Button>
              </div>
            </div>
                    
                ))}
                </ListGroup>
                </div>
                )
            }
            </>
        );
    }
    
    
    export default Fight;
    
    
    // Having trouble accessing the amount of gold the character has 
                                
    // import { useState } from 'react';
    // const [inventory, setInventory] = useState([]);
    
    // const addToInventory = (item) => {
        //     setInventory([...inventory, item]);
        // const charGold = require('../../../server/models/Character')
// onClick={() => {
//     if (item.price > charGold.gold) {
//         alert('You cannot afford that item!')
//     } else {
//         addToInventory(item);
//         alert('Item added successfully to you inventory')
//     }
// }}