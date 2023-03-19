import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_CHARACTERS } from "../utils/gql/queries";
import {UPDATE_INVENTORY } from '../utils/gql/mutations';
import { useNavigate } from "react-router-dom";
import Auth from '../utils/Auth';




function Fight() {
    var itemData;
    const { loading, data: data1, error} = useQuery(QUERY_CHARACTERS);
    const [purchaseItem, { error: purchaseError, data: purchaseData }] = useMutation(UPDATE_INVENTORY);
    var data2;
    data1? itemData = data1.characters : data2 = loading;
    console.log(data2);
    console.log(itemData);
    // const itemData = JSON.stringify(shopData.shop)
    let navigate = useNavigate();
        const routeChange = () =>{  
         let path = `/Battle`; 
          navigate(path);
    }

    const handleFight = async (item) => {
        console.log(item);
        localStorage.setItem('current_opponent', JSON.stringify(item));
        routeChange();

        
      };

    return (
        <>
                {loading ? (
        <div>Loading...</div>
      ) : ( itemData.map((item) => (
                    <ListGroup key={item.name} className="section field label box has-text-centered" style={{ border: '4px solid rgba(1, 1, 1, 1)', borderRadius: '40px', fontSize: '33px', padding:'25px'}}>
                        <ListGroup.Item>
                            <Badge className='is-pulled-left' style={{ display: 'inline-block', fontSize: '33px', borderRadius: '60px', boxShadow: ' 0 0 8px #999', padding: '0.5em 0.6em', margin:'0px' }}>{item.rating}</Badge>
                             {item.name} 
                             <Button className='is-pulled-right' onClick={() => handleFight(item.name)} style={{ backgroundColor: 'orange', borderRadius: '40px', padding: '10px', paddingTop: '3px', paddingLeft:'20px', position: 'right', right: '160px', alignItems: 'center', width: 'fit-content', display: 'initial', fontSize: '33px' }} >FIGHT</Button></ListGroup.Item>
                             
                        
                        <ListGroup.Item className='is-size-5'>{item.wins}</ListGroup.Item>
                        <ListGroup.Item className='tag is-medium is-info is-pulled-right'>{item.deaths}</ListGroup.Item>
                        
                    </ListGroup>
                )))
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