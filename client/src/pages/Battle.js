import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_CHARACTER } from "../utils/gql/mutations";
import { Container, Button } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import { QUERY_ME, QUERY_OPPONENT } from "../utils/gql/queries";
import Combatant from "../utils/combatant";
import Auth from '../utils/Auth';
var battleLoad = 0;
var playerTurn = true;
const playerLogCss = 'is-pulled-right log';
const opponentLogCss = 'has-text-right log';
const rollLogCss = 'tag is-info log is-large is-light fromtop';
const attackLogCss = 'tag is-warning log is-large is-light';
var player1;
var player2;
var playerHp;
var opponentHp;
var nextAction;
var hit;
var defense;


function Battle() {
    //DEFINE BATTLE STATE
    const [battleState, setbattleState] = useState({
        playerRoll: 0,
        opponentRoll: 0,
        playerTurns: 0,
        opponentTurns: 0,
        initRolls: 0,
        playerRollIcon: '🌀',
        opponentRollIcon: '🌀',
        actionDes: 'START BATTLE',
        combatLog: [],
    });


    const opponent = localStorage.getItem('current_opponent')
        ? JSON.parse(localStorage.getItem('current_opponent'))
        : false;
    console.log(opponent);
    const { loading, data, error } = useQuery(QUERY_ME);
    const { loading: loading2, data: data2 } = useQuery(QUERY_OPPONENT, {
        variables: { name: opponent },
    });
    const [charUpdate, { error: charUpdateError, data: charUpdateData }] = useMutation(UPDATE_CHARACTER);

    var token = Auth.getToken();
    if (!token || Auth.isTokenExpired(token)) {
        window.location.assign('/');
    }
    const getPlayerIcon = (icon, slot, player) => {
        if (!player.isAlive() && slot === 'armor') {
            return '🪦'
        } else if (!player.isAlive() && slot === 'weapon') {
            return '☠️'
        }
        if (icon === '🚫' && slot === 'weapon') {
            return '👊';
        } else if (icon === '🚫' && slot === 'armor') {
            return '👶';
        } else {
            return icon;
        };
    };

    if (loading || loading2) {
        return <div>Loading...</div>;
    } else if (data && data2 && battleLoad === 0) {
        //DEFINE COMBATANTS
        player1 = new Combatant(data.me.name, data.me.statblock.range, data.me.statblock.hp, data.me.statblock.attack, data.me.statblock.crit, data.me.statblock.defense, data.me.statblock.parry, playerLogCss, data.me.rating);
        player2 = new Combatant(data2.opponent.name, data2.opponent.statblock.range, data2.opponent.statblock.hp, data2.opponent.statblock.attack, data2.opponent.statblock.crit, data2.opponent.statblock.defense, data2.opponent.statblock.parry, opponentLogCss, data2.opponent.rating);
        battleLoad++;
        playerHp = player1.hitpoints;
        opponentHp = player2.hitpoints;

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
                if (turnAction === 'attack' || turnAction === 'opportunity') {
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

                } else if (turnAction === 'opportunityRoll') {
                    playerTurn = !playerTurn;
                    rollDice();
                    nextAction = 'opportunity';
                } else if (turnAction === 'initResult') {
                    if (playerTurn) {
                        battleState.combatLog.push({ "action": `${data.me.name} moves first!`, "bulma": `${playerLogCss} fromleft` });
                    } else {
                        battleState.combatLog.push({ "action": `${data2.opponent.name} moves first!`, "bulma": `${opponentLogCss} fromright` });
                    }
                    nextAction = 'roll';
                } else if (turnAction === 'init') {
                    rollInit();
                    nextAction = 'initResult';
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
            }, 300);

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
                battleState.combatLog.push({ "action": `${gain}💎`, "bulma": "button is-info has-text-centered is-large is-fullwidth title" });
            }
            const { data: charWin } = await charUpdate({
                variables: { name: winner.name, win: true, gain: gain },
            });
            console.log(charWin);

        } catch (err) {
            console.error(JSON.parse(JSON.stringify(err)));
        }
        try {
            var gain = 0;
            if (!player1.isAlive()) {
                gain = (player2.rating * 10) + 25;
                console.log('this should be sworksgfogjnfgoni')
                battleState.combatLog.push({ "action": `-${Math.floor(gain / 7)}💎`, "bulma": "button is-danger has-text-centered is-large is-fullwidth title" });
            }
            const { data: charLoss } = await charUpdate({
                variables: { name: loser.name, win: false, gain: gain },
            });
            console.log(charLoss);

        } catch (err) {
            console.error(JSON.parse(JSON.stringify(err)));
        }
        setbattleState({
            ...battleState,
            combatLog: [...battleState.combatLog],

        });
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
        if (playerTurn) {
            battleState.playerTurns++
            battleState.combatLog.push({ "action": ` ${player1.name} attacks!`, "bulma": `${attackLogCss} fromleft` });
        } else {
            battleState.combatLog.push({ "action": `${player2.name} attacks!`, "bulma": `${attackLogCss} fromright` });
            battleState.opponentTurns++
        }
    };

    function rollInit() {

        const playerInit = Math.floor(Math.random() * 20) + 1;
        const opponentInit = Math.floor(Math.random() * 20) + 1;
        battleState.playerRoll = playerInit;
        battleState.opponentRoll = opponentInit;
        battleState.playerRollIcon = '🌀';
        battleState.opponentRollIcon = '🌀';
        if (playerInit === opponentInit) {
            rollInit()
        } else if (opponentInit > playerInit) {
            playerTurn = false;
            battleState.combatLog.push({ "action": `(${opponentInit}) 🎲🌀 INITIATIVE 🌀🎲 (${playerInit})`, "bulma": rollLogCss });

        } else {
            playerTurn = true;
            battleState.combatLog.push({ "action": `(${opponentInit}) 🎲🌀 INITIATIVE  🌀🎲 (${playerInit})`, "bulma": rollLogCss });

        }
        battleState.initRolls++;
        nextAction = 'initResult';
    }

    return (
        <>
            <Container>
                <div className="tile is-ancestor">
                    <div className="tile is-vertical is-12">
                        <div className="columns is-mobile mt-2 box p-0" style={{ border: '4px solid rgba(1, 1, 1, 1)', backgroundImage: 'url("landscape-scene.jpg")', backgroundSize: 'cover', borderRadius: '40px' }}>
                            <div className="tile is-parent pr-1">
                                <div className="tile is-child p-0">

                                    <div className="is-flex health-display has-text-right button mb-0 p-1" style={{ border: '3px solid rgba(1, 1, 1, 1)', borderRadius: '40px', marginLeft: '-10px' }}>
                                        <progress className="progress is-danger is-large mb-0" id="health" value={playerHp} max={data.me.statblock.hp}></progress><span className="span-outline">❤️</span>
                                        <Badge key={playerHp} className='is-size-6-mobile is-size-4 column p-0 pop-hp'>{playerHp}</Badge>
                                    </div>
                                    <div className="is-mobile columns mt-2 ml-0">
                                        <div key={battleState.playerTurns} className="column p-0 ">
                                            <p className="is-size-3 is-size-6-mobile battle-name pop-crit">
                                                {data.me.name.charAt(0).toUpperCase() + data.me.name.slice(1)}</p>
                                            <p className="is-size-2 is-size-4-mobile column playerAttack" style={{ textShadow: '2px 2px 10px #a335ee, -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black, 0px 0px 20px #ffffff', }}>
                                                {getPlayerIcon(data.me.inventory.armor.icon, 'armor', player1)}
                                                {getPlayerIcon(data.me.inventory.weapon.icon, 'weapon', player1)}
                                            </p>
                                        </div>
                                        <div className="p-1 has-text-right button mr-3 is-size-7-mobile" key={battleState.playerTurns + battleState.opponentTurns + battleState.initRolls} style={{ border: '2px solid rgba(1, 1, 1, 1)', borderRadius: '40px' }}>
                                            ({battleState.playerRoll})<span className="span-outline fromtop"> 🎲{battleState.playerRollIcon}</span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="tile is-parent pl-1 mr-2">
                                <div className="has-text-right tile is-child p-0">
                                    <div className="is-flex health-display button p-1" style={{ border: '3px solid rgba(1, 1, 1, 1)', borderRadius: '40px', marginRight: '-12px' }}>
                                        <Badge key={opponentHp} className='is-size-4 is-size-6-mobile column p-0 pop-hp'>{opponentHp}</Badge>
                                        <span className="span-outline">
                                            ❤️</span>
                                        <progress className="progress is-danger is-large" id="health" value={opponentHp} max={data2.opponent.statblock.hp}></progress>

                                    </div>
                                    <div className="is-mobile columns mt-2 mr-0">
                                        <div className="p-1 has-text-left ml-3 is-size-7-mobile button" key={battleState.playerTurns + battleState.opponentTurns + battleState.initRolls + 1}style={{ border: '2px solid rgba(1, 1, 1, 1)', borderRadius: '40px' }}>
                                            <span className="span-outline fromtop">
                                                {battleState.opponentRollIcon}🎲
                                            </span>
                                            ({battleState.opponentRoll})
                                        </div>
                                        <div key={battleState.opponentTurns} className="column p-0  has-text-right">
                                            <p className="is-size-3 is-size-6-mobile battle-name pop-crit">
                                                {data2.opponent.name.charAt(0).toUpperCase() + data2.opponent.name.slice(1)}</p>
                                            <p className="is-size-2 is-size-4-mobile column opponentAttack" style={{ textShadow: '2px 2px 10px #a335ee, -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black, 0px 0px 20px #ffffff', }}>
                                                {getPlayerIcon(data2.opponent.inventory.weapon.icon, 'weapon', player2)}{getPlayerIcon(data2.opponent.inventory.armor.icon, 'armor', player2)}
                                            </p>
                                        </div>


                                    </div>





                                </div>
                            </div>
                        </div>
                        <div className="tile is-parent" style={{ border: '4px solid rgba(1, 1, 1, 1)', borderRadius: '40px' }}>
                            <div id="messageBody" className="panel-Body box scroll is-size-4 is-size-6-mobile is-flex">
                                <div className=" buy button is-warning has-text-centered is-large is-fullwidth title" style={{ backgroundColor: '#e6cc80', textShadow: '2px 2px 10px #ffffff, -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black', borderRadius: '40px', height: '80px' }} onClick={() => (startFight())}>
                                    <p className="title">{battleState.actionDes}</p>
                                </div>
                                {battleState.combatLog.map((element) => (<div className={element.bulma} onClick={() => (startFight())}>{element.action}</div>))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
}

export default Battle;