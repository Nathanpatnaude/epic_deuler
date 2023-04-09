import React, { useState } from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_SHOP, QUERY_ME } from "../utils/gql/queries";
import {UPDATE_INVENTORY } from '../utils/gql/mutations';
import Auth from '../utils/Auth';




function Shop() {
    const { loading: loadingMe, data: dataMe, error: errorMe } = useQuery(QUERY_ME);
    const { loading, data: data1, error} = useQuery(QUERY_SHOP);
    const [purchaseItem, { error: purchaseError, data: purchaseData }] = useMutation(UPDATE_INVENTORY);
    const [shopState, setShopState] = useState({
      tabAll: 'is-active',
      tabWeapons: '',
      tabArmor: '',
      tabTrinket: '',
      tabSell: '',
      itemData: [],  
    });

    var token = Auth.getToken();
    if (!token || Auth.isTokenExpired(token)) {
      window.location.assign('/');
    }
    var data2;
    var gold;
    if (shopState.tabAll === 'is-active') {
    data1? shopState.itemData = data1.shop : data2 = loading;
    }
    dataMe? gold = dataMe.gold: gold = 0;
    console.log(dataMe);
    console.log(shopState.itemData);
    // const itemData = JSON.stringify(shopData.shop)
    
    const handleTabs = (itemType) => {
      if (itemType === 'all') {
        shopState.itemData = data1.shop;
        setShopState({
          tabWeapons: '',
          tabAll: 'is-active',
          tabArmor: '',
          tabTrinket: '',
          tabSell: '',
          itemData: [...data1.shop],
        });
     } else if (itemType === 'weapon') {
        var filteredList = data1.shop.filter(item => item.itemtype === 'weapon');
        
        setShopState({
          tabWeapons: 'is-active',
          tabAll: '',
          tabArmor: '',
          tabTrinket: '',          
          tabSell: '',
          itemData: [...filteredList],
        });
     } else if (itemType === 'armor') {
      var filteredList = data1.shop.filter(item => item.itemtype === 'armor');
        
      setShopState({
        tabWeapons: '',
        tabAll: '',
        tabArmor: 'is-active',
        tabTrinket: '',
        tabSell: '',
        itemData: [...filteredList],
      });
     } else if (itemType === 'trinket') {
      var filteredList = data1.shop.filter(item => item.itemtype === 'trinket');
        
      setShopState({
        tabWeapons: '',
        tabAll: '',
        tabArmor: '',
        tabTrinket: 'is-active',
        tabSell: '',
        itemData: [...filteredList],
      });
     } else if (itemType === 'sell') {
      const equipped = [dataMe.me.inventory.weapon._id, dataMe.me.inventory.armor._id, dataMe.me.inventory.slot1._id, dataMe.me.inventory.slot2._id, dataMe.me.inventory.slot3._id, dataMe.me.inventory.slot4._id];
      const bag = dataMe.me.inventory.bag.map(owned => owned._id)
      var filteredList = data1.shop.filter(item => bag.includes(item._id));
        
      setShopState({
        tabWeapons: '',
        tabAll: '',
        tabArmor: '',
        tabTrinket: '',
        tabSell: 'is-active',
        itemData: [...filteredList.filter(item => !equipped.includes(item._id))],
      });
     } else {
      console.log('error');
     }
    }

    const ifNotEquipped = (filteredList) => {
      const equipped = [dataMe.me.inventory.weapon._id, dataMe.me.inventory.armor._id, dataMe.me.inventory.slot1._id, dataMe.me.inventory.slot2._id, dataMe.me.inventory.slot3._id, dataMe.me.inventory.slot4._id, ...dataMe.me.inventory.bag.map(owned => owned._id)];
      // equipped.push(...bag);
      var list = filteredList
      if (shopState.tabAll != 'is-active') {
        list = filteredList.filter(item => !equipped.includes(item._id))
      }
      console.log(list);
      if (shopState.tabSell != 'is-active') {
        return list;
      } else {        
        return filteredList.filter(item => equipped.includes(item._id))
      }
  }

    const handlePurchase = async (item, action) => {
        console.log(dataMe.me.gold);

        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) {
          return false;
        }
        try {
            const { data } = await purchaseItem({
               variables: { itemId: item, action: action },
             });
        
        } catch (err) {
          console.error(JSON.parse(JSON.stringify(err)));
        }
      };

      const ifAfforadable = (item) => {
        if (!dataMe.me.inventory.bag.some(owned => owned._id === item._id)) {
        if (item.price > dataMe.me.gold) {
          return (<Button className='' style={{ backgroundColor: 'grey', borderRadius: '40px', padding: '10px', paddingTop: '3px', paddingLeft:'20px', position: 'right', right: '160px', alignItems: 'center', width: 'fit-content', display: 'initial', fontSize: '33px' }} >{item.price}<span className='span-outline'>💎</span></Button>)
        } else {
          return (<Button className='shop-button buy' onClick={() => handlePurchase(item._id, 'buy')} style={{ backgroundColor: '#0070dd'}} >{item.price}<span className='span-outline'>💎</span></Button>)
        }
      } else if (shopState.tabSell != 'is-active') {
        return (<Button className='shop-button' style={{ backgroundColor: 'grey'}} >SOLD</Button>)
      } else {
        return (<Button className='shop-button sell' onClick={() => handlePurchase(item._id, 'sell')} style={{ backgroundColor: '#e6cc80' }} >{Math.floor(item.price/2)}<span className='span-outline'>💎</span></Button>)
      }

      }
    return (
        <>
        <div className="has-text-centered ">
      <h1 className="fromtop title has-text-centered is-size-2 mb-4 equip" style={{ backgroundColor: '#e6cc80', textShadow: '2px 2px 10px #a335ee', display: 'inline-block', fontSize: '33px', borderRadius: '60px', boxShadow: ' 0 0 8px #999', padding: '0.5em 0.6em', margin:'0px', borderBottom: '16px', borderBottomStyle: 'solid' }}><span className='span-outline'>🧙‍♂️</span></h1>
      </div>
          <div className="is-centered tabs is-boxed is-large" >
  <ul >
    <li className={shopState.tabAll} onClick={() => {handleTabs('all')}} >
      <a href={() => false}>
        <span className="span-outline">📜</span>
        <span className="username">All</span>
      </a>
    </li>
    <li className={shopState.tabWeapons} onClick={() => {handleTabs('weapon')}}>
      <a href={() => false}>
        <span className="span-outline">🖐️</span>
        <span className="username">Weapons</span>
      </a>
    </li>
    <li className={shopState.tabArmor} onClick={() => {handleTabs('armor')}}>
      <a href={() => false}>
        <span className="span-outline">👤</span>
        <span className="username">Armor</span>
      </a >
    </li>
    <li className={shopState.tabTrinket} onClick={() => {handleTabs('trinket')}}>
      <a href={() => false}>
        <span className="span-outline">⚙️</span>
        <span className="username">Trinkets</span>
      </a>
    </li>
    <li className={shopState.tabSell} onClick={() => {handleTabs('sell')}}>
      <a href={() => false}>
        <span className="span-outline">💰</span>
        <span className="username">Sell</span>
      </a>
    </li>
  </ul>
</div>
 <ListGroup key='bag' className="is-flex section field label box has-text-centered px-0 py-2 is-flex-wrap-wrap" style={{ border: '4px solid rgba(1, 1, 1, 1)', borderRadius: '40px', fontSize: '33px'}}>
                {loading ? (
        <div>Loading...</div>
      ) : ( 
        ifNotEquipped(shopState.itemData).map((item) => (
                   
             <div className={`dropdown pr-0 m-1 has-text-centered is-block`} key={item._id} style={{ backgroundColor: `#a335ee`, textShadow: '2px 2px 10px #ffffff', borderRadius: '20px', width: '328px'}}>
              <div className='columns column p-0 m-0 is-full is-mobile' style={{ height: '240px'}}>
                <div className=' pl-1 py-4' style={{ width: '148px' }}>               
                 <span className='button mb-2 is-size-5 p-1 equip' style={{ backgroundColor: `#e6cc80`, whiteSpace: 'normal', height: '4rem', border: '2px solid rgba(1, 1, 1, 1)', borderRadius: '40px', width: '95%', fontWeight: 'bold' }}>{item.name}</span>
                  <div className="mt-2 mb-0">
                  
                    <div className="bauble equip is-size-3 pl-4 pr-4 pb-1 pt-3">
                      <span>{item.icon}</span>
                    </div>
                  
                  </div>
                 
                  <div className="has-text-centered tag is-info is-medium">
                    {item.itemtype.charAt(0).toUpperCase() + item.itemtype.slice(1)}
                  </div>
                </div>
                <div className='column py-2 px-1'>
                  <ListGroup.Item className=" container box has-text-weight-bold is-size-5 has-text-centered pt-1 pb-0 px-0 mr-1" style={{ border: '2px solid rgba(1, 1, 1, 1)', borderRadius: '20px', height: '100%'}}>
                    <div className='centered-element p-1' style={{ marginLeft: '-4px', height: '230px'}}>
                      {item.description}
                    </div>
                  </ListGroup.Item>
                </div>
                
              </div>
              <div className='column is-full'>
                {ifAfforadable(item)}
              </div>
            </div>
                        
                    
          ))
              
        )
      }
    </ListGroup>
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


// const ifNotEquipped = (itemid) => {
//   const equipped = [data1.me.inventory.weapon._id, data1.me.inventory.armor._id, data1.me.inventory.slot1._id, data1.me.inventory.slot2._id, data1.me.inventory.slot3._id, data1.me.inventory.slot4._id];
//   if (!equipped.includes(itemid)) {
//   return ( <Button className='is-pulled-right' onClick={() => handlePurchase(itemid)} style={{ backgroundColor: '#0070dd', textShadow:'2px 2px 10px #ffffff', borderRadius: '40px', padding: '10px', paddingTop: '3px', paddingLeft: '20px', position: 'right', right: '160px', alignItems: 'center', width: 'fit-content', display: 'initial', fontSize: '33px' }} >Sell💎</Button>
//   )
// } else {
//   return (<Button className='is-pulled-right' style={{ backgroundColor: '#0070dd', borderRadius: '40px', padding: '10px', paddingTop: '3px', paddingLeft: '20px', position: 'right', right: '160px', alignItems: 'center', width: 'fit-content', display: 'initial', fontSize: '33px' }} ></Button>)
// }