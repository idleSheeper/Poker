////////////////////////////////////
//////// Auction's functions ///////
////////////////////////////////////

function auctionCurrent() {
    if(howMuchPlayersActive(players) >1 && players[current].isPlayerFinish(minimum) ){
            auctionPlayer();
        }
}

function auctionPlayer() {
    var temp = 0;
        if(players[current].active && players[current].bankroll !== 0) {       
        temp = players[current].makeDecision(minimum);
        if(temp > -1) {
            pots[current] += temp;
            if(pots[current] === minimum) 
                message[4].innerHTML = '<p>'+ players[current].name + ' called.</p>';
                else 
                    message[4].innerHTML = '<p>'+ players[current].name + ' raised to '+ pots[current]+ '.</p>';
            minimum = Math.max.apply(null, pots); 
        }
            else{
            message[4].innerHTML = '<p>' + players[current].name + ' fold.</p>';
            }
        }        
}

function showVal() {
    document.getElementById("valBox").innerHTML = document.getElementById("inVal").value;
}

function updateRaiseRange(){
    var tag = document.getElementById("inVal");
    tag.setAttribute("min", minimum);
    tag.setAttribute("max", players[current].bankroll);
    tag.setAttribute("value", minimum);
    document.getElementById("valBox").innerHTML = minimum;
}

function fold() {
    console.log('You fold.');
    players[current].active = 0;
    hideCards(players[current]);   
    current = (current+1) % countPlayers;  
    message[4].innerHTML = '<p>You fold.</p>';
    showMessage(1);
}

function call() {
    var temp = players[current], result = 0;
    if( temp.bankroll - (minimum - temp.activePot) > 0) 
            { 
                if(temp.bankroll - (minimum - temp.activePot) > 0){
                    result = minimum - temp.activePot;
                    temp.changeBankroll(-(result));
                    temp.activePot += result;
                    console.log(temp.name + ' called ' + result + '.');
                    pots[current] += result;
                }
            }
    else{
        result = temp.bankroll;
            temp.changeBankroll(-temp.bankroll); 
            temp.activePot += result;
            console.log(temp.name + ' all in ' + result + '.');
        pots[current] += result;
    }
    message[4].innerHTML = '<p>'+ players[current].name + ' called.</p>';
    showMessage(1);
    updateTable();
    minimum = Math.max.apply(null, pots); 
    current = (current+1) % countPlayers;  
}

function raise() {
    if(players[current].bankroll > minimum) { 
            var sum = document.getElementById("inVal").value - players[current].activePot;
            players[current].changeBankroll(-sum); 
            players[current].activePot += sum;
            console.log('You raise to ' + sum + '.');
            pots[current] = Number(document.getElementById("inVal").value)
            message[4].innerHTML = '<p>'+ players[current].name + ' raise to $' + pots[current]+'.</p>';
            showMessage(1);
            updateTable();
            minimum = Math.max.apply(null, pots); 
            current = (current+1) % countPlayers;  
    }
}
    
function isLastMan() {
    if(howMuchPlayersActive(players) === 1){
            var winner ;
            players.forEach(function(gamer, index){
                if(gamer.active) winner = index;
            });
            potsRound += (pots[0]+pots[1]+pots[2]+pots[3]);
            players[winner].changeBankroll(potsRound);
            potsRound = 0;
            mode = 5;
            message[3].innerHTML = '<h2>' + players[winner].name.charAt(0).toUpperCase() + players[winner].name.slice(1)+' won!</h2>'; 
            showMessage(3);
            updateTable();
            resetPropertyActivePots(players, 0);
            players[winner].cash.innerHTML = players[winner].bankroll;
            play();
            console.log(players[winner].name + ' win!');
        }
}