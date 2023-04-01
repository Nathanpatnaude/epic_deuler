import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/gql/queries";
import { UPDATE_INVENTORY } from '../utils/gql/mutations';
import { InventoryList, UserCharacter } from "../components";
import Auth from '../utils/Auth';
var trinketArray = [];

const Inventory = () => {
  const { loading, data, error } = useQuery(QUERY_ME);

  const [equipItem, { error: equipError, data: equipData }] = useMutation(UPDATE_INVENTORY);
  var token = Auth.getToken();
  if (!token || Auth.isTokenExpired(token)) {
    window.location.assign('/');
  }
  const inventory = data?.me?.inventory || [];
  console.log(inventory.bag)

  // Dropdown active onclick
  const [activeDropdown, setActiveDropdown] = useState(null);
  const handleDropdownClick = (key) => {
    console.log(key);
    setActiveDropdown((prevKey) => (prevKey === key ? null : key));
  };

  // Handle item selection

  const handleItemClick = async (item, slot, remove) => {
    console.log(item);

    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }
    if (remove != true) {
      try {
        var action = 'equip';
        const { data } = await equipItem({
          variables: { itemId: item._id, action: action, slot: slot },
        });

      } catch (err) {
        console.error(JSON.parse(JSON.stringify(err)));
      }
    } else {
      console.log('remove it');
      try {
        var action = 'remove';
        const { data } = await equipItem({
          variables: { itemId: item, action: action, slot: slot },
        });

      } catch (err) {
        console.error(JSON.parse(JSON.stringify(err)));
      }
    }
    handleDropdownClick();
    trinketArray = [];
    // setSelectedItem(item);
  };


  // loading and errors
  if (loading) {
    return <div>Loading...</div>;
  } else if (data) {
    console.log(data);
  } else {
    console.log(JSON.parse(JSON.stringify(error)))
  }
  // var result = data.me.inventory.map(value => {
  //   value = value.name;
  // }
  // ).flat();

  const callKey = (key, icon) => {
    if (key === "weapon") {
      if (!trinketArray.includes(inventory.weapon._id)) {
        trinketArray.push(inventory.weapon._id);
      }
      if (icon === 'icon') {
        return (`${inventory.weapon.icon}`)
      } else if(icon === 'name') {
        return(`${inventory.weapon.name}`)
      } else {
        return(`${inventory.weapon._id}`)
      }
    }
    else if (key === "armor") {
      if (!trinketArray.includes(inventory.armor._id)) {
        trinketArray.push(inventory.armor._id);
      }
      if (icon === 'icon') {
        return (`${inventory.armor.icon}`)
      } else if(icon === 'name') {
        return(`${inventory.armor.name}`)
      } else {
        return(`${inventory.armor._id}`)
      }
    }
    else if (key === "slot1") {
      if (!trinketArray.includes(inventory.slot1._id)) {
        trinketArray.push(inventory.slot1._id);
      }
      if (icon === 'icon') {
        return (`${inventory.slot1.icon}`)
      } else if(icon === 'name') {
        return(`${inventory.slot1.name}`)
      } else {
        return(`${inventory.slot1._id}`)
      }

    }
    else if (key === "slot2") {
      if (!trinketArray.includes(inventory.slot2._id)) {
        trinketArray.push(inventory.slot2._id);
      }
      if (icon === 'icon') {
        return (`${inventory.slot2.icon}`)
      } else if(icon === 'name') {
        return(`${inventory.slot2.name}`)
      } else {
        return(`${inventory.slot2._id}`)
      }
    }
    else if (key === "slot3") {
      if (!trinketArray.includes(inventory.slot3._id)) {
        trinketArray.push(inventory.slot3._id);
      }
      if (icon === 'icon') {
        return (`${inventory.slot3.icon}`)
      } else if(icon === 'name') {
        return(`${inventory.slot3.name}`)
      } else {
        return(`${inventory.slot3._id}`)
      }
    }
    else if (key === "slot4") {
      if (!trinketArray.includes(inventory.slot4._id)) {
        trinketArray.push(inventory.slot4._id);
      }
      if (icon === 'icon') {
        return (`${inventory.slot4.icon}`)
      } else if(icon === 'name') {
        return(`${inventory.slot4.name}`)
      } else {
        return(`${inventory.slot4._id}`)
      }
    }
  }

  return (
    <div className=" is-size-5">
      <div className="has-text-centered ">
        Equipment
      </div>
      <div className="is-flex is-justify-content-center is-align-content-center is-flex-wrap-wrap container columns is-gapless" style={{ border: '4px solid rgba(1, 1, 1, 1)', backgroundColor: '#ffffff', textShadow: '2px 2px 10px #ffffff', borderRadius: '40px', padding: '0px' }} >
        {Object.keys(inventory).map((key, index) => {
          if (index > 0 && index < 7) {
            return (
              <div className={`dropdown p-2 m-2 is-block has-text-centered ${activeDropdown === key ? 'is-active' : ''} `} key={key} style={{ backgroundColor: '#a335ee', textShadow: '2px 2px 10px #ffffff', borderRadius: '20px', width: '140px'}} onClick={() => handleDropdownClick(key)} onBlur={() => handleDropdownClick()}>
                <div className="has-text-centered">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                <span className='button mb-2' style={{ whiteSpace: 'normal', height: '3rem', border: '2px solid rgba(1, 1, 1, 1)', borderRadius: '40px' }}>{callKey(key, 'name')}</span>
                <div className=" dropdown-trigger ">
                  
                  <button className="button equip is-outlined is-size-3 pl-4 pr-4 pb-1 pt-2" style={{ backgroundColor: '#e6cc80', textShadow: '2px 2px 10px #a335ee', borderRadius: '40px', borderBottom: '16px', borderBottomStyle: 'solid' }} >
                    <span>{callKey(key, 'icon')}</span>
                  </button>
                  
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                  <div className="dropdown-content">
                    {inventory.bag.map((item, i) => {
                      if (inventory.bag[i].itemtype === key && !trinketArray.includes(inventory.bag[i]._id)) {

                        return (
                          <button className="has-text-left dropdown-item dropdown button is-large" key={`${item.name}-${key}`} onMouseDown={() => handleItemClick(item, key)} >
                            <span className="button equip is-outlined is-size-5 pl-2 pr-2 pb-0 pt-0" style={{ backgroundColor: '#e6cc80', textShadow: '2px 2px 10px #a335ee', borderRadius: '40px', borderBottom: '8px', borderBottomStyle: 'solid' }}>{item.icon}</span>  {item.name}
                          </button>
                        );
                      } else if (inventory.bag[i].itemtype === 'trinket' && (key === 'slot1' || key === 'slot2' || key === 'slot3' || key === 'slot4') && !trinketArray.includes(inventory.bag[i]._id)) {
                        return (
                          <button className="has-text-left dropdown-item dropdown button is-large" key={`${item.name}-${key}`} onMouseDown={() => handleItemClick(item, key)}>
                            <span className="button equip is-outlined is-size-5 pl-2 pr-2 pb-0 pt-0" style={{ backgroundColor: '#e6cc80', textShadow: '2px 2px 10px #a335ee', borderRadius: '40px', borderBottom: '8px', borderBottomStyle: 'solid' }}>{item.icon}</span>  {item.name}
                          </button>
                        );
                      } else {
                        return null;
                      };
                    })}
                    <button className="has-text-left dropdown-item dropdown button is-large" key={`None-${key}`} onMouseDown={() => handleItemClick(callKey(key, 'id'), key, true)}>
                    <span className="button equip is-outlined is-size-5 pl-2 pr-2 pb-0 pt-0" style={{ backgroundColor: '#e6cc80', textShadow: '2px 2px 10px #a335ee', borderRadius: '40px', borderBottom: '8px', borderBottomStyle: 'solid' }}>🚫</span>  Unequip
                    </button>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="columns m-1">

        <div className="column is-two-fifths">
          {data ? (
            <UserCharacter data={data} />
          ) : (
            <div>
            </div>
          )}
        </div>

        <div className="column is-three-fifths">
          {data ? (
            <InventoryList data={data} />
          ) : (
            <div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Inventory;
