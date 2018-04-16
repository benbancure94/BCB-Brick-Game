(function() {
    var gameData = { 
        highscores: [0, 0, 0]
    };
    function BrickGame() {
        var currentpage = undefined;

        var BrickGameModel = {
            level: 1,
            speed: 1,
            score: 0,
            volume: 1,
            gameNumber: 0
        };

        function loadTiles() {
            var svgNS = "http://www.w3.org/2000/svg";

            for (var i = 0; i < 20; i++) {
                for(var j = 0; j < 10; j++) {

                    var outerCell = document.createElementNS(svgNS, "g");
                    var outerTileCell = document.createElementNS(svgNS, "rect");
                    var tileCell = document.createElementNS(svgNS, "rect");

                    outerCell.id = "tileCell" + String.fromCharCode(j + 65) + String.fromCharCode(i + 65);

                    outerCell.setAttribute("transform", "translate(" + (j * 20).toString() + "," + (i * 20) + ")");
                
                    outerTileCell.setAttribute("width", "18");
                    outerTileCell.setAttribute("height", "18");
                    outerTileCell.setAttribute("data-tilecolor", "white");
                    outerTileCell.setAttribute("x", "1");
                    outerTileCell.setAttribute("y", "1");

                    tileCell.setAttribute("width", "14");
                    tileCell.setAttribute("height", "14");
                    tileCell.setAttribute("x", "3");
                    tileCell.setAttribute("y", "3");

                    outerCell.appendChild(outerTileCell);
                    outerCell.appendChild(tileCell);
                    mainContainer.appendChild(outerCell)
                }
            };
        }
        
        function KeySound() {
            console.log("key sounds");
        } 

        function Page() {
            var _thispage = this;
            var isMarqueePage = false;
            var enabled = true;
            var canvas = "white";

            var keydownfunction, keyupfunction, disabledkeys = [];
            var brickObjects = [], timers = [];

            function changeTileColor(x, y, color) {
                if (!color) color = "white";
                var outerCell = document.getElementById("tileCell" + String.fromCharCode(x + 65) + String.fromCharCode(y + 65));
                outerCell.children[0].setAttribute("data-tilecolor", color);
            }
            function generateRandomId() {
                var number = Math.floor(Math.random() * 9e8) + 1e8;
                if (brickObjects.filter(function(bo) { return bo.ID == number }).length == 0) {
                    return number;
                }
                else {
                    return generateRandomId();
                }
            }
            function _canvasColor(color) {
                for(var x = 0; x < 10; x++) {
                    for(var y = 0; y < 20; y++) {
                        changeTileColor(x, y, color);
                    }
                }
            }

            // METHODS
            this.canvasColor = function(color) {
                canvas = color ? color: canvas;
                _canvasColor(color);
            }
            this.keydown = function(param1, param2) {
                var backgroundFunction;
                var individualKeyFunctions;

                if (typeof param1 === "function") {
                    backgroundFunction = param1;
                    individualKeyFunctions = param2;
                    setWindowKeyDown();
                }
                else if (typeof param1 === "string") {
                    if (param1 === "enableAll") {
                        enabled = true;
                        disabledkeys = [];
                    }
                    else if (param1 === "disableAll") {
                        enabled = false;
                        console.log("disabled");
                    }
                }
                else if (typeof param1 === "object") {
                    if (param1.disabled) {
                        disabledkeys = param1.disabled;
                    }
                    else {
                        individualKeyFunctions = param1;
                        setWindowKeyDown();
                    }
                }

                function setWindowKeyDown() {
                    window.onkeydown = function() {
                        if (backgroundFunction) backgroundFunction();
                        if (individualKeyFunctions) {
                            if (typeof individualKeyFunctions === "object") {
                                var keycode = event.key.toLowerCase();
                                if (keycode === "arrowup") keycode = "up";
                                else if (keycode === "arrowdown") keycode = "down";
                                else if (keycode === "arrowleft") keycode = "left";
                                else if (keycode === "arrowright") keycode = "right";
                                else if (keycode === " ") keycode = "space";
                                individualKeyFunctions.s = function() {
                                    BrickGameModel.volume = BrickGameModel.volume == 0 ? 1 : BrickGameModel.volume - 0.25;
                                    console.log("sound volume adjusted");
                                    console.log(BrickGameModel);
                                }

                                if (typeof individualKeyFunctions[keycode] !== "undefined") { 
                                    if (disabledkeys.filter(function(dk) { return dk == keycode }).length == 0 || !enabled) {
                                        var repeat = false;
                                        var keyfunction = individualKeyFunctions[keycode];
                                        if (typeof keyfunction === "object") {
                                            if(keyfunction.repeat !== undefined) repeat = keyfunction.repeat;
                                            keyfunction = keyfunction._function;
                                        }
                                        
                                        if (repeat || !event.repeat) 
                                            if (typeof keyfunction === "function" && enabled) keyfunction();
                                    } 
                                }
                            }
                        }
                    }
                }
            };
            this.keyup = function(kuf) {
                window.onkeyup = kuf;
            };
            this.stopTimers = function() {
                timers.forEach(function(t) { t.stop(); }); timers = [];
            }
            this.destroy = function() {
                _thispage.stopTimers();
                while (brickObjects.length > 0) brickObjects.splice(0, 1); brickObjects = [];
            }
            this.blinkBrickObjects = function(params) {
                var c = 0;
                if (!params.endFunction) params.endFunction = function() { };
                var interval = setInterval(function() {
                    console.log(c % 2 == 0 ? "blink off": "blink on");
                    c++;
                    if (c === params.count * 2) {
                        clearInterval(interval);
                        params.endFunction();
                    }
                }, params.interval)
            }
            this.marquee = function(text, speedInMillis) {
                if (!text || text === null) text = "";
                var chars = text.split("");
                
                var i = 0;
                var timer = new _thispage.Timer({
                    func: function() {
                        console.log(chars[i]);
 
                        i++;

                        if (i === text.length) {
                            i = 0;
                        }
                    }, 
                    interval: speedInMillis == undefined ? 50: speedInMillis
                });
                timer.start();

                var timer = setInterval(function() {
                    console.log(chars[i]);
                    i++;
                    if (i === text.length) i = 0;
                }, speedInMillis == undefined ? 50: speedInMillis);
                
            }

            // INSTANTIABLE OBJECTS
            this.Timer = function(params) {
                // DECLARATIONS
                var timer;
                var _interval = params.interval == undefined ? 1000: params.interval;
                var tickDate = new Date();
                var timeoutState = { running: 0, paused: 1, stopped: 2 }
                var _timeoutFunction = function() {}, _func = params.func == undefined ? function() {}: params.func;
                var remainingMillis = _interval;
                var _timeoutState = timeoutState.stopped;
        
                // METHODS
                this.start = function() {
                    if(_timeoutState != timeoutState.running) {
                        _timeoutState = timeoutState.running;
                        _timeoutFunction = function() { tickDate = new Date(); _func(); }
                        timer = setTimeout(function() { timer = setInterval(_timeoutFunction, _interval); _timeoutFunction(); }, remainingMillis);
                    }
                };
                this.stop = function() { clearInterval(timer); _timeoutState = timeoutState.stopped; };
                this.pause = function() {
                    _timeoutState = timeoutState.paused;
                    remainingMillis = _interval - (new Date() - tickDate);
                    clearTimeout(timer);
                };
                this.setTimerInterval = function(interval) {
                    _interval = interval;
                    if(_timeoutState != timeoutState.stopped) {
                        clearInterval(timer);
                        if (_timeoutState == timeoutState.running) timer = setInterval(_timeoutFunction, _interval); 
                    }
                    else remainingMillis = interval;
                };
                this.isRunning = function() { return _timeoutState == timeoutState.running; }
                this.isPaused = function() { return _timeoutState == timeoutState.paused; }
                this.setFunction = function(func) { _func = func; }
                this.isStopped = function() { return _timeoutState == timeoutState.stopped; }
                this.dispose = function() { 
                    if (_timeoutState == timeoutState.running) throw new Error("Cannot dispose while timer is running");
                    timers.splice(timers.indexOf(this), 1); 
                };
        
                // INITIALIZATIONS
                timers.push(this);
            }
            this.BrickObject = function() {
                this.ID = generateRandomId();
                this.remove = function() {
                    console.log(this);
                    brickObjects.splice(brickObjects.indexOf(this), 1);
                }
    
                brickObjects.push(this);
            }

            _canvasColor(canvas);

            // EVENTS
            window.onkeydown = undefined;
            window.onkeyup = undefined;
        }
        
        // PAGES
        function OpeningPage() {
            var page = new Page();
            page.marquee("BRICK GAME", 300);
            page.canvasColor("black");
            page.keydown(function() {
                console.log("exited brick game marquee");
                KeySound();
                navigate(GameSelectPage);
            });
            return page;
        }
        function GameSelectPage() {
            var page = new Page();
            
            page.keydown(function() { KeySound(); },
            {
                left: {
                    repeat: true,
                    _function: function() {
                        BrickGameModel.speed = BrickGameModel.speed === 1 ? 10: BrickGameModel.speed - 1;
                        console.log(BrickGameModel);
                    }
                },
                right: {
                    repeat: true,
                    _function: function() {
                        BrickGameModel.speed = BrickGameModel.speed === 10 ? 1: BrickGameModel.speed + 1;
                        console.log(BrickGameModel);
                    }
                },
                up: {
                    repeat: true,
                    _function: function() {
                        BrickGameModel.level = BrickGameModel.level === 10 ? 1: BrickGameModel.level + 1;
                        console.log(BrickGameModel);
                    }
                },
                down: {
                    repeat: true,
                    _function: function() {
                        BrickGameModel.level = BrickGameModel.level === 1 ? 10: BrickGameModel.level - 1;
                        console.log(BrickGameModel);
                    }
                },
                space: {
                    repeat: true,
                    _function: function() {
                        BrickGameModel.gameNumber = BrickGameModel.gameNumber === gameData.highscores.length - 1 ? 0: BrickGameModel.gameNumber + 1;
                        console.log(BrickGameModel);
                    }
                },
                enter: function() {
                    BrickGameModel.score = 0;
                    console.log("Game started"); navigate(GamePage);
                }
            });

            console.log(BrickGameModel);
            return page;
        }
        function GamePage() {

            var page = new Page();

            var games = [
                {
                    gameType: "race1", 
                    mode: 3, 
                    score: 0, 
                    speedTimeout: [300, 280, 260, 240, 220, 200, 180, 160, 140, 120],
                    gameplay: function() {
                        var brickObject1 = new page.BrickObject();
                        var brickObject2 = new page.BrickObject();
                        var brickObject3 = new page.BrickObject();

                        this.keydown = {
                            left: function() { console.log("turn car left") },
                            right: function() { console.log("turn car right") },
                            space: function() { console.log("life - 1"); lifeLost(); },
                            up: function() { 
                                console.log(page.brickObjects);
                            },
                            down: function() {
                                brickObject1.remove();
                            }
                        };
                        this.initialize = function() {
                            console.log("initialized game");
                        };
                    }
                },
                {
                    gameType: "race2", 
                    mode: 3, 
                    score: 0, 
                    speedTimeout: [300, 280, 260, 240, 220, 200, 180, 160, 140, 120],
                    gameplay: function() {
                        this.keydown = {
                            left: function() { console.log("turn car left") },
                            right: function() { console.log("turn car right") },
                            space: function() { console.log("life - 1"); lifeLost(); },
                            down: function() { score(); if (BrickGameModel.score % 20 === 0) { levelUp() } }
                        };
                        this.initialize = function() {
                            console.log("initialized game");
                        };
                    }
                },
                {
                    gameType: "race3", 
                    mode: 3, 
                    score: 0, 
                    speedTimeout: [300, 280, 260, 240, 220, 200, 180, 160, 140, 120],
                    gameplay: function() {
                        this.keydown = {
                            left: function() { console.log("turn car left") },
                            right: function() { console.log("turn car right") },
                            space: function() { console.log("life - 1"); lifeLost(); } 
                        };
                        this.initialize = function() {
                            console.log("initialized game");
                        };
                    }
                }
            ];
            
            var paused = false;
            var life = 4;

            var selectedGame = games[BrickGameModel.gameNumber];
            var gameplay = new selectedGame.gameplay();
            var keydownfunctions = gameplay.keydown;
            keydownfunctions.enter = function() {
                paused = !paused;
                console.log(paused ? "game paused": "game played");
                page.keydown(paused ? { "disabled": ["left", "right", "up", "down", "space"] } : "enableAll");
            };

            console.log("Game started");

            function lifeLost(brickObjects) {
                life--;
                console.log(life);

                var params = {
                    brickObjects: brickObjects,
                    interval: 400,
                    count: 3,
                    endFunction: function() {
                        if (life === 0) {
                            page.keydown("enableAll");
                            page.keyup("enableAll");
                            console.log("game over");
                            navigate(GameOverPage);
                        }
                        else {
                            console.log("transitioning");
                            setTimeout(function() { 
                                page.keydown("enableAll");
                                page.keyup("enableAll");
                                gameplay.initialize();
                            }, 2000);
                        }
                    }
                };

                // blink brick objects
                page.keydown("disableAll");
                // page.keyup("disableAll");
                page.stopTimers();
                page.blinkBrickObjects(params);
            };
            function score() {
                BrickGameModel.score++;
                if (BrickGameModel.score > gameData.highscores[BrickGameModel.gameNumber]) 
                    gameData.highscores[BrickGameModel.gameNumber]++;
                console.log(BrickGameModel, gameData);
            }
            function levelUp() {
                if (BrickGameModel.level === 10) BrickGameModel.level = 1;
                else BrickGameModel.level++;
                console.log(BrickGameModel);
                navigate(LevelUpPage);
            }

            page.keydown(keydownfunctions);
            gameplay.initialize();
            return page;
        }
        function LevelUpPage() {
            var page = new Page();
            page.marquee("LEVEL UP", 300);
            page.keydown("disableAll");
            setTimeout(function() { 
                page.keydown("enableAll");
                navigate(GamePage) 
            }, 3000)
            return page;
        }
        function GameOverPage() {
            var page = new Page();
            page.marquee("GAME OVER", 300);
            page.keydown(function() {
                console.log("exited game over marquee");
                KeySound();
                navigate(GameSelectPage);
            });
            return page;
        }

        function navigate(page) {
            page = page();
            if (currentpage) currentpage.destroy();
            currentpage = page;
        }

        window.onload = function() {
            loadTiles();
            navigate(OpeningPage);
        }
    }
    BrickGame();
})();