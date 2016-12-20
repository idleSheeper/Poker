////////////////////////////////
//////////class Player ////////
//////////////////////////////

function player(name, bankroll, cash, pot) {
    this.name = name;
    this.cash = document.getElementById(cash);
    this.pot = document.getElementById(pot);
    this.bankroll = bankroll;
    this.activePot = 0;
    this.active = 1;
    this.pocketHand = [];
    this.probability = [0.3, 0.8, 0.97 ,0.99]; //probability [fold, call, raise, raise2];
    
    this.setHand = function() {
        this.pocketHand = [randomCard(), randomCard()];
    }
    
    this.hideHand = function() {
        return [{value:'', color: 'Z'}, {value:'', color: 'Z'}];
    }
    
    this.showPot = function() {
        if(this.activePot > 0) {
            this.pot.style.visibility = "visible";
            this.pot.innerHTML = '$' + this.activePot.toString();
            this.cash.innerHTML = '$' + this.bankroll.toString();
        }
        else {
            this.pot.style.visibility = "hidden";
        }
    }
    
    this.newRound = function() {
        this.activePot = 0;
        this.active = 1;
        this.setHand();
    }
    
    this.changeBankroll = function(sum) {
        this.bankroll += sum;
        this.bankroll = Math.round(this.bankroll);
    }
    
    this.setProbability = function(fold, call, raise, raise2) {
         this.probability = [fold, call ,raise, raise2];
    }
    
    this.makeDecision = function(minimum) {
        var value = Math.random();
        var result = 0;
        if(value < this.probability[0]) 
            { 
                console.log(this.name + ' fold');
                this.active = 0;
                hideCards(this);
                return -1;
            } 
        else if((value < this.probability[1]) && (this.bankroll - (minimum - this.activePot) > 0)) 
            { 
                if(this.bankroll - (minimum - this.activePot) > 0){
                    result = minimum - this.activePot;
                    this.changeBankroll(-(result));
                    this.activePot += result;
                    console.log(this.name +' called '+result);
                    return result;
                }
            }
        else if(value > this.probability[1] && value < this.probability[2] && this.bankroll > minimum) {
            var sum = Math.round(Math.random()* 0.1 * (this.bankroll - minimum));
            this.changeBankroll(-sum - minimum); 
            this.activePot += sum + minimum;
            console.log(this.name +' raise ' + (sum+minimum).toString());
            return sum + minimum;
        }
         else if(value > this.probability[2] && value < this.probability[3] && this.bankroll > minimum) { 
            var sum = Math.round(Math.random() * Math.random() * (this.bankroll - minimum));
            this.changeBankroll(-sum - minimum); 
            this.activePot += sum + minimum;
            console.log(this.name +' raise ' + (sum+minimum).toString());
            return sum + minimum;
        }
        else {
            result = this.bankroll;
            this.changeBankroll(-this.bankroll); 
            this.activePot += result;
            console.log(this.name+ ' all in ' +result);
            return result;
        }
    }
    
    this.isPlayerFinish = function(minimum) {
        return (this.active === 1 && this.bankroll > 0 && this.activePot !== minimum);
    }
}

////////////////////////////////////////////
////Variables and functions for players////
//////////////////////////////////////////

var pots = [0, 0, 0, 0];
var potsRound = 0;
var minimum = 40;
var current = 0;
var countPlayers = 4;
var lastMode = 1;
var players = [new player('Player-1', 2000, 'cash-1', 'pot-1'), new player('Player-2', 2000, 'cash-2', 'pot-2'), 
               new player('Player-3', 2000, 'cash-3', 'pot-3'), new player('You', 2000, 'cash-you', 'pot-you')];

var message =[document.getElementById('start'), document.getElementById('wait'),
              document.getElementById('auction'), document.getElementById('winner'),
              document.getElementById('info')];

function showMessage(index) {
    for(var i = 0, len = message.length; i < len; i++){
        if(i === index) {
            message[i].style.zIndex = "100";
        }
        else message[i].style.zIndex = "-1";
    }
    if(index === 2) updateRaiseRange();
}

function updateTable() {
    players.forEach(function(gamer) {
        gamer.showPot();        
    });
    if(potsRound > 0) document.getElementById('pots').innerHTML = '$' + potsRound;
    else document.getElementById('pots').innerHTML = '';
}

function howMuchPlayersActive(val) {
    var count = 0;
    val.forEach(function(gamer){
        if(gamer.active) count++;
    });
    return count;
}

function resetPropertyActivePots(arr, value) {
      arr.forEach(function(gamer){
        gamer.activePot= value;
    });
};

function setCurrent() {
    var smallBlind = (dealer + 1) % countPlayers, 
        bigBlind = (dealer + 2) % countPlayers;
    pots[smallBlind] = 20;
    pots[bigBlind] = 40;
    players[smallBlind].activePot = 20;
    players[bigBlind].activePot = 40;
    players[smallBlind].changeBankroll(-20);
    players[bigBlind].changeBankroll(-40);
    message[4].innerHTML = '<p>The small blind is posted by ' + players[smallBlind].name + 
        '.</p><p>The big blind is posted by ' + players[bigBlind].name + '.</p>';
    current = (dealer+3) % countPlayers ;
}

function newStart() {
    dealer = Math.round(Math.random() * 3);   
    newRound();
    mode++; // =>to auction   
}

function newRound() {
    generatePack();
    potsRound = 0;
    pots = [0, 0, 0, 0];  
    players.forEach(function(gamer){
        gamer.newRound();
    });
    dealer = (dealer + 1) % players.length;
    setCurrent();
    updateTable();
    showCards(false);
    showMessage(1);
}

function showCards(end) {
    players.forEach(function(gamer, index) {
        if(gamer.name !== 'You' && gamer.active === 1) {
            if(end === false) displayCard(gamer.name.toLowerCase(), gamer.hideHand());
            else {
                hideCards(gamer);
                displayCard(gamer.name.toLowerCase(), gamer.pocketHand);
            }
        }
        else if(gamer.name === 'You' && gamer.active === 1) {
            if(end === true){}
            else displayCard(gamer.name.toLowerCase(), gamer.pocketHand);
        }
    });
}

function hideCards(gamer) {
        var x = document.getElementById(gamer.name.toLowerCase()); 
        x.removeChild(x.firstElementChild);
        x.removeChild(x.firstElementChild);
}

//function clearTable(){
//     players.forEach(function(gamer){
//         if(gamer.active === 1)hideCards(gamer);
//        }
//    );
//    var x = document.getElementById('table'); 
//        x.removeChild(x.firstElementChild);
//        x.removeChild(x.firstElementChild);
//        x.removeChild(x.firstElementChild);
//        x.removeChild(x.firstElementChild);
//        x.removeChild(x.firstElementChild);
//}
