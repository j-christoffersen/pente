//prototypes


function Game() {
    this.board=[];
    this.captures=[0,0];
    this.winner=0;
}
Game.prototype.turn=0;
Game.prototype.value=0;

//constants
const PIECE_SIZE = 50;
const BORDER = 30;
const SPACE_SIZE = 63;
const BOARD_SIZE = 1204;

//debugging
var lastMove=[0,0];
//var oldTree;

//global variables
var mainGame = {
    turn: 1,
    board: [],
    captures: [0, 0]},
    pieces= [],
    difficulty=0;
    moves=[];
//var tree;

var matchTree;

//on load, initialize
$(function() {
    
    $.getJSON("./matchTree.php")
    .done(function(data, textStatus, jqXHR) {
        matchTree = $.map(data, function(value, index) {
            return [value];
        });
    });
    
});

function newGame(diff){
    
    //initialize game
    mainGame = {
    turn: 1,
    board: [],
    captures: [0, 0]};
    if(diff!==undefined){
        difficulty=diff;
    } else {
        difficulty=1;
    }
    //initialize board
    for (var i=0;i<19;i++){
        mainGame.board[i]=[];
        for(var j=0;j<19;j++){
            mainGame.board[i][j]=0;
        }
    }
    
    //hide windows
    var elements = document.getElementsByClassName("window");
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.visibility = "hidden";
    }
    
    clearBoard();
}

//courtesy of palswim from stack overflow
function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

//check board for captures and wins
function checkBoard(game,x,y) {
    var pattern=[game.turn,0,0,0];
    var dx=0;
    var dy = 0;
    var i = 0;
    var j = 0;
    var k = 0;
    var dirs=[{dx:1, dy:0}, {dx:0, dy:1},{dx:1, dy:1}, {dx:1, dy:-1}];
    //check for captures
    for(dx=-1;dx<2;dx++){
        for(dy=-1;dy<2;dy++){
            if(dx==0 && dy==0)
                continue;
            for(i=1;i<4;i++){
                if((x+dx*i)>18 || (x+dx*i)<0 || (y+dy*i)>18 || (y+dy*i)<0){
                    pattern=[game.turn,0,0,0];
                    break;
                }
                pattern[i]=game.board[x+dx*i][y+dy*i];
            }
            if((game.turn==1 && arraysEqual(pattern,[1,2,2,1])) || (game.turn==2 && arraysEqual(pattern,[2,1,1,2]))){
                game.board[x+dx][y+dy]=0;
                game.board[x+2*dx][y+2*dy]=0;
                game.captures[game.turn-1]++;
            }
        }
    }
    //check for gameover on 5 captures;
    if(game.captures[game.turn-1]==5){
        game.winner=game.turn;
    }
    //check for gameover on 5 in a row

    for(k=0;k<4;k++){
        var dx=dirs[k].dx;
        var dy=dirs[k].dy;
        if(dx==0 && dy==0)
            break;
        for(i=-4;i<1;i++){
            for(j=0;j<5;j++){
                if((x+dx*(j+i))>18 || (x+dx*(j+i))<0 || (y+dy*(j+i))>18 || (y+dy*(+i))<0)
                    break;
                if(game.board[x+dx*(j+i)][y+dy*(j+i)]==game.turn){
                    if(j==4){
                        game.winner=game.turn;
                    }
                } else {
                    break;
                }
            }
        }
    
    }
}

//computer's move
function computerMove(){
    //initialize tree if first move, else update it with new rows
    /*if(tree==undefined||jQuery.isEmptyObject(tree)){
        tree = new Branch;
        $.extend(true,tree.game,mainGame);
    }*/
    
    moves = [];//potential moves with same value, choose one at random
    
    //use minimax to decide best move
    var matchVal = minimax(mainGame, difficulty);
    
    var moveIndex = Math.floor(Math.random()*(moves.length));
    updateBoard(moves[moveIndex][0],moves[moveIndex][1]);
}

