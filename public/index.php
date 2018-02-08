<!DOCTYPE html>

<html>
    <head>
        <title>Play PENTE</title>
        
        <!-- http://getbootstrap.com/ -->
        <link href="./css/bootstrap.min.css" rel="stylesheet"/>
        
        <!-- app's own CSS -->
        <link href="./css/styles.css" rel="stylesheet"/>
        
        <!-- http://jquery.com/ -->
        <script src="./js/jquery-1.11.3.min.js"></script>
        
        <!-- http://getbootstrap.com/ -->
        <script src="./js/bootstrap.min.js"></script>

        <!-- http://underscorejs.org/ -->
        <script src="./js/underscore-min.js"></script>

        <!-- https://github.com/twitter/typeahead.js/ -->
        <script src="./js/typeahead.jquery.min.js"></script>
        
    </head>
    <body>
        <div class="center">
            <div>
                <h1>PENTE</h1>
            </div>
            <div id="container">
                <img src="./img/board.png" id="board" alt="Board" onclick="playTurn(event)">
                <div id="play" class="window">
                    <p id="play-text" class="window-title">Play PENTE</p>
                    <button class="button" onclick="showRules()">Rules</button>
                    <p class="window-text">Difficulty:</p>
                    <button class="button" onclick="newGame(1)">Easy</button>
                    <button class="button" onclick="newGame(2)">Hard</button>
                </div>
                <div id="rules" class="window">
                    <p id="rules-text" class="window-title">Rules:</p>
                    <p id="rules-message" class="window-text">Welcome to Pente! Pente is a game played on a 19 x 19 square grid, with two players each taking turns by playing one piece at a time. The object of the game is to reach one of two winning scenarios: either placing five pieces in a row (including diagonals), or by capturing five pairs from the opponent. A capture is made by placing a piece such that two of the moving players pieces enclose two of the opponents pieces (see below).</p>
                    <p class = "window-text">Good luck!</p>
                    <div id="div1">
                        <img src="./img/capture_1.png" class="rules_img">
                        <div id="arrow">
                            <p class="window-text">&#8594</p>
                        </div>
                        <img src="./img/capture_2.png" class="rules_img">
                    </div>
                    <button class="button" onclick="hideRules()">Back</button>
                </div>
                <div id="gameover" class="window">
                    <p id="gameover-text" class="window-title">Game Over</p>
                    <p id="gameover-message" class="window-text"></p>
                    <p class="window-text">Difficulty:</p>
                    <button class="button" onclick="newGame(1)">Easy</button>
                    <button class="button" onclick="newGame(2)">Hard</button>
                </div>
            </div>
            <div>
                <p class="bottom-txt">Designed by Jackson Christoffersen for CS50.</p>
            </div>
        </div>
    </body>
    <foot>
        
        <!-- app's own JavaScript -->
        <script src="./js/scripts.js"></script>
        
    </foot>
</html>
<!-- Thanks to w3schools.com, stackexchange.com, and of course the CS50 team. -->