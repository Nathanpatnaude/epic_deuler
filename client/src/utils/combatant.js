const playerCritLogCss = 'is-pulled-right tag is-danger log is-large is-light';
const opponentCritLogCss = 'has-text-right tag is-danger log is-large is-light';
const critLogCss = 'tag column is-danger log is-large is-light';
class Combatant {
  constructor(name, strength, hitpoints, atk, crit, def, parry, logCss, rating) {
    this.name = name;
    this.strength = strength;
    this.hitpoints = hitpoints;
    this.atk = atk;
    this.crit = crit;
    this.def = def;
    this.parry = parry;
    this.logCss = logCss;
    this.rating = rating;
  }
  //items 1 statUnit = +12hp, +1 stat, +2 range 
  // 🛡️ ⚔️ 🩸 🎲 
  // 🥋🎽🥷👩‍🚀🧑‍🚒👷🦹🏼‍♀️⛑️🪖👑👒🤖💀💥
  //🔪🦯🗡️🪓⚔️🏏🦴🪄
  //🪙🧿📿🎀❤️💠🔱🎲🎖️🥇🥈🥉🥽👓💍
  printStats() {
    console.log(`❤️ (${this.hitpoints})  -(${this.name})-`);
  }

  isAlive() {
    if (this.hitpoints > 0) {
      return (true);
    } else {
      return (false);
    }
  }