//returns value of best move
//bestVal: best on level of branch
//betterVal: value from parent level which can override function
function minimax(game, depth, betterVal){

    //if reached end, evaluate board position, create no branches
    if(depth==0){
        return evalBoard(game);
    }
    
    var bestVal;
    var min_i = 18;
    var max_i = 0;
    var min_j = 18;
    var max_j = 0;
    var i=0;
    var j=0;
    var n=0;
    var m=0;
    var curGame={};
    var timemout;
    
    //set reasonable boundaries
    for(i=0;i<19;i++){
        for(j=0;j<19;j++){
            if(game.board[i][j]!=0){
                if(i<min_i)
                    min_i=i;
                if(i>max_i)
                    max_i=i;
                if(j<min_j)
                    min_j=j;
                if(j>max_j)
                    max_j=j;
            }
        }
    }
    
    //for each potential move, create the board
    for(i=((min_i-2<0)?0:(min_i-2)),n=((max_i+3>19)?19:(max_i+3));i<n;i++){
        for(j=((min_j-2<0)?0:(min_j-2)),m=((max_j+3>19)?19:(max_j+3));j<m;j++){
            if(game.board[i][j]==0){
                
                //create new board
                curGame = new Game;
                $.extend(true,curGame,game);
                curGame.board[i][j] = curGame.turn;
                checkBoard(curGame,i,j);
                curGame.turn = (curGame.turn==1)?2:1;//change turn AFTER checking board
                
                //evaluate branch
                if(curGame.winner==0){
                var newVal;
                    if(bestVal===undefined){
                        newVal = -minimax(curGame, depth-1);
                    }else{
                        newVal = -minimax(curGame, depth-1, -bestVal);
                    }if(bestVal===undefined || newVal<=bestVal){
                        if(difficulty==depth){
                            if(newVal==bestVal){
                                moves.push([i,j]);
                            }else{
                                moves = [[i,j]];
                            }
                            
                        }
                        bestVal=newVal;
                        //override
                        if(bestVal<=betterVal){             //returns false if betterVal is undefined
                            return bestVal;
                        }
                        
                    }
                } else if(curGame.winner==curGame.turn){
                    return 200000;
                } else {
                    if(difficulty==depth)
                        moves = [[i,j]];
                    return -200000;
                }
                
            }
        }
    }
    return bestVal;
}

//evaluate a given board configuration
function evalBoard(game){

    var rating=0;
    var pattern=0;
    var i=0;
    var j=0;
    var dx=0;
    var dy=0;
    var k=0;
    var cur_node;

    //points for captures
    if(game.captures[1]>=5){
        rating+=200000;
    }else if(game.captures[1]>0){
        rating+=(game.captures[1]*Math.pow(5,4));
    }
    if(game.captures[0]>=5){
        rating-=200000;
    }else if (game.captures[0]>0){
        rating-=(game.captures[0]*Math.pow(5,4));
    }
    if(game.turn==2){
        rating*=-1;
    }
    
    //points for patterns

    for(i=0;i<19;i++){
        for(j=0;j<19;j++){
            for(dx=-1;dx<2;dx++){
                for(dy=-1;dy<2;dy++){
                    if(dx==0 && dy==0)
                        continue;
                    pattern=0;
                    //old code
                    /*for_k:
                    for(var k=0;k<6;k++){
                        if((i+k*dx)<0 || (i+k*dx)>18 || (j+k*dy)<0 || (j+k*dy)>18)
                            break;
                        if(game.turn==1){
                            if(game.board[i+k*dx][j+k*dy]==1)
                                pattern[k]=2;
                            else if(game.board[i+k*dx][j+k*dy]==2)
                                pattern[k]=1;
                            else
                                pattern[k]=0;
                        }else{
                            pattern[k]=game.board[i+k*dx][j+k*dy];    
                        }

                        switch(k){
                            case 0:
                                break;
                            case 1:
                                if(pattern[1]==0)
                                    break for_k;
                                break;
                            default:
                                for(var l=0;l<matches.length;l++){
                                    if(arraysEqual(pattern,matches[l].pat)){
                                        rating+=matches[l].pts;
                                    }
                                }
                                break;
                        }
                    }*/
                    
                    cur_node=matchTree;
                    k=0;
                    while(true){
                        //if coordinates outside boundaries, end loop
                        if((i+k*dx)<0 || (i+k*dx)>18 || (j+k*dy)<0 || (j+k*dy)>18)
                            break;
                            
                        if(game.turn==1){
                            switch(game.board[i+k*dx][j+k*dy]){
                                case 1:
                                    pattern=2;
                                    break;
                                case 2:
                                    pattern=1;
                                    break;
                                default:
                                    pattern=0;
                                    break;
                            }
                        }else{
                            pattern=game.board[i+k*dx][j+k*dy];    
                        }
                        
                        if(cur_node[pattern].length==0){
                            break;
                        }
                        cur_node = cur_node[pattern];
                        rating+=cur_node[3];
                        k++;
                    }
                }
            }
        }
    }
    return rating;
}
    
