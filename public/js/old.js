//computer's move
function computerMove(){
    //initialize tree if first move, else update it with new rows
    if(tree==undefined||jQuery.isEmptyObject(tree)){
        tree = {};
        tree.game = $.extend(true,[],mainGame);
    }
    var t0=performance.now();
    tree.branches=getBranches(tree, difficulty);
    var t1=performance.now();
    console.log("getBranches time: "+(t1-t0));
    
    //use minimax to decide best move
    t0=performance.now();
    evalTime=0;
    var matchVal = minimax(tree);
    t1=performance.now();
    console.log("minimax time: "+(t1-t0));
    console.log("eval time: "+(evalTime));
    
    var moves = [];//potential moves with same value, choose one at random
    for(var i=0;i<tree.branches.length;i++){
        if(tree.branches[i].value==-matchVal){
            moves.push(tree.branches[i].move);
        }
    }
    var moveIndex = Math.floor(Math.random()*(moves.length));
    updateBoard(moves[moveIndex][0],moves[moveIndex][1]);
}

//returns value of best move
//bestVal: best on level of branch
//betterVal: value from parent level which can override function
function minimax(branch,betterVal){
    if(branch.branches.length==0){
        var t0=performance.now();
        branch.value=evalBoard(branch.game);
        var t1=performance.now();
        evalTime+=(t1-t0);
        return branch.value;
    }
    var bestVal;
    for(var ii=0;ii<branch.branches.length;ii++){
        var newVal;
        if(bestVal===undefined){
            newVal = -minimax(branch.branches[ii]);
        }else{
            newVal = -minimax(branch.branches[ii],-bestVal);
        }
        if(bestVal===undefined || newVal<bestVal){
            bestVal=newVal;
            if(bestVal<=betterVal){             //returns false if betterVal is undefined
                branch.value = bestVal;
                return branch.value;
            }
        }
    }
    branch.value = bestVal;
    return branch.value;
}

function getBranches(branch, depth){
    var branches = [];
    if(depth==0)
        return [];
        
    //check if board is a win or loss, if so return value instead of getting new branches
    if(branch.value>=100000||branch.value<=-100000){
        branch.value*=-1;
        return [];
    }
    
    //if no branches exist yet, create new branch for each possible move within bounds
    if(jQuery.isEmptyObject(branch.branches)){
        //set reasonable boundaries
        var min_i = 18;
        var max_i = 0;
        var min_j = 18;
        var max_j = 0;
        
        for(var i=0;i<19;i++){
            for(var j=0;j<19;j++){
                if(branch.game.board[i][j]!=0){
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
        
        for(var i=((min_i-2<0)?0:(min_i-2)),n=((max_i+3>19)?19:(max_i+3));i<n;i++){
            for(var j=((min_j-2<0)?0:(min_j-2)),m=((max_j+3>19)?19:(max_j+3));j<m;j++){
                if(branch.game.board[i][j]==0){
                    var newGame = $.extend(true,[],branch.game);
                    newGame.turn = branch.game.turn;
                    newGame.board[i][j] = branch.game.turn;
                    checkBoard(newGame,i,j);
                    var newBranch = {game: newGame, move: [i,j]};
                    if(newGame.winner==newGame.turn){
                        newBranch.value=200000;
                    }
                    newGame.turn = (branch.game.turn==1)?2:1;//change turn AFTER checking board
                    newBranch.branches = getBranches(newBranch, depth-1);
                    branches.push(newBranch);
                }
            }
        }
    }
    //otherwise get branches for each existing branch
    else{
        for(var i=0;i<branch.branches.length;i++){
            branch.branches[i].branches = gerBranches(branch.branches[i], depth-1);
            branches.push(branch.branches[i]);
        }
    }
    return branches;
}