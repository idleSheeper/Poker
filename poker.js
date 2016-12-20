/////////////////////////////////////
////////////code for cards///////////
/////////////////////////////////////

var pack = [];

function generatePack() {
    for(var i = 2; i < 15; i++) 
        pack.push({value: i, color: 'H'});
    for(var i = 2; i < 15; i++)
        pack.push({value: i, color: 'D'});
    for(var i = 2; i < 15; i++)
        pack.push({value: i, color: 'C'});
    for(var i = 2; i < 15; i++)
        pack.push({value: i, color: 'S'});
    console.log('The pack was generated.');
}

function randomCard() {
    var index = Math.round(Math.random() * (pack.length - 1));   
    var card = pack[index];
    pack.splice(index, 1);
    return card;
}

function sortValue(obj1, obj2) {
    if(obj1.value > obj2.value)
        return -1;
    else if(obj1.value < obj2.value) 
        return 1;
    else 
        return 0;
}

function sortColor(obj1, obj2) {
    if(obj1.color > obj2.color)
        return -1;
    else if(obj1.color < obj2.color)
        return 1;
    else 
        return 0;
}
    
function checkHand(hand) {
    hand.push({value: 0, color: 'Z'});        
    hand.sort(sortValue);
    var hands = { 
        hightCard: hand[0].value,
        firstPar: null,
        secondPar: null,
        three: null,
        four: null,
        full: null,
        straight: null,
        flush: null,
        poker: null
        };
    var temp = hand[0];
    var count = 1;
    
    //check one par, two par, three and four of a kind
    for (var i = 1, len = hand.length; i < len; i++) {
        if (temp.value === hand[i].value) 
            count += 1;
        else 
        {
            switch(count){
                case 1:
                    break;
                case 2: 
                    if(!hands.firstPar)
                         hands.firstPar = temp.value;
                    else if(!hands.secondPar)
                        hands.secondPar = temp.value;
                    break;
                case 3:
                    if (!hands.three) 
                        hands.three = temp.value;
                    else if(!hands.firstPar)
                             hands.firstPar = temp.value;
                        else if(!hands.secondPar)
                            hands.secondPar = temp.value;
                    break;
                case 4:
                    if (!hands.three) 
                        hands.four = temp.value;
                    break;
                default:
                    break;                 
            }
        temp = hand[i];
        count = 1;
        }
    }  
     
    //check Straight (strit)
    var temp = hand[0],
        count = 1;
    for (var i = 1, len = hand.length-1; i < len; i++) {
        if (temp.value  - hand[i].value > count) {
                count = 1;
                temp = hand[i];
            }
        else {
            if(temp.value === hand[i].value + count)
                count += 1;
        }
        if(count === 5 || (temp.value === 5 && count === 4 && hand[0].value === 14)) {
            hands. straight = temp.value;
            break;
        }
    }
        
    //check full house
    if(hands.three !== null && hands.firstPar !== null)
        hands.full = [hands.three, hands.firstPar];  
    
    //check flush (color)
    hand.sort(sortColor);
    temp = hand[0],
    count = 1;
    for (var i = 1, len = hand.length; i < len; i++) {
        if(temp.color === hand[i].color) 
            count++;
        else {
            count = 1;
            temp = hand[i];
        }
        if(count === 5){
            hands.flush = temp;
            break;
        }
    }
    
    //check straight-flush (poker)
   if(hands.flush && hands.straight) {
       console.log("check poker")
        function isCard(card, value, color) {
            if(card.value === value && card.color === color) return true;
            else return false;
        };
        function existCard(value, color){
            for(var i = 0, len = hand.length-1 ; i < len; i++) {
                if(isCard(hand[i], value, color)) {
                    return true; 
                    break;}
            }
            return false;
        }
        if(existCard(hands.straight, hands.flush) &&
        existCard(hands.straight-1, hands.flush) &&
        existCard(hands.straight-2, hands.flush) &&
        existCard(hands.straight-3, hands.flush) &&
        ( (hands.straight === 5 && existCard(14, hands.flush)) || existCard(hands.straight-4, hands.flush) ))
            hands.poker = hands.straight;           
        }
    hand.splice(0,1);
    return hands;
}

function winner(hand1, hand2) {
    function maxHands(hand) {
        if(hand.poker) return { hand: hand.poker, points: 9 };
        else if(hand.four) return { hand: hand.four, points: 8 };
        else if(hand.full) return { hand: hand.full, points: 7 };
        else if(hand.flush) return { hand: hand.flush, points: 6 };
        else if(hand.straight) return { hand: hand.straight, points: 5 };
        else if(hand.three) return { hand: hand.three, points: 4 };
        else if(hand.secondPar) return { hand: [hand.firstPar, hand.secondPar], points: 3 };
        else if(hand.firstPar) return { hand: hand.firstPar, points: 2 };
        else return { hand: hand.hightCard, points: 1 };
    }
    
    var player1 = maxHands(checkHand(hand1));
    var player2 = maxHands(checkHand(hand2));
    
    if(player1.points > player2.points) return 1;
    else if(player1.points < player2.points) return -1;
        else switch(player1.points) {
            case 1: 
            case 2:
            case 4:
            case 5:
            case 8:
            case 9:
                if(player1.hand > player2.hand) return 1;
                    else if(player1.hand < player2.hand) return -1;
                        else  return 0;
                break;

            case 6:
                if(player1.hand.value > player2.hand.value) return 1;
                    else if(player1.value < player2.hand.value) return -1;
                        else  return 0;
                break;
                
            case 3:
            case 7:
                if(player1.hand[0] > player2.hand[0]) return 1;
                    else if(player1.hand[0] < player2.hand[0]) return -1;
                        else if(player1.hand[1] > player2.hand[1]) return 1;
                            else if(player1.hand[1] < player2.hand[1]) return -1;
                                else  return 0;
                break;        
        }
}

//////////////////////////////////
///////// Display cards //////////
//////////////////////////////////

function createDivCard(card) {
    var element = document.createElement( 'div');
    var value = [];
    switch(card.value) {
        case 11:
            value[0] = 'rank-j';
            value[1] = 'J';
            break;
        case 12:
            value[0] = 'rank-q';
            value[1] = 'Q';
            break;
        case 13:
            value[0] = 'rank-k';
            value[1] = 'K';
            break;
        case 14:
            value[0] = 'rank-a';
            value[1] = 'A';
            break;
        default:
            value[0] = 'rank-' + card.value; 
            value[1] = card.value;
            break;
    }
    switch(card.color){
        case 'H': 
            value[2] = 'hearts';
            break;
        case 'S': 
            value[2] = 'spades';
            break;
        case 'C': 
            value[2] = 'clubs';
            break;
        case 'D': 
            value[2] = 'diams';
            break;
        default: 
            value[2] = 'back';
    }                    
    element.classList.add('card', value[0], value[2]);
    element.innerHTML = '<span class="rank">'+ value[1] +'</span><span class="suit">&'+ value[2] +';</span>';
    return element;
}

function addCard(tag, card) {
var x = document.getElementById(tag); 
var li =document.createElement('li'); 
    li.appendChild(createDivCard(card));
    x.appendChild(li);
}

function displayCard(tag, cards) {
        cards.forEach(function(value){addCard(tag, value)});
}