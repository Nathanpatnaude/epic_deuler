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
    return ('#0070dd')
  } else {
    return ('#a335ee')
  }
  
  }
  return (
    <>
    <div className="has-text-centered ">
    <h1 className="title has-text-centered is-size-2 equip" style={{ backgroundColor: '#e6cc80', textShadow: '2px 2px 10px #a335ee', display: 'inline-block', fontSize: '33px', borderRadius: '60px', boxShadow: ' 0 0 8px #999', padding: '0.5em 0.6em', marginBottom:'-50px', borderBottom: '16px', borderBottomStyle: 'solid' }}><span className='span-outline'>💼</span></h1>
      </div>
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        
        <ListGroup key='bag' className="is-flex section is-flex-wrap-wrap field label box has-text-centered pl-0 pr-0" style={{ border: '4px solid rgba(1, 1, 1, 1)', borderRadius: '40px', padding: '30px'}}>
          {itemData.map((item) => (
          <div className={`dropdown pr-0 m-1 is-block has-text-centered columns is-mobile is-flex`} key={item._id} style={{ backgroundColor: `${ifNotEquipped(item._id)}`, textShadow: '2px 2px 10px #ffffff', borderRadius: '20px', width: '328px', height: '230px'}}>
            <div className=' pl-1 py-1' style={{ width: '148px' }}>
                
                
                <div className="mt-2 mb-2">
                  
                <div className="bauble equip is-size-3 pl-4 pr-4 pb-1 pt-3">
                    <span>{item.icon}</span>
                  </div>
                  
                </div>
                <span className='button mb-2 is-size-5 p-1 equip' style={{backgroundColor: `#e6cc80`, whiteSpace: 'normal', height: '4rem', border: '2px solid rgba(1, 1, 1, 1)', borderRadius: '40px', width: '95%' }}>{item.name}</span>
                <div className="has-text-centered tag is-info is-medium">{item.itemtype.charAt(0).toUpperCase() + item.itemtype.slice(1)}</div>
                </div>
                <div className='column py-2 px-1'>
                <ListGroup.Item className=" container box has-text-weight-bold is-size-5 has-text-centered pt-1 pb-0 px-0 mr-1" style={{ border: '2px solid rgba(1, 1, 1, 1)', borderRadius: '20px', height: '100%'}}><div className='centered-element px-1' style={{ marginLeft: '-4px'}}>{item.description}</div></ListGroup.Item>
                </div>
                

              </div>
          // <ListGroup.Item>
          //   <Badge className='is-pulled-left pb-2 equip' style={{ backgroundColor: '#e6cc80', textShadow: '2px 2px 10px #a335ee', display: 'inline-block', fontSize: '30px', borderRadius: '60px', boxShadow: ' 0 0 8px #999', padding: '0.5em 0.6em', margin: '0px', marginTop: '-16px', borderBottom: '16px', borderBottomStyle: 'solid' }}>{item.icon}</Badge>
          //   {item.name}
          //   {ifNotEquipped(item._id)}
          //   </ListGroup.Item>


          
          // <ListGroup.Item className='tag is-medium is-info is-pulled-left'>{item.itemtype}</ListGroup.Item>
          // <ListGroup.Item className='tag is-outline is-medium is-warning is-pulled-right'>{item.price / 2}</ListGroup.Item>
))}
        </ListGroup>
      )
      }
    </>
  );
};

export default InventoryList;