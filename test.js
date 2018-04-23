(function() {
    var gameData = { 
        highscores: [20, 50, 143]
    };
    function BrickGame() {
        var currentpage = undefined;

        var BrickGameModel = new function() {
            var loaded = false;
            var data = {
                level: 1,
                speed: 2,
                score: 0,
                volume: 1,
                gameNumber: 0,
                highScore: 0
            };

            this.setLevel = function(dir) {
                if (dir === "up") 
                    data.level = data.level === 10 ? 1: data.level + 1;
                else if (dir === "down")
                    data.level = data.level === 1 ? 10: data.level - 1;
                else if (typeof dir === "number") {
                    if (dir > 10) dir = 10;
                    else if (dir < 1) dir = 1;
                    data.level = dir;
                }
                else if (!dir || dir === "default") { /* do nothing */ }
                else throw new Error("Invalid way of setting level");
                txLevel.innerHTML = data.level.toString();
            };
            this.setSpeed = function(dir) {
                if (dir === "up") 
                    data.speed = data.speed === 10 ? 1: data.speed + 1;
                else if (dir === "down")
                    data.speed = data.speed === 1 ? 10: data.speed - 1;
                else if (typeof dir === "number") {
                    if (dir > 10) dir = 10;
                    else if (dir < 1) dir = 1;
                    data.speed = dir;
                }
                else if (!dir || dir === "default") { /* do nothing */ }
                else throw new Error("Invalid way of setting speed");
                txSpeed.innerHTML = data.speed.toString();
            };
            this.setScore = function(dir) {
                if (dir === "up") {
                    data.score++;
                    if (data.score > gameData.highscores[data.gameNumber]) 
                        data.setHighScore(++gameData.highscores[data.gameNumber]);
                }
                else if (!dir || dir === "default")
                    data.score = 0;
                else throw new Error("Invalid way of setting score");
                txScore.innerHTML = data.score.toString();
            },
            this.setHighScore = function(hs) {
                if (typeof hs !== "number") throw new Error("Invalid way of setting high score");
                txHighScore.innerHTML = (data.highScore = hs).toString();
            };
            this.currentGame = function() {
                return data.gameNumber;
            }
            this.changeGame = function(dir) {
                var gl = gameData.highscores.length - 1;
                if (dir === "up")
                    data.gameNumber = data.gameNumber === gl ? 0: data.gameNumber + 1;
                else if (typeof dir === "number") {
                    if (dir > gl) dir = gl;
                    else if (dir < 0) dir = 0;
                    data.gameNumber = dir;
                }
                else if (!dir || dir === "default") { /* do nothing */ }
                else throw new Error("Invalid way of changing game");
                BrickGameModel.setHighScore(gameData.highscores[data.gameNumber]);
            };
            this.setPause = function(paused) {
                pauseIcon.innerHTML = (data.paused = paused) ? "&#xf04c": "";
            };
            this.load = function() {
                if (loaded) throw new Error("Brick Game Data is loaded!");
                this.setLevel();
                this.setSpeed();
                this.changeGame();
                this.setScore();
                this.gameSound.setVolume();
                loaded = true;
            };

            this.gameSound = new function() {
                // DECLARATIONS
                var currentVolume = data.volume;
                var soundBaseURL = "sounds";
        
                var music = {
                    current: 0,
                    audios: [
                        new Audio(soundBaseURL + "/opening2.wav"),
                        new Audio(soundBaseURL + "/startgame.wav"),
                        new Audio(soundBaseURL + "/gameover.wav"),
                        new Audio(soundBaseURL + "/levelUp.wav"),
                        new Audio(soundBaseURL + "/startgame2.wav")
                    ]
                };
                var sound = {
                    current: 0,
                    audios: [
                        new Audio(soundBaseURL + "/move.wav"),
                        new Audio(soundBaseURL + "/hit.wav"),
                        new Audio(soundBaseURL + "/move2.wav"),
                        new Audio(soundBaseURL + "/fire.wav"),
                        new Audio(soundBaseURL + "/score.wav"),
                        new Audio(soundBaseURL + "/carsound1.wav"),
                        new Audio(soundBaseURL + "/fire2.wav"),
                        new Audio(soundBaseURL + "/select.wav")
                    ]
                }
        
                this.music = {
                    opening: function() { play("music", 0) },
                    startGame: function() { play("music", 1) },
                    gameOver: function() { play("music", 2) },
                    levelUp: function(onend) { play("music", 3, false, onend) },
                    startGame2: function() { play("music", 4) }
                };
                this.sound = {
                    move: function() { play("sound", 0) },
                    explosion: function() { play("sound", 1) },
                    move2: function() { play("sound", 2) },
                    fire: function() { play("sound", 3) },
                    score: function() { play("sound", 4) },
                    carSound1: function() { play("sound", 5, true) },
                    fire2: function() { play("sound", 6) },
                    select: function() { play("sound", 7) }
                };
        
                function play(type, index, loop, endFunction) {
                    var audioType = type == "music" ? music: sound;
                    var currentAudio = audioType.audios[audioType.current];
                    if(currentAudio.currentTime > 0 && !currentAudio.paused && currentAudio.readyState > 2) {
                        currentAudio.pause(); 
                    }
                    currentAudio.currentTime = 0;
                    audioType.current = index;
                    currentAudio = audioType.audios[audioType.current];
                    currentAudio.volume = data.volume;
                    if (loop != undefined) currentAudio.loop = loop;
                    currentAudio.onended = endFunction;
                    currentAudio.play();
                }
        
                this.pause = function() {
                    music.audios[music.current].pause();
                    sound.audios[sound.current].pause();
                };
                this.resume = function() {
                    if (!music.audios[music.current].ended && music.audios[music.current].currentTime > 0) music.audios[music.current].play();
                    if (!sound.audios[sound.current].ended && sound.audios[sound.current].currentTime > 0) sound.audios[sound.current].play();
                };
                this.stop = function() {
                    music.audios[music.current].pause(); music.audios[music.current].currentTime = 0;
                    sound.audios[sound.current].pause(); sound.audios[sound.current].currentTime = 0;
                };
                this.getVolume = function() { return currentVolume };
                this.setVolume = function(dir) {
                    if (dir === "down") 
                        data.volume = data.volume == 0 ? 1 : data.volume - 0.25;
                    else if (typeof dir === "number") 
                        data.volume = dir;
                    else if (!dir || dir === "default") { /* do nothing */ }
                    else
                        throw new Error("Invalid way of setting volume");

                    music.audios[music.current].volume = data.volume;
                    sound.audios[sound.current].volume = data.volume;

                    if(data.volume == 1 || data.volume == 0.75) {
                        musicIcon.innerHTML = "&#xf028";
                    }
                    else if(data.volume == 0.5 || data.volume == 0.25) {
                        musicIcon.innerHTML = "&#xf027";
                    }
                    else {
                        musicIcon.innerHTML = "&#xf026";
                    }
                }
                this.getObject = function() {
                    console.log(music, sound);
                }
            };
        };

        const svgNS = "http://www.w3.org/2000/svg";

        function loadTiles() {
            for (var i = 0; i < 20; i++) {
                for(var j = 0; j < 10; j++) {

                    var outerCell = document.createElementNS(svgNS, "g");
                    var outerTileCell = document.createElementNS(svgNS, "rect");
                    var tileCell = document.createElementNS(svgNS, "rect");

                    outerCell.id = "tileCell" + String.fromCharCode(j + 65) + String.fromCharCode(i + 65);

                    outerCell.setAttribute("transform", "translate(" + (j * 20).toString() + "," + (i * 20) + ")");
                
                    outerTileCell.setAttribute("data-tilecolor", "white");
                    outerTileCell.setAttribute("x", "1");
                    outerTileCell.setAttribute("y", "1");

                    tileCell.setAttribute("x", "3");
                    tileCell.setAttribute("y", "3");

                    outerCell.appendChild(outerTileCell);
                    outerCell.appendChild(tileCell);
                    mainContainer.appendChild(outerCell)
                }
            };
        }
        function loadLifeTiles() {
            for (var i = 0; i < 4; i++) {
                for(var j = 0; j < 4; j++) {

                    var outerCell = document.createElementNS(svgNS, "g");
                    var outerTileCell = document.createElementNS(svgNS, "rect");
                    var tileCell = document.createElementNS(svgNS, "rect");

                    outerCell.id = "lifeTileCell" + String.fromCharCode(j + 65) + String.fromCharCode(i + 65);

                    outerCell.setAttribute("transform", "translate(" + (j * 16).toString() + "," + (i * 16) + ")");
                
                    outerTileCell.setAttribute("data-tilecolor", "black");
                    outerTileCell.setAttribute("x", "1");
                    outerTileCell.setAttribute("y", "1");

                    tileCell.setAttribute("x", "3");
                    tileCell.setAttribute("y", "3");

                    outerCell.appendChild(outerTileCell);
                    outerCell.appendChild(tileCell);
                    lifeContainer.appendChild(outerCell)
                }
            };
        }
        function loadData() {
            BrickGameModel.load();
        }
        
        function KeySound() {
            console.log("key sounds");
        } 


        var GameSound = BrickGameModel.gameSound;

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
                if (outerCell) outerCell.children[0].setAttribute("data-tilecolor", color);
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
            function setZIndices() {
                for (var i = 0; i < brickObjects.length; i++) {
                    brickObjects[i].zIndex = i;
                }
            }
            function paint() {

                brickObjects = brickObjects.sort(function(a, b) { return a.zIndex - b.zIndex; });
    
                var index = 0;
                while (index < brickObjects.length) {
                    var brickObject = brickObjects[index];
                    var loc = brickObject.brickLocation;
                    var brickTiles = brickObject.oldTiles;
                    var brickTileCount = brickTiles.length;
                    for (var j = 0; j < brickTileCount; j++) {
                        var brickTile = brickTiles[j];
                        changeTileColor(brickTile.screenX, brickTile.screenY, canvas);
                    }
    
                    if (brickObject.tiles.length == 0 && brickObject.isRemoved) brickObjects.splice(index, 1);
                    index++;
                }
    
                setZIndices();
                
                var brickObjectsLength = brickObjects.length;
                for (var i = 0; i < brickObjectsLength; i++) {
                    var brickObject = brickObjects[i];
                    var brickTiles = brickObject.tiles;
                    var brickTileCount = brickTiles.length;
                    var brickColor = brickObject.visible ? brickObject.color: canvas;
                    for (var j = 0; j < brickTileCount; j++) {
                        var brickTile = brickTiles[j];
                        changeTileColor(brickTile.screenX, brickTile.screenY, brickColor);
                    }
                    brickObject.overlappedObjects = [];
                    brickObject.collidedObjects = {
                        left: [], right: [], top: [], bottom: [], all: []
                    };
    
                    brickObject.oldTiles = JSON.parse(JSON.stringify(brickObject.tiles));
                }
    
                // for (var i = 0; i < brickObjectsLength; i++) {
                //     var brickObject = brickObjects[i];
                //     var brickTiles = brickObject.tiles;
                //     var brickTileCount = brickTiles.length;
                //     for (var j = i + 1; j < brickObjectsLength; j++) {
                //         var collidedLeft = false, collidedRight = false, collidedTop = false, collidedBottom = false;
                //         var overlappedBrickObject = brickObjects[j];
                //         for (var t = 0; t < brickTileCount; t++) {
                //             var overlapped = overlappedBrickObject.tiles.filter(function(tile) { 
                //                 return tile.screenX == brickTiles[t].screenX && tile.screenY == brickTiles[t].screenY;
                //             }).length > 0;
                //             if (!collidedLeft) {
                //                 collidedLeft = overlappedBrickObject.tiles.filter(function(tile) {
                //                     return tile.screenX == brickTiles[t].screenX - 1 && tile.screenY == brickTiles[t].screenY;
                //                 }).length > 0;
                //             }
                //             if (!collidedRight) {
                //                 collidedRight = overlappedBrickObject.tiles.filter(function(tile) {
                //                     return tile.screenX == brickTiles[t].screenX + 1 && tile.screenY == brickTiles[t].screenY;
                //                 }).length > 0;
                //             }
                //             if (!collidedTop) {
                //                 collidedTop = overlappedBrickObject.tiles.filter(function(tile) {
                //                     return tile.screenX == brickTiles[t].screenX && tile.screenY == brickTiles[t].screenY - 1;
                //                 }).length > 0;
                //             }
                //             if (!collidedBottom) {
                //                 collidedBottom = overlappedBrickObject.tiles.filter(function(tile) {
                //                     return tile.screenX == brickTiles[t].screenX && tile.screenY == brickTiles[t].screenY + 1;
                //                 }).length > 0;
                //             }
                //             if (overlapped) {
                //                 collidedLeft = false;
                //                 collidedRight = false;
                //                 collidedTop = false;
                //                 collidedBottom = false;
                //                 overlappedBrickObject.overlappedObjects.push(brickObject._object_);
                //                 brickObject.overlappedObjects.push(overlappedBrickObject._object_);
                //                 break;
                //             }
                //         }
                //         if (collidedLeft) {
                //             brickObject.collidedObjects.left.push(overlappedBrickObject._object_);
                //             overlappedBrickObject.collidedObjects.right.push(brickObject._object_);
                //         }
                //         if (collidedRight) {
                //             brickObject.collidedObjects.right.push(overlappedBrickObject._object_);
                //             overlappedBrickObject.collidedObjects.left.push(brickObject._object_);
                //         }
                //         if (collidedTop) {
                //             brickObject.collidedObjects.top.push(overlappedBrickObject._object_);
                //             overlappedBrickObject.collidedObjects.bottom.push(brickObject._object_);
                //         }
                //         if (collidedBottom) {
                //             brickObject.collidedObjects.bottom.push(overlappedBrickObject._object_);
                //             overlappedBrickObject.collidedObjects.top.push(brickObject._object_);
                //         }
                //     }
    
                //     brickObject.collidedObjects.all = brickObject.collidedObjects.left
                //         .concat(brickObject.collidedObjects.right)
                //         .concat(brickObject.collidedObjects.top)
                //         .concat(brickObject.collidedObjects.bottom);
                // }
            } 

            // METHODS
            this.canvasColor = function(color) {
                canvas = color ? color: canvas;
                _canvasColor(color);
            };
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
                                    console.log("sound volume adjusted");
                                    GameSound.setVolume("down");
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
            this.BrickObject = function(params) {

                var _bo = { };

                params = params ? params: { };
                _bo.tiles = params.tiles ? params.tiles: [];
                _bo.color = params.color ? params.color: "black";
                _bo.ID = generateRandomId();
                _bo.brickLocation = params.brickLocation;
                _bo.visible = params.visible ? params.visible: true;

                function _setLocation(x, y, tiles) {
                    _bo.oldTiles = JSON.parse(JSON.stringify(_bo.tiles));
                    if (tiles) _bo.tiles = JSON.parse(JSON.stringify(tiles));;
                    var newTiles = _bo.tiles;
                    for (var t = 0; t < newTiles.length; t++) {
                        tileX = x + newTiles[t].x; tileY = y + newTiles[t].y;
                        newTiles[t].screenX = tileX; newTiles[t].screenY = tileY;
                    }
                    X = x; Y = y;
                    paint();
                }

                this.setLocation = function(x, y, tiles) { _setLocation(x, y, tiles); }
                this.remove = function() {
                    console.log(this);
                    brickObjects.splice(brickObjects.indexOf(_bo), 1);
                };

                brickObjects.push(_bo);

                if (_bo.brickLocation) _setLocation(_bo.brickLocation.x, _bo.brickLocation.y, _bo.tiles);

                setZIndices();
               
                _bo._object_ = this;
            }

            _canvasColor(canvas);

            // EVENTS
            window.onkeydown = undefined;
            window.onkeyup = undefined;
        }
        
        // PAGES
        function OpeningPage() {
            var page = new Page();
            GameSound.music.opening();
            page.marquee("BRICK GAME", 300);
            page.canvasColor("black");
            page.keydown(function() {
                console.log("exited brick game marquee");
                GameSound.sound.select();
                navigate(GameSelectPage);
            });
            return page;
        }
        function GameSelectPage() {
            var page = new Page();

            BrickGameModel.setScore();
            
            page.keydown(GameSound.sound.select,
            {
                left: {
                    repeat: true,
                    _function: function() {
                        BrickGameModel.setSpeed("down");
                    }
                },
                right: {
                    repeat: true,
                    _function: function() {
                        BrickGameModel.setSpeed("up");
                    }
                },
                up: {
                    repeat: true,
                    _function: function() {
                        BrickGameModel.setLevel("up");
                    }
                },
                down: {
                    repeat: true,
                    _function: function() {
                        BrickGameModel.setLevel("down");
                    }
                },
                space: {
                    repeat: true,
                    _function: function() {
                        BrickGameModel.changeGame("up");
                    }
                },
                enter: function() {
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
                        var brickObject1 = new page.BrickObject({
                            tiles: [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }],
                            brickLocation: { x: 2, y: 2 }
                        });
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

            var selectedGame = games[BrickGameModel.currentGame()];
            var gameplay = new selectedGame.gameplay();
            var keydownfunctions = gameplay.keydown;

            keydownfunctions.enter = function() {
                if (paused) {
                    paused = false;
                    page.keydown("enableAll");
                    GameSound.resume();
                }
                else {
                    paused = true;
                    page.keydown({ "disabled": ["left", "right", "up", "down", "space"] });
                    GameSound.pause();
                }
                BrickGameModel.setPause(paused);
            };

            console.log("Game started");

            function lifeLost(brickObjects) {
                GameSound.stop();
                GameSound.sound.explosion();
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
                            GameSound.music.gameOver();
                            navigate(GameOverPage);
                        }
                        else {
                            console.log("transitioning");
                            setTimeout(function() { 
                                page.keydown("enableAll");
                                page.keyup("enableAll");
                                initialize();
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
                BrickGameModel.setScore("up");
            }
            function levelUp() {
                BrickGameModel.setLevel("up");
                navigate(LevelUpPage);
            }
            function initialize() {
                GameSound.music.startGame();
                gameplay.initialize();
            }

            page.keydown(keydownfunctions);

            initialize();
            return page;
        }
        function LevelUpPage() {
            var page = new Page();
            page.marquee("LEVEL UP", 300);
            page.keydown("disableAll");
            GameSound.music.levelUp(function() {
                page.keydown("enableAll");
                navigate(GamePage);
            });
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
            loadLifeTiles();
            BrickGameModel.load();
            navigate(OpeningPage);
        }
    }
    BrickGame();
})();