  // RETURNS { [logs], nextAction }
  attack(target, action, hit, defense) {

    // const hit = Math.floor(Math.random() * 20) + 1;
    // const defense = (Math.floor(Math.random() * 20) + 1);

    var logArray = [];
    var nextAction = '';

    if (hit > defense + target.parry || (hit >= 20 - this.crit && (hit > defense + target.parry))) {
      // HIT or CRITICAL(!PARRY)
      // HIT damage is reduced by target.def
      var damage = Math.floor(Math.random() * this.strength) + 1 + this.atk - target.def;

      if (defense === 1) {
        // POOR DEFENSE on a roll of 1 attack does max.strength damage
        damage = this.strength + this.atk - target.def;
      }
      if (hit >= 20 - this.crit) {
        // CRITICAL range increased by attacker's.crit
        if (defense >= 20 - target.crit) {
          //MUTUAL CRITICAL nullifies 2x crit modifier
          //MUTUAL CRITICAL grants defender BASH attack
          var bash = Math.floor(Math.random() * target.def) + 1;
          if (defense > hit) {
            // higher defense roll recieves additional .crit bonus
            bash += Math.floor(Math.random() * target.crit) + 1;
            logArray.push({ "action": `🎯 MUTUAL CRITICAL! 🛡️`, "bulma": `${critLogCss} pop-crit`});
          } else {
            // higher hit roll recieves additional .crit bonus
            damage += Math.floor(Math.random() * this.crit) + 1;
            logArray.push({ "action": `🎯 MUTUAL CRITICAL! 🗡️`, "bulma": `${critLogCss} pop-crit`});
          }
          // logArray.push({ "action": `${this.name} 🎯🗡️ BRUTAL STRIKE!`, "bulma": this.logCss });
          if (damage <= 0) {
            logArray.push({ "action": `${target.name} 🛡️ BLOCKED!`, "bulma": `${target.logCss} pop-outin-block`});
          } else {
            target.hitpoints -= damage;
            logArray.push({ "action": `${target.name} 🩸 ${damage} DAMAGE!`, "bulma": `${target.logCss} pop-outin`});
          }

          if (target.hitpoints > 0) {
            // logArray.push({ "action": `${target.name} 🎯🛡️ PERFECT DEFENSE!`, "bulma": target.logCss });
            this.hitpoints -= bash;
            logArray.push({ "action": `${this.name} 💥 ${bash} DAMAGE!`, "bulma": `${this.logCss} pop-outin-bash`});
            if (action === 'opportunity') {
              nextAction = 'roll';
            } else {
              nextAction = 'endTurn';
            };
            return { logArray, nextAction, "thisHp": `${this.hitpoints}`, 'targetHp': `${target.hitpoints}` };
          } else {
            nextAction = 'dead';
            return { logArray, nextAction, "thisHp": `${this.hitpoints}`, 'targetHp': `${target.hitpoints}` };
          }


        }
        // CRITICAL damage recieves additional attackers.strength dice roll &&  this.crit bonus
        if (defense + Math.floor(target.strength / 3) + target.def + target.parry <= 13 + (this.crit * 2)) {
          // CRITICAL additional damage is max.strength on a low defense roll
          // this effect range is reduced by the 1/3target's.strength + .def +.parry and increased by 2*attackers.crit
          damage += this.strength + this.crit;
          logArray.push({ "action": `🎯 CRITICAL HIT! 🗡️`, "bulma": `${this.logCss} ${critLogCss} pop-crit` });
          // logArray.push({ "action": `${this.name} 🎯🗡️ BRUTAL STRIKE!`, "bulma": this.logCss });
        } else {
          damage += Math.floor(Math.random() * this.strength) + Math.floor(Math.random() * this.crit) + 1;
          logArray.push({ "action": `🎯 CRITICAL HIT! 🗡️`, "bulma": `${this.logCss} ${critLogCss} pop-crit` });
          // logArray.push({ "action": `${this.name} 🎯🗡️ BRUTAL STRIKE!`, "bulma": this.logCss });
        }
      }

      if (damage <= 0) {
        logArray.push({ "action": `${target.name} 🛡️ BLOCKED!`, "bulma": `${target.logCss} pop-outin-block`});
        if (action === 'opportunity') {
          nextAction = 'roll';
        } else {
          nextAction = 'endTurn';
        };
        return { logArray, nextAction, "thisHp": `${this.hitpoints}`, 'targetHp': `${target.hitpoints}` };
      } else {
        target.hitpoints -= damage;

        logArray.push({ "action": `${target.name} 🩸 ${damage} DAMAGE!`, "bulma": `${target.logCss} pop-outin`});
        if (action === 'opportunity') {
          nextAction = 'roll';
        } else {
          nextAction = 'endTurn';
        };
        return { logArray, nextAction, "thisHp": `${this.hitpoints}`, 'targetHp': `${target.hitpoints}` };
      }

    } else if (hit >= defense && hit <= defense + target.parry) {
      // PARRY (range increased by parry stat)
      // PARRY occurs when hit = defense 
      if (defense >= 20 - target.crit - target.parry) {
        // CRITICAL PARRY (range increased by crit or parry stat)
        logArray.push({ "action": `🎯 CRITICAL PARRY! ⚔️`, "bulma": `${target.logCss} ${critLogCss} pop-crit` });
        var glance = Math.floor(Math.random() * target.strength / 2) + 1 + target.parry + target.atk - this.def;
        // logArray.push({ "action": `${target.name} ⚔️🎯 RETALIATES! `, "bulma": target.logCss });
        if (glance <= 0) {
          logArray.push({ "action": `${this.name} ⚔️ DEFLECTED!`, "bulma": `${this.logCss} pop-outin-block`});
        } else {
          this.hitpoints -= glance;
          logArray.push({ "action": `${this.name} ⚔️ ${glance} DAMAGE!`, "bulma": `${this.logCss} pop-outin-glance`});
        }
        if (this.hitpoints > 0) {
          if (hit >= 20 - this.crit - this.parry) {
            // CRITICAL RETALIATION (if oppenents parry is also a CRITICAL)
            // logArray.push({ "action": `${this.name} ⚔️🎯 RETALIATES! `, "bulma": this.logCss });
            var glance2 = Math.floor(Math.random() * this.strength / 2) + 1 + this.parry + this.atk - target.def;

            if (glance2 <= 0) {
              logArray.push({ "action": `${target.name} ⚔️ DEFLECTED!`, "bulma": `${target.logCss} pop-outin-block`});
            } else {
              target.hitpoints -= glance2;
              logArray.push({ "action": `${target.name} ⚔️ ${glance2} DAMAGE!`, "bulma": `${target.logCss} pop-outin-glance`});
            }
          }
        } else {
          // logArray.push({ "action": `${this.name} STUMBLES!`, "bulma": this.logCss });
          nextAction = 'dead';
          return { logArray, nextAction, "thisHp": `${this.hitpoints}`, 'targetHp': `${target.hitpoints}` };
        }

      } else {
        // PARRY
        logArray.push({ "action": `${target.name} ⚔️ PARRY!`, "bulma": `${target.logCss} pop-outin-glance` });
      }
      // PARRY results in a INITIATIVE ROLL to reset turn order
      if (target.hitpoints > 0 && this.hitpoints > 0) {
        nextAction = 'init';
        return { logArray, nextAction, "thisHp": `${this.hitpoints}`, 'targetHp': `${target.hitpoints}` };

      } else if (target.hitpoints <= 0) {
        nextAction = 'dead';
        // logArray.push({ "action": `${target.name} STUMBLES!`, "bulma": target.logCss });
        return { logArray, nextAction, "thisHp": `${this.hitpoints}`, 'targetHp': `${target.hitpoints}` };
      } else {
        nextAction = 'dead';
        // logArray.push({ "action": `${this.name} STUMBLES!`, "bulma": this.logCss });
        return { logArray, nextAction, "thisHp": `${this.hitpoints}`, 'targetHp': `${target.hitpoints}` };
      }


    } else {
      if (hit === 1) {
        // CRITICAL MISS (only roll of 1) causes OPPORTUNITY ATTACK
        // OPPORTUNITY ATTACK is a bonus attack that does not alter turn order
        logArray.push({ "action": `🎯 CRITICAL MISS! 💨`, "bulma": `${this.logCss} ${critLogCss} pop-crit` });
        // logArray.push({ "action": `${this.name} STUMBLES!`, "bulma": this.logCss });
        logArray.push({ "action": `${target.name} ☄️ OPPORTUNITY ATTACK!`, "bulma": `${target.logCss} pop-outin-block`});
        if (action === 'opportunity') {
          nextAction = 'endTurn';
        } else {
          nextAction = 'opportunityRoll';
        };
        return { logArray, nextAction, "thisHp": `${this.hitpoints}`, 'targetHp': `${target.hitpoints}` };
      } else if (defense >= 20 - target.crit + this.parry) {
        // CRITICAL BLOCK (range increased by crit stat)
        logArray.push({ "action": `🎯 CRITICAL BLOCK! 🛡️`, "bulma": `${target.logCss} ${critLogCss} pop-crit` });
        // logArray.push({ "action": `${target.name} 🎯🛡️ PERFECT DEFENSE!`, "bulma": target.logCss });
        if (hit <= (target.def * 2) + Math.floor(Math.random(target.strength / 2)) + target.crit) {
          // BASH occurs when the blocked attack roll is lower than the combined defenders strength and defense
          // BASH damage is based on the defenders def value
          var bash3 = Math.floor(Math.random() * target.def) + 1 + Math.floor(Math.random() * target.crit);

          if (bash3 > 0) {
            this.hitpoints -= bash3;
            logArray.push({ "action": `${this.name} 💥 ${bash3} DAMAGE!`, "bulma": `${this.logCss} pop-outin-bash`});
          }
        }
        if (this.hitpoints > 0) {
          //CRITICAL BLOCK results in an OPPORTUNITY ATTACK
          //OPPORTUNITY ATTACK is a bonus attack that does not alter turn order
          // logArray.push({ "action": `${this.name} STUMBLES!`, "bulma": this.logCss });
          logArray.push({ "action": `${target.name} ☄️ OPPORTUNITY ATTACK!`, "bulma": `${target.logCss} pop-outin-block`});
          if (action === 'opportunity') {
            nextAction = 'endTurn';
          } else {
            nextAction = 'opportunityRoll';
          };
          return { logArray, nextAction, "thisHp": `${this.hitpoints}`, 'targetHp': `${target.hitpoints}` };
        } else {
          // logArray.push({ "action": `${this.name} STUMBLES!`, "bulma": this.logCss });
          nextAction = 'dead';
          return { logArray, nextAction, "thisHp": `${this.hitpoints}`, 'targetHp': `${target.hitpoints}` };
        }
      } else if (defense - Math.floor((this.strength) / 2) <= hit - (Math.floor(target.def / 1.1) + target.parry)) {
        //GLANCING ATTACK results in a halved attack if the HIT and DEFENSE rolls were close
        //GLANCING ATTACK range is increased by the Attacker's.strength and reduced by defender's.def
        //bigger weapons have a higher chance to cause partial damage vs low .def
        var glance3 = Math.floor(Math.random() * this.strength / 2) + 1 + this.atk - target.def;
        if (glance3 <= 0) {
          logArray.push({ "action": `${target.name} 🛡️ BLOCKED!`, "bulma": `${target.logCss} pop-outin-block`});
          if (action === 'opportunity') {
            nextAction = 'roll';
          } else {
            nextAction = 'endTurn';
          };
          return { logArray, nextAction, "thisHp": `${this.hitpoints}`, 'targetHp': `${target.hitpoints}` };
        } else {
          target.hitpoints -= glance3;
          logArray.push({ "action": `${target.name} 💫 ${glance3} DAMAGE!`, "bulma": `${target.logCss} pop-outin-glance`});
          if (action === 'opportunity') {
            nextAction = 'roll';
          } else {
            nextAction = 'endTurn';
          };
          return { logArray, nextAction, "thisHp": `${this.hitpoints}`, 'targetHp': `${target.hitpoints}` };
        }
      } else {
        // BLOCK the attack did not land or do any damage
        logArray.push({ "action": `${target.name} 🛡️ BLOCKED!`, "bulma": `${target.logCss} pop-outin-block`});
        if (action === 'opportunity') {
          nextAction = 'roll';
        } else {
          nextAction = 'endTurn';
        };
        return { logArray, nextAction, "thisHp": `${this.hitpoints}`, 'targetHp': `${target.hitpoints}` };
      }
    }
  }
}

