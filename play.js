///////////////////////////////
/////////Game engine //////////
///////////////////////////////
//////  mode:             /////
//////  0 - start game    /////
//////  1 - auction       /////
//////  2 - flop          /////
//////  3 - turn          /////
//////  4 - river         /////
//////  5 - whoWin        ///// 
///////////////////////////////

var mode = 0;
var king = [];

function play() {
    if(mode === 0)
        newStart();        
    else if(mode === 1) {}
    else if(mode === 2) {
        console.log('We start flop.');
        table = [randomCard(), randomCard(), randomCard()];
        displayCard('table', table);  
        newAuction();
    }
    else if(mode === 3 || mode === 4) {
        mode === 3? console.log('We start turn.'): console.log('We start river.');;
        table.push(randomCard());
        addCard('table', table[table.length - 1]);         
        newAuction();
    }
    else if(mode === 5) {
        updateTable();
        console.log('Winner is...');
        decisionOfWinner();
    }        
}

function whoWin(){
    var winTable = [];
    var winner1 = []; 
    var winner2 = [];
    var result;
    players.forEach(function(gamer){
        if(gamer.active === 1) winTable.push(gamer);
    });
    
    console.log('Duels:');
    function forTwoPlayers(one, two){
        switch(winner(table.concat(one.pocketHand), table.concat(two.pocketHand))){
            case 1: 
                console.log(one.name + ' won with ' + two.name);
                return one;
                break;
            case -1:
                console.log(two.name + ' won with ' + one.name);
                return two;
                break;
            case 0:
                console.log(one.name + ' draws ' + two.name);
                return [one, two];
                break;
            default:
                console.log('Error!');
                break;
        } 
    }
    
    if(howMuchPlayersActive(players) === 2) return forTwoPlayers(winTable[0], winTable[1]);
    if(howMuchPlayersActive(players) === 3){
        winner1 = winner1.concat(forTwoPlayers(winTable[0], winTable[1]));
        winner2 = winner2.concat(forTwoPlayers(winTable[1], winTable[2]));
        if(winner1.length === 1 && winner2.length === 1)
            if(winner1 !== winner2) return forTwoPlayers(winner1[0], winner2[0]);
            else return winner1[0];
        else 
            if(winner1.length === 2 && winner2.length === 2) return winTable;
        else {
            if(winner1.length === 1) return winner1[0];
            else return winner2[0];
        }
    }
    if(howMuchPlayersActive(players) === 4){
        winner1 = winner1.concat(forTwoPlayers(winTable[0], winTable[1]));
        winner2 = winner2.concat(forTwoPlayers(winTable[2], winTable[3]));
        if(winner1.length === 1 && winner2.length === 1)
            return forTwoPlayers(winner1[0], winner2[0]);
        else {
            switch(winner(table.concat(winner1[0].pocketHand), table.concat(winner2[0].pocketHand))){
            case 1: 
                return winner1;
                break;
            case -1:
                return winner2;
                break;
            case 0:
                return winner1.concat( winner2);
                break;
            default:
                break;
        } 
        };
    }
    
}

function newAuction(){
        console.log('We start new round of auction.');
        potsRound += (pots[0] + pots[1] + pots[2] + pots[3]);
        minimum = 40;
        pots = [0, 0, 0, 0]; 
        current = (dealer + 2) % countPlayers;
        message[4].innerHTML = '<p>Jackpot: ' + potsRound + '!</p>';
        showMessage(1);
        resetPropertyActivePots(players, 0);
        updateTable();
        lastMode = mode;
        mode = 1;
}

function next(){
    if(mode === 1) auction();
    else play();
}

function auction(){
    if(howMuchPlayersActive(players) > 1 && theyPlays(players)) {
            if(players[current].active  === 1){ 
                if(current !== 3 ) {
                    auctionCurrent();
                    showMessage(1);
                    current = (current+1) % countPlayers;
                }
            else {
                showMessage(2);
            }
        }
        else {
            // current not active
            message[4].innerHTML = '<p>' + players[current].name + ' do not play.</p>';
            showMessage(1);
            current = (current+1) % countPlayers;
        }           
    }
    else {
        // All players are not active.
        if(current !== (dealer+2) % countPlayers && players[current].active === 1) {
            if(current === players.length -1) showMessage(2);
            else auctionCurrent();
        }
        mode = lastMode + 1;
        isLastMan();
        message[4].innerHTML = '<p>Next round.</p>';
        showMessage(1);
        console.log('The end of auction round.');
        return;
        }
    updateTable();    
}

function theyPlays(array) {
    if(array.length === 1) 
        return array[0].isPlayerFinish(minimum) ;
    else {
        return array[0].isPlayerFinish(minimum) || theyPlays(array.slice(1, array.length))};
}

function decisionOfWinner() {
    if(howMuchPlayersActive(players) > 1 ){
            showCards(true);   
            king = king.concat( whoWin());
            potsRound += (pots[0]+pots[1]+pots[2]+pots[3]);
            // Draws.
                if(king.length > 1 ){
                    var comment = ''; 
                    for(var i=0; i < king.length ; i++) {
                    comment += king[i].name;
                    if(i < king.length-1) comment += ' and '; 
                    king[i].changeBankroll(Math.round(potsRound / king.length));
                    king[i].cash.innerHTML = king[i].bankroll ;   
                    }
                    message[3].innerHTML = '<h2>Draws for ' + comment + '.</h2>';
                    console.log('Draws for ' + comment + '.');
                }
            // One winner.
                else {
                    message[3].innerHTML = "<h2>" + king[0].name+ ' won!' + '</h2>';
                    king[0].cash.innerHTML = Math.round(king[0].bankroll +potsRound);
                    console.log(king[0].name + ' won!');
                }

            potsRound = 0;
            showMessage(3);
            resetPropertyActivePots(players, 0);
            updateTable();
            if(players[players.length-1].cash.innerHTML === '$0')
                {
                    alert('You lose!');
                }
            }  
        else showMessage(3);
}