import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_SHOP, QUERY_ME } from "../utils/gql/queries";
import {UPDATE_INVENTORY } from '../utils/gql/mutations';
import Auth from '../utils/Auth';
var itemData;



function Shop() {
    const { loading: loadingMe, data: dataMe, error: errorMe } = useQuery(QUERY_ME);
    const { loading, data: data1, error} = useQuery(QUERY_SHOP);
    const [purchaseItem, { error: purchaseError, data: purchaseData }] = useMutation(UPDATE_INVENTORY);
    var data2;
    var gold;
    data1? itemData = data1.shop : data2 = loading;
    dataMe? gold = dataMe.gold: gold = 0;
    console.log(data2);
    console.log(itemData);
    // const itemData = JSON.stringify(shopData.shop)
    

    const handlePurchase = async (item) => {
        console.log(dataMe.me.gold);

        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) {
          return false;
        }
        try {
            var action = 'buy';
            const { data } = await purchaseItem({
               variables: { itemId: item, action: action },
             });
        
        } catch (err) {
          console.error(JSON.parse(JSON.stringify(err)));
        }
      };

      const ifAfforadable = (item) => {
        if (item.price >= dataMe.me.gold) {
          return (<Button className='is-pulled-right' style={{ backgroundColor: 'grey', borderRadius: '40px', padding: '10px', paddingTop: '3px', paddingLeft:'20px', position: 'right', right: '160px', alignItems: 'center', width: 'fit-content', display: 'initial', fontSize: '33px' }} >{item.price}💎</Button>)
        } else {
          return (<Button className='is-pulled-right' onClick={() => handlePurchase(item._id)} style={{ backgroundColor: 'orange', borderRadius: '40px', padding: '10px', paddingTop: '3px', paddingLeft:'20px', position: 'right', right: '160px', alignItems: 'center', width: 'fit-content', display: 'initial', fontSize: '33px' }} >{item.price}💎</Button>)
        }

      }
    return (
        <>
                {loading ? (
        <div>Loading...</div>
      ) : ( itemData.map((item) => (
                    <ListGroup key={item.name} className="section field label box has-text-centered" style={{ border: '4px solid rgba(1, 1, 1, 1)', borderRadius: '40px', fontSize: '33px', padding:'25px'}}>
                        <ListGroup.Item>
                            <Badge className='is-pulled-left' style={{ display: 'inline-block', fontSize: '33px', borderRadius: '60px', boxShadow: ' 0 0 8px #999', padding: '0.5em 0.6em', margin:'0px' }}>{item.icon}</Badge>
                             {item.name} 
                             {ifAfforadable(item)}
                             </ListGroup.Item>
                             
                        
                        <ListGroup.Item className='is-size-5'>{item.description}</ListGroup.Item>
                        <ListGroup.Item className='tag is-medium is-info is-pulled-right'>{item.itemtype}</ListGroup.Item>
                        
                    </ListGroup>
                )))
            }
            </>
        );
    }
    
    
    export default Shop;
    
    
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