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

  const inventory = data?.me?.inventory || [];
  console.log(inventory.bag)

  // Dropdown active onclick
  const [activeDropdown, setActiveDropdown] = useState(null);
  const handleDropdownClick = (key) => {
    console.log(key);
    setActiveDropdown((prevKey) => (prevKey === key ? null : key));
  };

  // Handle item selection

  const handleItemClick = async (item, slot) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }
    try {
      var action = 'equip';
      const { data } = await equipItem({
        variables: { itemId: item._id, action: action, slot: slot},
      });

    } catch (err) {
      console.error(JSON.parse(JSON.stringify(err)));
    }
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

  const callKey = (key) => {
    if (key === "weapon") {
      trinketArray.push(inventory.slot1.name);
      return (`${inventory.weapon.icon} ${inventory.weapon.name}`)
    }
    else if (key === "armor") {
      trinketArray.push(inventory.slot1.name);
      return (`${inventory.armor.icon} ${inventory.armor.name}`)
    }
    else if (key === "slot1") {
      trinketArray.push(inventory.slot1.name);
      return (`${inventory.slot1.icon} ${inventory.slot1.name}`)
      
    }
    else if (key === "slot2") {
      trinketArray.push(inventory.slot2.name);
      return (`${inventory.slot2.icon} ${inventory.slot2.name}`)
    }
    else if (key === "slot3") {
      trinketArray.push(inventory.slot3.name);
      return (`${inventory.slot3.icon} ${inventory.slot3.name}`)
    }
    else if (key === "slot4") {
      trinketArray.push(inventory.slot4.name);
      console.log(trinketArray);
      return (`${inventory.slot4.icon} ${inventory.slot4.name}`)
    }
  }

  return (
    <div className=" is-size-5">
      <div className="has-text-centered ">
      Equipment
      </div>
      <div className="is-flex is-justify-content-center is-align-content-center is-flex-wrap-wrap container" style={{ border: '4px solid rgba(1, 1, 1, 1)', borderRadius: '40px',  padding: '25px' }}>
      {Object.keys(inventory).map((key, index) => {
        if (index > 0 && index < 7) {
          return (
            <div className={`dropdown ${activeDropdown === key ? 'is-active' : ''} `} key={key._id}>
              <div className="dropdown-trigger ">
                <button className="button is-outlined is-large" onClick={() => handleDropdownClick(key)}>
                  <span>{callKey(key)}</span>
                  <span className="icon is-small">
                    <i className="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                  {inventory.bag.map((item, i) => {
                    if (inventory.bag[i].itemtype === key) {
                      console.log(key);
                      return (
                        <button className="dropdown-item" key={`${item.name}-${key}`} onClick={() => handleItemClick(item, key)}>
                          {item.icon}  {item.name}
                        </button>
                      );
                    } else if (inventory.bag[i].itemtype === 'trinket' && (key === 'slot1' || key === 'slot2' || key === 'slot3' || key === 'slot4') && !trinketArray.includes(inventory.bag[i].name)){
                      return (
                        <button className="dropdown-item" key={`${item.name}-${key}`} onClick={() => handleItemClick(item, key)}>
                          {item.icon}  {item.name}
                        </button>
                      );
                    } else {
                      return null;
                    };
                  })}
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
        <UserCharacter data={data} />
      </div>

      <div className="column is-three-fifths">
        <InventoryList data={data} />
      </div>
      
      </div>
    </div>
  );
}

export default Inventory;
