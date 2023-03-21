import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_CHARACTER } from "../utils/gql/mutations";
import { Container, Button } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import { QUERY_ME, QUERY_OPPONENT } from "../utils/gql/queries";
import Combatant from "../utils/combatant";
var battleLoad = 0;
var playerTurn = true;
const playerLogCss = 'is-pulled-right log';
const opponentLogCss = 'has-text-right log';
const rollLogCss = 'tag is-info log is-large is-light';
const attackLogCss = 'tag is-warning log is-large is-light';
const moveLogCss = 'tag is-success log is-large is-light';
var player1;
var player2;
var playerHp;
var opponentHp;
var nextAction;
var hit;
var defense;


//interval turn(
// inverval modifierRoll(
//if nextroll is (initiative or hit) > clearinterval
//executeAction()
//modify actionDesc, nextRoll, Attacker, HP
//ifDead(clear))
//2 SEC
//ifDead(clear)
//performRoll (hit or init)
//actionDesc = describe roll ("character attacks!", "Roll initaive")
//sets next roll (attack or hit)
//)1 SEC



function Battle() {

    // messageBodyArray
    // form stat variables:  
    //              actionRoll1 actionIcon1 actionRoll1 actionIcon1
    //              actionDesc, nextRollType
    //              currentHp1, currentHp2
    //
    //fight()
    //performRoll(type: nextroll) setDice, turns++, setTurn
    //executeAction(nextroll(when nextroll is an attack)
    //DEFINE BATTLE STATE
    const [battleState, setbattleState] = useState({
        playerRoll: 0,
        opponentRoll: 0,
        playerRollIcon: '🌀',
        opponentRollIcon: '🌀',
        actionDes: 'START BATTLE',
        combatLog: [],
    });

    // const [playerHp, setPlayerHp] = useState(0);
    // const [opponentHp, setOpponentHp] = useState(0);
    const opponent = localStorage.getItem('current_opponent')
        ? JSON.parse(localStorage.getItem('current_opponent'))
        : false;
    console.log(opponent);
    var myStats;
    var opponentStats;
    const { loading, data, error } = useQuery(QUERY_ME);
    const { loading: loading2, data: data2 } = useQuery(QUERY_OPPONENT, {
        variables: { name: opponent },
    });
    const [charUpdate, { error: charUpdateError, data: charUpdateData }] = useMutation(UPDATE_CHARACTER);

    if (loading || loading2) {
        return <div>Loading...</div>;
    } else if (data && data2 && battleLoad === 0) {
        //DEFINE COMBATANTS
        player1 = new Combatant(data.me.name, data.me.statblock.range, data.me.statblock.hp, data.me.statblock.attack, data.me.statblock.crit, data.me.statblock.defense, data.me.statblock.parry, playerLogCss, data.me.rating);
        player2 = new Combatant(data2.opponent.name, data2.opponent.statblock.range, data2.opponent.statblock.hp, data2.opponent.statblock.attack, data2.opponent.statblock.crit, data2.opponent.statblock.defense, data2.opponent.statblock.parry, opponentLogCss, data2.opponent.rating);
        battleLoad++;
        playerHp = player1.hitpoints;
        opponentHp = player2.hitpoints;
        // setPlayerHp(playerHp + data.me.statblock.hp);
        // setOpponentHp(opponentHp + data2.opponent.statblock.hp);
        console.log(data.me);
        console.log(player1);
        console.log(data2.opponent);
        console.log(player2);
    } else if (data && data2) {
        if (player1.hitpoints > 0 && player2.hitpoints > 0) {
            playerHp = player1.hitpoints;
            opponentHp = player2.hitpoints;
        } else if (player1.hitpoints <= 0) {
            playerHp = 0;
            opponentHp = player2.hitpoints;
        } else {
            playerHp = player1.hitpoints;
            opponentHp = 0;
        }
        console.log(battleState);


    } else {
        console.log(JSON.parse(JSON.stringify(error)))
    }

    const startRound = (action) => {
        var attackRound;
        if (playerTurn) {
            attackRound = player1.attack(player2, action, hit, defense);
            playerHp = attackRound.thisHp;
            opponentHp = attackRound.targethp;
        } else {
            attackRound = player2.attack(player1, action, hit, defense);
            playerHp = attackRound.targethp;
            opponentHp = attackRound.thisHp;
        }
        console.log(attackRound);
        battleState.combatLog.push(...attackRound.logArray);

        console.log(battleState);
        return attackRound.nextAction;

    };

    // const pushCombatLog = (logArray) => {


    // } 


    const startFight = () => {
        if (battleState.actionDes === 'START BATTLE' && (playerHp > 0 && opponentHp > 0)) {
            battleState.actionDes = '';
            console.log(this);
            rollInit();
            const turnInterval = setInterval(() => {
                var turnAction = nextAction;
                if (turnAction === 'attack') {
                    console.log(nextAction);
                    nextAction = startRound(nextAction);
                    console.log(nextAction);
                    if (!player1.isAlive() || !player2.isAlive()) {
                        if (player1.isAlive()) {
                            endBattle(player1, player2)
                        } else {
                            endBattle(player2, player1)
                        }
                        clearInterval(turnInterval);
                        console.log('Game over!');
                    }

                } else if (turnAction === 'opportunity') {
                    playerTurn = !playerTurn;
                    rollDice();
                    nextAction = startRound(nextAction);
                } else if (turnAction === 'init') {
                    rollInit();
                    nextAction = 'roll';
                } else if (turnAction === 'endTurn') {
                    playerTurn = !playerTurn;
                    nextAction = 'roll';
                } else if (turnAction === 'dead') {
                    if (player1.isAlive()) {
                        endBattle(player1, player2)
                    } else {
                        endBattle(player2, player1)
                    }
                    clearInterval(turnInterval);
                    console.log('Game over!');
                } else if (turnAction === 'roll') {
                    playerTurn ? battleState.combatLog.push({ "action": ` ${player1.name} attacks!`, "bulma": attackLogCss }) : battleState.combatLog.push({ "action": `${player2.name} attacks!`, "bulma": attackLogCss });
                    rollDice();
                    nextAction = 'attack';
                } else {
                    clearInterval(turnInterval);
                    console.log('Something went wrong!');
                }
                setbattleState({
                    ...battleState,
                    combatLog: [...battleState.combatLog],

                });
            }, 200);

        } else if (battleState.actionDes === 'START BATTLE') {
            battleLoad = 0;
            setbattleState({
                ...battleState,
                combatLog: [...battleState.combatLog],

            });
        } else if (battleLoad === 2) {
            battleState.combatLog.pop();
            setbattleState({
                ...battleState,
                combatLog: [...battleState.combatLog],

            });
            battleLoad++;
        } else if (battleLoad === 3) {
            
        }
    };

    async function endBattle(winner, loser) {
        battleState.combatLog.push({ "action": `☠️ ${loser.name} IS DEAD 🪦`, "bulma": rollLogCss });
        battleLoad++;
        
        try {
            var gain = 0;
            if (player1.name === winner.name) {
                gain = (player2.rating * 10) + 25;
                battleState.combatLog.push({ "action": `${gain}💎`, "bulma": "button is-warning has-text-centered is-large is-fullwidth title" });
            }
            const { data: charWin } = await charUpdate({
                variables: { name: winner.name, win: true, gain: gain },
            });
            console.log(charWin);

        } catch (err) {
            console.error(JSON.parse(JSON.stringify(err)));
        }
        console.log(charUpdateData);
        try {
            var gain = 0;
            if (player1.name === loser.name) {
                gain = (player2.rating * 10) + 25;
            }
            const { data: charLoss } = await charUpdate({
                variables: { name: loser.name, win: false, gain: gain },
            });
            console.log(charLoss);

        } catch (err) {
            console.error(JSON.parse(JSON.stringify(err)));
        }

        console.log(battleLoad);
    }

    function rollDice() {
        hit = Math.floor(Math.random() * 20) + 1;
        defense = (Math.floor(Math.random() * 20) + 1);
        if (playerTurn) {
            battleState.combatLog.push({ "action": `(${hit}) 🎲🗡️ ROLL 🛡️🎲 (${defense})`, "bulma": rollLogCss });
            battleState.playerRollIcon = '🗡️';
            battleState.opponentRollIcon = '🛡️';
            battleState.playerRoll = hit;
            battleState.opponentRoll = defense;
        } else {
            battleState.combatLog.push({ "action": `(${defense}) 🎲🛡️ ROLL 🗡️🎲 (${hit})`, "bulma": rollLogCss });
            battleState.playerRollIcon = '🛡️';
            battleState.opponentRollIcon = '🗡️';
            battleState.playerRoll = defense;
            battleState.opponentRoll = hit;
        };

    };

    function rollInit() {

        const playerInit = Math.floor(Math.random() * 20) + 1;
        const opponentInit = Math.floor(Math.random() * 20) + 1;
        // setbattleState({
        //     ...battleState,
        battleState.playerRoll = playerInit;
        battleState.opponentRoll = opponentInit;
        battleState.playerRollIcon = '🌀';
        battleState.opponentRollIcon = '🌀';


        // });

        if (playerInit === opponentInit) {
            rollInit()
        } else if (opponentInit > playerInit) {
            playerTurn = false;
            battleState.combatLog.push({ "action": `(${opponentInit}) 🎲🌀 INITIATIVE 🌀🎲 (${playerInit})`, "bulma": rollLogCss });
            battleState.combatLog.push({ "action": `${data2.opponent.name} moves first!`, "bulma": opponentLogCss });
        } else {
            playerTurn = true;
            battleState.combatLog.push({ "action": `(${opponentInit}) 🎲🌀 INITIATIVE  🌀🎲 (${playerInit})`, "bulma": rollLogCss });
            battleState.combatLog.push({ "action": `${data.me.name} moves first!`, "bulma": playerLogCss });
        }
        nextAction = 'roll';
    }





    return (
        <>
            <Container>
                <div className="tile is-ancestor">
                    <div className="tile is-vertical is-12">
                        <div className="columns is-mobile">
                            <div className="tile is-parent">
                                <div className="has-text-left tile is-child box">
                                    <progress className="progress is-danger" id="health" value={playerHp} max={data.me.statblock.hp}></progress>
                                    <div className="is-inline health-display">
                                        <Badge className='is-size-6-mobile column is-pulled-right' style={{ display: 'inline-block', fontSize: '25px', borderRadius: '60px', boxShadow: ' 0 0 8px #999', padding: '0.5em 0.6em', margin: '0px' }}>{playerHp}/{data.me.statblock.hp}</Badge>
                                        <p className="title is-size-4-mobile">{data.me.name}</p>
                                        <p className="subtitle">
                                            {/* {data.me.inventory.forEach((slot) => (
                                    <Badge className='is-pulled-left' style={{ display: 'inline-block', fontSize: '12px', borderRadius: '60px', boxShadow: ' 0 0 8px #999', padding: '0.5em 0.6em', margin:'0px' }}>{slot.icon}</Badge>
                                ))} */}
                                        </p>
                                    </div>
                                    <div>


                                    </div>
                                </div>
                            </div>
                            <div className="tile is-parent">
                                <article className="has-text-right tile is-child box">
                                    <div className="is-inline health-display">
                                        <progress className="progress is-danger" id="health" value={opponentHp} max={data2.opponent.statblock.hp}></progress>
                                        <div className="is-inline health-display">
                                            <Badge className='column is-pulled-left is-size-6-mobile' style={{ display: 'inline-block', fontSize: '25px', borderRadius: '60px', boxShadow: ' 0 0 8px #999', padding: '0.5em 0.6em', margin: '0px' }}>{opponentHp}/{data2.opponent.statblock.hp}</Badge>
                                            <p className="title is-size-4-mobile">{data2.opponent.name}</p>
                                            <p className="subtitle">
                                                {/* {data.me.inventory.forEach((slot) => (
                                    <Badge className='is-pulled-left' style={{ display: 'inline-block', fontSize: '12px', borderRadius: '60px', boxShadow: ' 0 0 8px #999', padding: '0.5em 0.6em', margin:'0px' }}>{slot.icon}</Badge>
                                ))} */}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                        <div className="tile is-parent">
                            <div id="messageBody" className="panel-Body box scroll is-size-4 is-size-6-mobile">
                                <div className="button is-warning has-text-centered is-large is-fullwidth title" onClick={() => (startFight())}>
                                    <p className="title">{battleState.actionDes}</p>
                                </div>
                                {battleState.combatLog.map((element) => (<div className={element.bulma} onClick={() => (startFight())}>{element.action}</div>))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="columns is-mobile">
                    <div className="column">
                        <div className="has-text-left  box">
                            <p className="title">🎲{battleState.playerRollIcon} ({battleState.playerRoll})</p>

                        </div>
                    </div>
                    <div className="column">
                        <article className="has-text-right  box">
                            <p className="title">🎲{battleState.opponentRollIcon} ({battleState.opponentRoll})</p>
                        </article>
                    </div>
                </div>
            </Container>
        </>
    );
}

export default Battle;