export default Combatant

// Creates two unique characters using the "character" constructor
// name, strength, hitpoints, atk, crit, def, parry   4, 60, 0, 0,0,0
// const grace = new Character('Grace', 10, 72, 3, 2, 3, 3); //15
// const dijkstra = new Character('Dijks', 4, 60, 0, 0, 0, 0); //16
// var graceTurn = true;



// ROLL INITIATIVE randomly determines who goes next
// rollInit() determines who attacks first and is triggered by a parry event
// function rollInit() {

//   const graceInit = Math.floor(Math.random() * 20) + 1;
//   const dijkstraInit = Math.floor(Math.random() * 20) + 1;

//   if (graceInit === dijkstraInit) {
//     rollInit()
//   } else if (dijkstraInit > graceInit) {
//     graceTurn = false;
//     console.log(`Initiative Roll:
// 🎲   (${dijkstraInit}) VS (${graceInit})
// ${dijkstra.name} moves first!`);
//   } else {
//     graceTurn = true;
//     console.log(`Initiative Roll:
// 🎲   (${graceInit}) VS (${dijkstraInit})
// ${grace.name} moves first!`);
//   }
// }

// grace.printStats();
// dijkstra.printStats();
// rollInit();

// const turnInterval = setInterval(() => {

//   // If either character is not alive, end the game
//   if (!grace.isAlive() || !dijkstra.isAlive()) {
//     clearInterval(turnInterval);
//     console.log('Game over!');
//   } else if (graceTurn) {
//     var result = grace.attack(dijkstra);
//     dijkstra.printStats();
//     grace.printStats();
//     console.log(result);
//   } else {
//     var result = dijkstra.attack(grace);
//     dijkstra.printStats();
//     grace.printStats();
//     console.log(result);
//   }

//   // Switch turns
//   graceTurn = !graceTurn;
// }, 1000);
