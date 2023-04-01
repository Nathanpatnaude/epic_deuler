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
           return 'is-success button is-large is-size-5-mobile is-pulled-right';
        } else if (rating > (ratingMe + 3)) {
            return 'is-danger button is-large is-size-5-mobile is-pulled-right';
        } else {
            return 'is-warning button is-large is-size-5-mobile is-pulled-right';
        }
    }
    const handleFight = async (opponent) => {
        console.log(opponent);
        localStorage.setItem('current_opponent', JSON.stringify(opponent));
        routeChange();

        
      };

    return (
        <>
                {loading || loadingMe? (
        <div>Loading...</div>
      ) : ( 
        <div className='container' style={{ maxWidth: '800px'}}>
                 {sortOpponents(opponentData).map((opponent) => (
                    
                    <ListGroup key={opponent.name} className="section field label box has-text-centered" style={{ border: '4px solid rgba(1, 1, 1, 1)', borderRadius: '40px', fontSize: '33px', padding:'12px'}}>
                        <ListGroup.Item>
                           
                            <div className="level has-text-right is-mobile">
                                 
                                <div className="is-block has-text-left level-item is-pulled-left is-size-5-mobile"> 
                                
                                <div className=''>
                                    <div className='p-1 mb-1'>
                                        {opponent.name.charAt(0).toUpperCase() + opponent.name.slice(1)} 
                                    </div>
                                    <div className='columns is-mobile p-2'>
                                    <Badge className='is-size-4-mobile' style={{backgroundColor: '#a335ee', textShadow: '2px 2px 10px #ffffff', display: 'inline-block', borderRadius: '60px', boxShadow: ' 0 0 8px #999', padding: '0.2em 0.6em', marginTop: '-2px', marginLeft: '5px', marginRight: '13px', marginBottom: '8px' }}>{opponent.rating}</Badge>

                                    <div className="is-size-4  is-size-6-mobile pb-1" style={{ backgroundColor: '#0070dd', textShadow: '2px 2px 10px #ffffff', display: 'inline-block', borderRadius: '60px', boxShadow: ' 0 0 8px #999', padding: '0.5em 0.6em', margin:'0px', marginBottom: '8px', borderBottom: '8px', borderBottomStyle: 'solid'  }}>
                                        {getPlayerIcon(opponent.inventory.armor.icon, 'armor')}
                                        </div>
                                        <div className="is-size-4  is-size-6-mobile pb-1" style={{ backgroundColor: '#0070dd', textShadow: '2px 2px 10px #ffffff', display: 'inline-block', borderRadius: '60px', boxShadow: ' 0 0 8px #999', padding: '0.5em 0.6em', margin:'0px', marginBottom: '8px', borderBottom: '8px', borderBottomStyle: 'solid'  }}>
                                        {getPlayerIcon(opponent.inventory.weapon.icon, 'weapon')}
                                        </div>
                                    </div>
                                     
                                     </div>
                                 </div>
                                 <div className=''>
                                <div className=" is-size-5 is-size-7-mobile">
                                 Wins: {opponent.wins}
                                 </div>
                                 <div className="is-size-5 is-size-7-mobile">
                                 Deaths: {opponent.deaths}
                                 </div>
                                 </div>
                            <Button className={opponentCss(opponent.rating, dataMe.me.rating)} onClick={() => handleFight(opponent.name)}  style={{ borderRadius: '40px', marginTop: '-7px', marginRight: '-7px', marginLeft: '5px'}}>FIGHT</Button>
                             </div>
                             </ListGroup.Item>
                             
                        
                        
                    </ListGroup>
                    
                ))}
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