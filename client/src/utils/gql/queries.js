import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  query me {
    me {
        _id
        name
        gold 
        wins
        deaths
        rating
        inventory {
          weapon {
            _id
            name
            icon
            itemtype
            price
            value
            description
          }
          armor {
            _id
            name
            icon
            itemtype
            price
            value
            description
          }
          slot1 {
            _id
            name
            icon
            itemtype
            price
            value
            description
          }
          slot2 {
            _id
            name
            icon
            itemtype
            price
            value
            description
          }
          slot3 {
            _id
            name
            icon
            itemtype
            price
            value
            description
          }
          slot4 {
            _id
            name
            icon
            itemtype
            price
            value
            description
          }
          bag {
            _id
            name
            icon
            itemtype
            price
            value
            description
          }
        }
        statblock {
          hp
          range
          attack
          defense
          crit
          parry
        }
     }  
    
  }
`;

export const QUERY_OPPONENT = gql`
  query opponent($name: String!) {
    opponent(name: $name) {
      _id
        name
        gold
        wins
        deaths
        rating
        inventory {
          weapon {
            _id
            name
            icon
            itemtype
            price
            value
            description
          }
          armor {
            _id
            name
            icon
            itemtype
            price
            value
            description
          }
          slot1 {
            _id
            name
            icon
            itemtype
            price
            value
            description
          }
          slot2 {
            _id
            name
            icon
            itemtype
            price
            value
            description
          }
          slot3 {
            _id
            name
            icon
            itemtype
            price
            value
            description
          }
          slot4 {
            _id
            name
            icon
            itemtype
            price
            value
            description
          }
          bag {
            _id
            name
            icon
            itemtype
            price
            value
            description
          }
        }
        statblock {
          hp
          range
          attack
          defense
          crit
          parry
        }
    }
  }
`;

export const QUERY_SHOP = gql`
  query getShop {  
    shop {
      _id
      name
      icon
      itemtype
      price
      value
      description         
    }
  }
`;

export const QUERY_CHARACTERS = gql`
  query getCharacters {
    characters {
      name
      wins
      deaths
      rating
      inventory {
        weapon {
          icon
        }
        armor {
          icon
        }
        slot1 {
          icon
        }
        slot2 {
          icon
        }
        slot3 {
          icon
        }
        slot4 {
          icon
        }
      }      
    }
  }
`;



