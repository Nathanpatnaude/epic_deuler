import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_ME } from "../../utils/gql/queries";
import { UPDATE_INVENTORY } from '../../utils/gql/mutations';
import Auth from '../../utils/Auth';




const InventoryList = ({ data }) => {
  var itemData;
  const { loading, data: data1, error } = useQuery(QUERY_ME);
  const [sellItem, { error: purchaseError, data: purchaseData }] = useMutation(UPDATE_INVENTORY);
  var data2;
  data1 ? itemData = data1.me.inventory.bag : data2 = loading;
  console.log(data2);
  console.log(itemData);
  // const itemData = JSON.stringify(shopData.shop)
  // const itemList = Object.keys(inventory).map((key, index) => 
 
  const handlePurchase = async (item) => {
    console.log(item);
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }
    
      try {
        var action = 'sell';
        const { data } = await sellItem({
          variables: { itemId: item, action: action },
        });

      } catch (err) {
        console.error(JSON.parse(JSON.stringify(err)));
      }
    
  };

  const ifNotEquipped = (itemid) => {
    const equipped = [data1.me.inventory.weapon._id, data1.me.inventory.armor._id, data1.me.inventory.slot1._id, data1.me.inventory.slot2._id, data1.me.inventory.slot3._id, data1.me.inventory.slot4._id];
    if (!equipped.includes(itemid)) {
    return ( <Button className='is-pulled-right' onClick={() => handlePurchase(itemid)} style={{ backgroundColor: 'orange', borderRadius: '40px', padding: '10px', paddingTop: '3px', paddingLeft: '20px', position: 'right', right: '160px', alignItems: 'center', width: 'fit-content', display: 'initial', fontSize: '33px' }} >Sell💎</Button>
    )
  } else {
    return (<Button className='is-pulled-right' style={{ backgroundColor: 'orange', borderRadius: '40px', padding: '10px', paddingTop: '3px', paddingLeft: '20px', position: 'right', right: '160px', alignItems: 'center', width: 'fit-content', display: 'initial', fontSize: '33px' }} ></Button>)
  }
  
  }
  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (itemData.map((item) => (

        <ListGroup key={item.name} className="section field label box has-text-centered" style={{ border: '4px solid rgba(1, 1, 1, 1)', borderRadius: '40px', fontSize: '33px', padding: '25px' }}>
          <ListGroup.Item>
            <Badge className='is-pulled-left' style={{ display: 'inline-block', fontSize: '30px', borderRadius: '60px', boxShadow: ' 0 0 8px #999', padding: '0.5em 0.6em', margin: '0px' }}>{item.icon}</Badge>
            {item.name}
            {ifNotEquipped(item._id)}
            </ListGroup.Item>


          <ListGroup.Item className='is-size-5'>{item.description}</ListGroup.Item>
          <ListGroup.Item className='tag is-medium is-info is-pulled-left'>{item.itemtype}</ListGroup.Item>
          <ListGroup.Item className='tag is-outline is-medium is-warning is-pulled-right'>{item.price / 2}</ListGroup.Item>

        </ListGroup>
      )))
      }
    </>
  );
};

export default InventoryList;
{/* 
<div className="item-container is-full columns">
        <div className="column is-three-fifths">
          <section className="in-center ">
            <div className="container ">
              <ul className='is-full'>
                <li className='box'>
                  <div className="in-line level" >
                    <div className="level-left">
                      <div className="item-icon">🔪</div>
                      <div className="item-name">name</div>
                      <div className="item-value">value</div>
                    </div>

                    <div className="level-right">
                      <button className="button is-primary is-medium">Sell</button>
                    </div>
                  </div>
                </li>
                <li className='box'>
                  <div className="in-line level" >
                    <div className="level-left">
                      <div className="item-icon">🔪</div>
                      <div className="item-name">name</div>
                      <div className="item-value">value</div>
                    </div>

                    <div className="level-right">
                      <button className="button is-primary is-medium">Sell</button>
                    </div>
                  </div>
                </li>
                <li className='box'>
                  <div className="in-line level" >
                    <div className="level-left">
                      <div className="item-icon">🔪</div>
                      <div className="item-name">name</div>
                      <div className="item-value">value</div>
                    </div>

                    <div className="level-right">
                      <button className="button is-primary is-medium">Sell</button>
                    </div>
                  </div>
                </li>
                <li className='box'>
                  <div className="in-line level" >
                    <div className="level-left">
                      <div className="item-icon">🔪</div>
                      <div className="item-name">name</div>
                      <div className="item-value">value</div>
                    </div>

                    <div className="level-right">
                      <button className="button is-primary is-medium">Sell</button>
                    </div>
                  </div>
                </li>
                <li className='box'>
                  <div className="in-line level" >
                    <div className="level-left">
                      <div className="item-icon">🔪</div>
                      <div className="item-name">name</div>
                      <div className="item-value">value</div>
                    </div>

                    <div className="level-right">
                      <button className="button is-primary is-medium">Sell</button>
                    </div>
                  </div>
                </li>
                <li className='box'>
                  <div className="in-line level" >
                    <div className="level-left">
                      <div className="item-icon">🔪</div>
                      <div className="item-name">name</div>
                      <div className="item-value">value</div>
                    </div>

                    <div className="level-right">
                      <button className="button is-primary is-medium">Sell</button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </div>

        <div className='column is-two-fifths'>
          Charactery

        </div>
      </div> */}