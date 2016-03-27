(function () {

    'use strict';

    angular.module('app', ['nvd3']);

    angular.module('app')
           .controller('AppCtrl', AppCtrl);

    function AppCtrl($scope, $timeout) {

        var words = ['classroom', 'program', 'computer', 'pizza', 'security', 'team', 'website', 'google', 'education', 'roadway'];
        var foundIndexes = [];
        var lastRandomPick = 0;
        
        $scope.guessWord;
        $scope.gameOn = false;
        $scope.games = [];
        $scope.guessChar = '';
        $scope.incorrectTries = 0;
        $scope.guessWordCharArray = [];

        drawHangman();
        initializeChart();

        $scope.startGame = function () {
            var randomNumber = Math.floor((Math.random() * 10));
            $scope.gameOn = true;

            $scope.guessWord = '';
            $scope.incorrectTries = 6;
            foundIndexes = [];
            $scope.endGameMsg = '';
            $scope.endGameMsg1 = '';
            $scope.winGame = false;
            $scope.loseGame = false;

            while (lastRandomPick === randomNumber) {
                randomNumber = Math.floor((Math.random() * 10));
            }

            lastRandomPick = randomNumber;

            $scope.guessWordCharArray = [];
            
            $scope.guessWord = words[randomNumber];
            console.log($scope.guessWord);
            // setup the blanks for the random number
            for (var i = 0; i < $scope.guessWord.length; i++) {
                $scope.guessWordCharArray.push('*');
            };
         
            drawHangman();
            $timeout(function () {
                document.getElementById("guessInputBox").focus();
            });
            
        };

        $scope.guess = function () {
            
            var guessWordIndex;
            var found = false;

            for (var i = 0; i < $scope.guessWord.length; i++) {
                guessWordIndex = $scope.guessWord.indexOf($scope.guessChar, i);
                if (guessWordIndex != -1) {
                    found = true;
                    foundIndexes.push({ guessWordIndex: guessWordIndex, guessChar: $scope.guessChar });
                    i = guessWordIndex;
                }
            };

            console.log($scope.guessWord);

            if (found) {
                foundIndexes.forEach(function (item) {
                    $scope.guessWordCharArray[item.guessWordIndex] = item.guessChar;
                });

            } else {
                $scope.incorrectTries -= 1;
                drawHangman();
            }
            
            if ($scope.incorrectTries === 0) {
                $scope.loseGame = true;
                $scope.endGameMsg = 'Oops, you\'ve been hung!';
                $scope.endGameMsg1 = 'The word was ';
                $scope.games.push({ result: 'execution' });
                refreshChart();
                $timeout(function () {
                    document.getElementById("tryAgainBtn").focus();
                });
            }

            if ($scope.guessWordCharArray.indexOf('*') === -1) {
                $scope.winGame = true;
                $scope.endGameMsg = 'Congradulations!';
                $scope.endGameMsg1 = 'You\'ve been pardoned';
                $scope.games.push({ result: 'pardon' });
                refreshChart();
                $timeout(function () {
                    document.getElementById("tryAgainBtn").focus();
                });
            }

            $scope.guessChar = '';
            $timeout(function () {
                document.getElementById("guessInputBox").focus();
            });
            
        };


        $scope.moveFocus = function () {
            $timeout(function () {
                document.getElementById('guessBtn').focus();
            });
        };

        function initializeChart() {

            $scope.options = {
                chart: {
                    type: 'pieChart',
                    height: 500,
                    x: function (d) { return d.key; },
                    y: function (d) { return d.y; },
                    showLabels: true,
                    duration: 500,
                    labelThreshold: 0.01,
                    labelSunbeamLayout: false,
                    legend: {
                        margin: {
                            top: 5,
                            right: 125,
                            bottom: 0,
                            left: 0
                        }
                    }
                },
                // title options
                title: {
                    enable: true,
                    text: 'Win versus Loss Statistical Data'
                },
            };

        };

        function refreshChart() {
            var losses = [];
            var wins = [];
            $scope.data = [];

            wins = $scope.games.filter(findWins);
            losses = $scope.games.filter(findLosses);
            
            $scope.data.push(
            {
                key: "Wins",
                y: wins.length
            });
            $scope.data.push(
            {
                key: "Losses",
                y: losses.length
            });

            $scope.api.refreshWithTimeout(5);

            function findWins(game) {
                return game.result === 'pardon';
            }

            function findLosses(game) {
                return game.result === 'execution';
            }
        };

        function drawHangman() {

            var lines = ['        |\n', '        |\n', '        |\n'];

            switch ($scope.incorrectTries) {
                case 5: 
                    lines[0] = '    O   |\n';
                    break;
                case 4:
                    lines[0] = '    O   |\n';
                    lines[1] = '    |   |\n';
                    break;
                case 3:
                    lines[0] = '    O   |\n';
                    lines[1] = '   /|   |\n';
                    break;
                case 2:
                    lines[0] = '    O   |\n';
                    lines[1] = '   /|\\  |\n';
                    break;
                case 1:
                    lines[0] = '    O   |\n';
                    lines[1] = '   /|\\  |\n';
                    lines[2] = '   /    |\n';
                    break;
                case 0:
                    lines[0] = '    O   |\n';
                    lines[1] = '   /|\\  |\n';
                    lines[2] = '   / \\  |\n';
                    break;
                    
                default: break;
            }

            $scope.hangman =
              '   ______\n' +
              '    |   |\n' +
              lines[0] +
              lines[1] +
              lines[2] +
              '  ______|\n';
              
        };
    };

}());