function clearBoard() {
    var element = document.getElementById("container");
    for (i=0;i<pieces.length;i++){
        element.removeChild(pieces[i]);
    }
    pieces.length=0;
}

function gameOver(winner){
    document.getElementById("gameover").style.visibility="visible";
    if(winner==1)
        document.getElementById("gameover-message").innerHTML =  "You win!";
    else
        document.getElementById("gameover-message").innerHTML =  "You lose!";
}

//creates piece element on position on board
function setPiece(x,y,pieceColor) {
    var piece=document.createElement("img");
    if(pieceColor==1){
        piece.src = "./img/Piece Green.png";
    } else {
        piece.src = "./img/Piece Yellow.png";
    }
    piece.className="piece";
    piece.style.position = "absolute";
    
    if(x>200){
        piece.style.top = (BORDER-PIECE_SIZE/2)+(18-y)*SPACE_SIZE+"px"
        piece.style.left = (BORDER-PIECE_SIZE/2)+BOARD_SIZE+(x-201)*SPACE_SIZE+"px";
    }else if(x>100){
        piece.style.top = (BORDER-PIECE_SIZE/2)+(y)*SPACE_SIZE+"px"
        piece.style.left = (BORDER-PIECE_SIZE/2)+BOARD_SIZE+(x-101)*SPACE_SIZE+"px";
    }else{
        piece.style.top = (BORDER-PIECE_SIZE/2)+y*SPACE_SIZE+"px";
        piece.style.left = (BORDER-PIECE_SIZE/2)+x*SPACE_SIZE+"px";
    }
    var element = document.getElementById("container");
    element.appendChild(piece);
    pieces.push(piece);
}

function playTurn(event) {
    var pos = $("#board").offset();
    
    var x = Math.round((event.clientX-pos.left-BORDER)/SPACE_SIZE);
    var y = Math.round((event.clientY+$(document).scrollTop()-pos.top-BORDER)/SPACE_SIZE);
    
    if(updateBoard(x,y)){
        return;
    }
    setTimeout(computerMove,50);

}

function updateBoard(x,y){
    
    //update main game
    mainGame.board[x][y]=mainGame.turn;
    checkBoard(mainGame,x,y);
    
    //re-draw board
    clearBoard();
    for(var i=0;i<19;i++){
        for(var j=0;j<19;j++){
            if(mainGame.board[i][j]==1){
                setPiece(i,j,1);
            } else if(mainGame.board[i][j]==2) {
                setPiece(i,j,2);
            }
            if(i==x && j==y && mainGame.turn == 2){
                $(pieces[pieces.length-1]).fadeIn(250).fadeOut(250).fadeIn(250).fadeOut(250).fadeIn(250);
            }
        }
    }
    
    
    //re-draw captures
    for(var i=0;i<mainGame.captures[0];i++){
        setPiece(101,i,2);
        setPiece(102,i,2);
    }
    for(var i=0;i<mainGame.captures[1];i++){
        setPiece(201,i,1);
        setPiece(202,i,1);
    }
    
    //check for winner
    if(mainGame.winner==mainGame.turn){
        gameOver(mainGame.turn);
        return true;
    }
    
    if(mainGame.turn==1){
        mainGame.turn++;
    } else {
        mainGame.turn=1;
    }
    
    return false;
}

function showRules() {
    var element = document.getElementById("rules");
    element.style.visibility = "visible";
    element = document.getElementById("play");
    element.style.visibility = "hidden";
}

function hideRules() {
    var element = document.getElementById("play");
    element.style.visibility = "visible";
    element = document.getElementById("rules");
    element.style.visibility = "hidden";
}
//Resources://
/*
http://ejohn.org/blog/javascript-trie-performance-analysis/
*/