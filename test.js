(function() {
    Array.prototype.clone = function() {
        return JSON.parse(JSON.stringify(this));
    }
    Object.prototype.clone = function() {
        return JSON.parse(JSON.stringify(this));
    }

    var gameData = { 
        highscores: [20, 50, 143, 67, 100, 33, 45, 10, 33, 200, 99, 100, 57, 333, 229, 1, 2, 4, 56, 2, 43, 533, 223, 5322, 333, 99]
    };
    function BrickGame() {
        var currentpage = undefined;
        const svgNS = "http://www.w3.org/2000/svg";

        var brickObjects = {
            "1x3": [
                { x: 0, y: 0 },
                { x: 0, y: 1 },
                { x: 0, y: 2 },
            ],
            "4x4": (function() {
                var tiles = [];
                for (var x = 0; x < 4; x++) for(var y = 0; y < 4; y++) tiles.push({ x, y });
                return tiles;
            })(),
            "A": (function() {
                var tiles = [];
                for (var y = 1; y < 5; y++) { 
                    if (y < 4) { tiles.push({ x: y, y: 0 }); tiles.push({ x: y, y: 2 }); }
                    tiles.push({ x: 0, y }); tiles.push({ x: 4, y }); 
                }
                return tiles;
            })(),
            "B": (function() {
                var tiles = [];
                for (var y = 0; y < 5; y++) tiles.push({ x: 0, y });
                for (var x = 1; x < 4; x++) {
                    tiles.push({ x, y: 0 }); tiles.push({ x, y: 2 }); tiles.push({ x, y: 4 });
                }
                tiles.push({ x: 4, y: 1 }); tiles.push({ x: 4, y: 3 });
                return tiles;
            })(),
            "C": (function() {
                var tiles = [];
                for (var x = 1; x < 4; x++) { tiles.push({ x, y: 0 }); tiles.push({ x, y: 4 }); tiles.push({ x: 0, y: x }); }
                tiles.push({ x: 4, y: 1 }); tiles.push({ x: 4, y: 3 });
                return tiles;
            })(),
            "D": (function() {
                var tiles = [];
                for (var x = 0; x < 4; x++) {
                    tiles.push({ x, y: 0 }); tiles.push({ x: 0, y: x + 1 });
                    if (x < 3) { tiles.push({ x: x + 1, y: 4 }); tiles.push({ x: 4, y: x + 1 }); }
                }
                return tiles;
            })(),
            "E": (function() {
                var tiles = [];
                for (var y = 0; y < 5; y++) {
                    tiles.push({ x: 0, y });
                    if (y < 4) { tiles.push({ x: y + 1, y: 0 }); tiles.push({ x: y + 1, y: 2 }); tiles.push({ x: y + 1, y: 4 }); }
                }
                return tiles;
            })(),
            "F": (function() {
                var tiles = [];
                for (var x = 0; x < 5; x++) {
                    tiles.push({ x, y: 0 });
                    if (x < 4) tiles.push({ x: 0, y: x + 1 });
                    if (x < 3) tiles.push({ x: x + 1, y: 2 });
                }
                return tiles;
            })(),
            "G": (function() {
                var tiles = [];
                for (var x = 1; x < 4; x++) {
                    tiles.push({ x: x, y: 0 }); tiles.push({ x: x + 1, y: 2 }); 
                    tiles.push({ x: x, y: 4 }); tiles.push({ x: 0, y: x });
                }
                tiles.push({ x: 4, y: 3 });
                return tiles;
            })(),
            "H": (function() {
                var tiles = [];
                for (var y = 0; y < 5; y++) { tiles.push({ x: 0, y }); tiles.push({ x: 4, y }); }
                for (var x = 1; x < 4; x++) tiles.push({ x, y: 2 });
                return tiles;
            })(),
            "I": (function() {
                var tiles = [];
                for (var a = 0; a < 3; a++) { tiles.push({ x: a + 1, y: 0 }); tiles.push({ x: 2, y: a + 1 }); tiles.push({ x: a + 1, y: 4 }); }
                return tiles;
            })(),
            "J": (function() {
                var tiles = [];
                for (var a = 0; a < 3; a++) { tiles.push({ x: a + 1, y: 0 }); tiles.push({ x: 2, y: a + 1 }); }
                tiles.push({ x: 0, y: 3 }); tiles.push({ x: 1, y: 4 });
                return tiles;
            })(),
            "K": (function() {
                var tiles = [];
                for (var y = 0; y < 5; y++) { tiles.push({ x: 0, y }); tiles.push({ x: 2 + Math.abs(y - 2), y }) }
                tiles.push({ x: 1, y: 2 });
                return tiles;
            })(),
            "L": (function() {
                var tiles = [];
                for (var y = 0; y < 5; y++) { tiles.push({ x: 0, y }); if (y < 4) tiles.push({ x: y + 1, y: 4 }); }
                return tiles;
            })(),
            "M": (function() {
                var tiles = [];
                for (var y = 0; y < 5; y++) { tiles.push({ x: 0, y }); tiles.push({ x: 4, y }); }
                for (var x = 1; x < 4; x++) tiles.push({ x, y: 2 - Math.abs(2 - x) });
                return tiles;
            })(),
            "N": (function() {
                var tiles = [];
                for (var y = 0; y < 5; y++) { tiles.push({ x: 0, y }); tiles.push({ x: 4, y }); }
                for (var x = 1; x < 4; x++) tiles.push({ x, y: x });
                return tiles;
            })(),
            "O": (function() {
                var tiles = [];
                for (var x = 1; x < 4; x++) {
                    tiles.push({ x, y: 0 }); tiles.push({ x, y: 4 });
                    tiles.push({ x: 0, y: x }); tiles.push({ x: 4, y: x });
                }
                return tiles;
            })(),
            "P": (function() {
                var tiles = [];
                for (var x = 0; x < 4; x++) {
                    tiles.push({ x, y: 0 }); tiles.push({ x: 0, y: x + 1 });
                    if (x < 3) tiles.push({ x: x + 1, y: 2 }); else tiles.push({ x: 4, y: 1 });
                }
                return tiles;
            })(),
            "Q": (function() {
                var tiles = [];
                for (var x = 1; x < 4; x++) {
                    tiles.push({ x, y: 0 }); tiles.push({ x, y: 4 });
                    tiles.push({ x: 0, y: x }); tiles.push({ x: 4, y: x });
                }
                tiles.push({ x: 2, y: 2 }); tiles.push({ x: 3, y: 3 }); tiles.push({ x: 4, y: 4 });
                return tiles;
            })(),
            "R": (function() {
                var tiles = [];
                for (var x = 0; x < 4; x++) {
                    tiles.push({ x, y: 0 }); tiles.push({ x: 0, y: x + 1 });
                    if (x < 3) tiles.push({ x: x + 1, y: 2 }); else tiles.push({ x: 4, y: 1 });
                }
                tiles.push({ x: 4, y: 3 }); tiles.push({ x: 4, y: 4 });
                return tiles;
            })(),
            "S": (function() {
                var tiles = [];
                for (var x = 0; x < 4; x++) {
                    tiles.push({ x: x + 1, y: 0 });
                    if (x < 3) tiles.push({ x: x + 1, y: 2 });
                    else { tiles.push({ x: 0, y: 1 }); tiles.push({ x: 4, y: 3 }); }
                    tiles.push({ x, y: 4 });
                }
                return tiles;
            })(),
            "T": (function() {
                var tiles = [];
                for (var x = 0; x < 5; x++) {
                    tiles.push({ x, y: 0 });
                    if (x < 4) tiles.push({ x: 2, y: x + 1 });
                }
                return tiles;
            })(),
            "U": (function() {
                var tiles = [];
                for (var y = 0; y < 4; y++) {
                    tiles.push({ x: 0, y }); tiles.push({ x: 4, y }); 
                    if (y < 3) tiles.push({ x: y + 1, y: 4 });
                }
                return tiles;
            })(),
            "V": (function() {
                var tiles = [];
                for (var y = 0; y < 3; y++) {
                    tiles.push({ x: 0, y }); tiles.push({ x: 4, y });
                }
                tiles.push({ x: 1, y: 3 }); tiles.push({ x: 2, y: 4 }); tiles.push({ x: 3, y: 3 });
                return tiles;
            })(),
            "W": (function() {
                var tiles = [];
                for (var y = 0; y < 4; y++) {
                    tiles.push({ x: 0, y }); tiles.push({ x: 4, y });
                }
                tiles.push({ x: 1, y: 4 }); tiles.push({ x: 3, y: 4 }); 
                tiles.push({ x: 2, y: 2 }); tiles.push({ x: 2, y: 3 }); 
                return tiles;
            })(),
            "X": (function() {
                var tiles = [];
                for (var y = 0; y < 5; y++) {
                    tiles.push({ x: y, y }); if (y != 2) tiles.push({ x: 4 - y, y });
                }
                return tiles;
            })(),
            "Y": (function() {
                var tiles = [];
                for (var y = 0; y < 5; y++) {
                    if (y < 2) { tiles.push({ x: y, y }); tiles.push({ x: 4 - y, y }); }
                    else tiles.push({ x: 2, y });
                }
                return tiles;
            })(),
            "Z": (function() {
                var tiles = [];
                for (var x = 0; x < 5; x++) {
                    tiles.push({ x, y: 0 }); tiles.push({ x, y: 4 });
                    if (x > 0 && x < 4) tiles.push({ x, y: 4 - x });
                }
                return tiles;
            })(),
            "car": (function() {
                var tiles = [];
                for (var y = -1; y <= 1; y++) {
                    tiles.push({ x: y + 1, y: Math.abs(y) });
                    tiles.push({ x: y + 1, y: Math.abs(y) + 2 });
                }
                tiles.push({ x: 1, y: 1 });
                return tiles;
            })(),
            "soldier": (function() {
                var tiles = [];
                for (var x = -1; x <= 1; x++) {
                    for (var y = Math.abs(x); y < 2; y++) {
                        tiles.push({ x: x + 1, y });
                    }
                }
                return tiles;
            })(),
            "warobstacle": function() {
                var tiles = [];
                for (var x = 0; x < 10; x++) {
                    var rnd = Math.floor(Math.random() * 10) % 2;
                    if (!!rnd) tiles.push({ x, y: 0 });
                }
                return tiles;
            }
        }

        var BrickGameModel = new function() {
            var loaded = false;
            var data = {
                level: 1,
                speed: 2,
                score: 0,
                volume: 1,
                gameNumber: 0,
                highScore: 0,
                life: 0
            };

            this.setLevel = function(dir) {
                if (dir === "up") data.level = data.level === 10 ? 1: data.level + 1;
                else if (dir === "down") data.level = data.level === 1 ? 10: data.level - 1;
                else if (typeof dir === "number") {
                    if (dir > 10) data.level = 10;
                    else if (dir < 1) data.level = 1;
                }
                else if (!dir || dir === "default") { /* do nothing */ }
                else throw new Error("Invalid way of setting level");
                txLevel.innerHTML = data.level.toString();
            };
            this.setSpeed = function(dir) {
                if (dir === "up") data.speed = data.speed === 10 ? 1: data.speed + 1;
                else if (dir === "down") data.speed = data.speed === 1 ? 10: data.speed - 1;
                else if (typeof dir === "number") {
                    if (dir > 10) data.speed = 10;
                    else if (dir < 1) data.speed = 1;
                }
                else if (!dir || dir === "default") { /* do nothing */ }
                else throw new Error("Invalid way of setting speed");
                txSpeed.innerHTML = data.speed.toString();
            };
            this.getScore = () => data.score;
            this.setScore = function(dir) {
                if (dir === "up") {
                    if (++data.score > gameData.highscores[data.gameNumber]) 
                        this.setHighScore(++gameData.highscores[data.gameNumber]);
                }
                else if (!dir || dir === "default") data.score = 0;
                else throw new Error("Invalid way of setting score");
                txScore.innerHTML = data.score.toString();
            },
            this.setHighScore = function(hs) {
                if (typeof hs !== "number") throw new Error("Invalid way of setting high score");
                txHighScore.innerHTML = (data.highScore = hs).toString();
            };
            this.currentGame = () => data.gameNumber;
            this.changeGame = function(dir) {
                var gl = gameData.highscores.length - 1;
                if (dir === "up") data.gameNumber = data.gameNumber === gl ? 0: data.gameNumber + 1;
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
                    audios: (() => ["opening2", "startgame", "gameover", "levelUp", "startgame2"]
                        .map(audio => new Audio(soundBaseURL + "/" + audio + ".wav")))()
                };
                var sound = {
                    current: 0,
                    audios: (() => ["move", "hit", "move2", "fire", "score", "carsound1", "fire2", "select"]
                        .map(audio => new Audio(soundBaseURL + "/" + audio + ".wav")))()
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
                    var audioType = type === "music" ? music: sound;
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
            this.lifeTilePanel = new function() {
                function changeTileColor(x, y, color) {
                    if (!color) color = "white";
                    var outerCell = document.getElementById("lifeTileCell" + String.fromCharCode(x + 65) + String.fromCharCode(y + 65));
                    if (outerCell) outerCell.children[0].setAttribute("data-tilecolor", color);
                }
                function fill(color) {
                    for(var x = 0; x < 4; x++) for(var y = 0; y < 4; y++) changeTileColor(x, y, color);
                }
                this.getLife = () => data.life;
                this.setLife = function(dir) {
                    clearInterval(timer);
                    if (dir === "down") {
                        if (data.life !== 0) data.life--;
                    }
                    else if (typeof dir === "number") {
                        if (dir > 4) dir = 4;
                        else if (dir < 0) dir = 0;
                        data.life = dir;
                    }
                    else {
                        throw new Error("Invalid way of setting life value");
                    }
                    fill("white");
                    for (var l = 0; l < data.life; l++) changeTileColor(0, 3 - l, "black");
                };
                this.blink = function() {
                    var shown = false;
                    timer = setInterval(function() { fill(shown ? "black": "white"); shown = !shown; }, 200);
                };
            }
        };

        var GameSound = BrickGameModel.gameSound;

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
        
        function KeySound() {
            console.log("key sounds");
        }

        var LifeTilePanel = BrickGameModel.lifeTilePanel;

        function Page() {
            var _thispage = this;
            var isMarqueePage = false;
            var enabled = true;
            var canvas = "white";

            var keydownfunction, keyupfunction, disabledkeys = [];
            var bos = [], timers = [];

            function changeTileColor(x, y, color) {
                if (!color) color = "white";
                var outerCell = document.getElementById("tileCell" + String.fromCharCode(x + 65) + String.fromCharCode(y + 65));
                if (outerCell) outerCell.children[0].setAttribute("data-tilecolor", color);
            }
            function generateRandomId() {
                var number = Math.floor(Math.random() * 9e8) + 1e8;
                return bos.filter(bo => bo.ID === number).length == 0 ? number: generateRandomId();
            }
            function _canvasColor(color) {
                for(var x = 0; x < 10; x++) for(var y = 0; y < 20; y++) changeTileColor(x, y, color);
            }
            function setZIndices() {
                for (var i = 0; i < bos.length; i++) bos[i].zIndex = i;
            }
            function paint() {

                bos = bos.sort(function(a, b) { return a.zIndex - b.zIndex; });
    
                var index = 0;
                while (index < bos.length) {
                    var brickObject = bos[index];
                    var loc = brickObject.brickLocation;
                    var brickTiles = brickObject.oldTiles;
                    //if (!brickTiles.oldTiles) {
                        var brickTileCount = brickTiles.length;
                        for (var j = 0; j < brickTileCount; j++) {
                            var brickTile = brickTiles[j];
                            changeTileColor(brickTile.screenX, brickTile.screenY, canvas);
                        }
                    //}
                   
    
                    if (brickObject.tiles.length == 0 && brickObject.isRemoved) bos.splice(index, 1);
                    else index++;
                }
    
                setZIndices();
                
                var brickObjectsLength = bos.length;
                for (var i = 0; i < brickObjectsLength; i++) {
                    var brickObject = bos[i];
                    var brickTiles = brickObject.tiles;
                    var brickTileCount = brickTiles.length;
                    var brickColor = brickObject.visible ? brickObject.color: canvas;
                    for (var j = 0; j < brickTileCount; j++) {
                        var brickTile = brickTiles[j];
                        changeTileColor(brickTile.screenX, brickTile.screenY, brickColor);
                    }
                    brickObject.overlappedObjects = { };
                    brickObject.collidedObjects = {
                        left: [], right: [], top: [], bottom: [], all: []
                    };

                    // selects all brick objects but this one
                    var index = bos.indexOf(brickObject);
                    var ctr = 0;
                    var overlapped = false;
                    while (ctr < bos.length && !overlapped) {
                        var otherIndex = bos.indexOf(bos[ctr]);
                        if (index != otherIndex) {
                            overlapped = brickTiles.filter(function(bt) {
                                return bos[ctr].tiles.filter(function(obt) {
                                    return bt.screenX == obt.screenX && bt.screenY == obt.screenY
                                }).length > 0;
                            }).length > 0;
                        }
                        ctr++;
                    }
                    brickObject.overlappedObjects.overlapped = overlapped;
    
                    brickObject.oldTiles = JSON.parse(JSON.stringify(brickObject.tiles));
                }
    
                // for (var i = 0; i < brickObjectsLength; i++) {
                //     var brickObject = bos[i];
                //     var brickTiles = brickObject.tiles;
                //     var brickTileCount = brickTiles.length;
                //     for (var j = i + 1; j < brickObjectsLength; j++) {
                //         var collidedLeft = false, collidedRight = false, collidedTop = false, collidedBottom = false;
                //         var overlappedBrickObject = bos[j];
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
            this.canvasColor = color => _canvasColor(canvas = color ? color: canvas);
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
            this.keyup = kuf => window.onkeyup = kuf;
            this.stopTimers = function() { timers.forEach(t => t.stop()); timers = []; }
            this.destroy = function() {
                _thispage.stopTimers();
                while (bos.length > 0) bos.splice(0, 1); bos = [];
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
            this.removeBrickObjects = function() {
                for (var i = 0; i < bos.length; i++) {
                    bos[i]._object_.remove(false);
                }
                paint();
            }
            this.marquee = function(text, speedInMillis) {
                if (!text || text === null) text = "";
                var chars = text.split("");
                var y = 20;

                // GENERATING BRICK CHARACTER TILES
                function marquee() {
                    for (var i = 0; i < text.length; i++) {
                        var bl = bos[i];
                        if (!bl) bl = new _thispage.BrickObject({ color: "white", tiles: brickObjects[text[i]] });
                        else bl = bl._object_;
                        bl.setLocation(3, (6 * i) + y);
                    }
                    if (y < -(6 * text.length)) y = 20;
                    else y--;
                }

                var timer = new _thispage.Timer({
                    func: function() {
                        marquee();
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
                var X, Y;

                params = params ? params: { };
                _bo.tiles = JSON.parse(JSON.stringify(params.tiles ? params.tiles: []));
                _bo.oldTiles = JSON.parse(JSON.stringify(_bo.tiles));
                _bo.color = params.color ? params.color: "black";
                _bo.ID = generateRandomId();
                _bo.brickLocation = params.brickLocation;
                _bo.visible = params.visible ? params.visible: true;
                _bo.isRemoved = false;

                function _setLocation(x, y, tiles) {
                    _bo.oldTiles = JSON.parse(JSON.stringify(_bo.tiles));
                    if (tiles) _bo.tiles = JSON.parse(JSON.stringify(tiles));
                    var newTiles = _bo.tiles;
                    for (var t = 0; t < newTiles.length; t++) {
                        tileX = x + newTiles[t].x; tileY = y + newTiles[t].y;
                        newTiles[t].screenX = tileX; newTiles[t].screenY = tileY;
                    }
                    X = x; Y = y;
                    paint();
                }

                this.index = function() { return bos.indexOf(_bo); };
                this.tileCount = function() { return _bo.tiles.length; };
                this.getLocation = function() { return { x: X, y: Y }; };
                this.setLocation = function(x, y, tiles) { _setLocation(x, y, tiles); };
                this.setTiles = function(tiles) { _setLocation(_bo.brickLocation.x, _bo.brickLocation.y, tiles) };
                this.remove = function(paintAfter) {
                    console.log(this);
                    _bo.isRemoved = true;
                    _bo.tiles = [];
                    if (paintAfter = (paintAfter == undefined ? true: paintAfter)) paint();
                };
                this.isOverlapped = function() {
                    return _bo.overlappedObjects.overlapped;
                }
                this.hasTile = function(screenX, screenY) {
                    return _bo.tiles.filter(function(t) {
                        return t.screenX == screenX && t.screenY == screenY;
                    }).length > 0;
                };
                this.addTile = function(screenX, screenY) {
                    _bo.oldTiles = _bo.tiles.clone();
                    var t = _bo.tiles[0];
                    _bo.tiles.push({ screenX, screenY, x: (screenX - X), y: (screenY - Y) });
                    paint();
                }
                this.removeTile = function(screenX, screenY) {
                    _bo.oldTiles = _bo.tiles.clone();
                    _bo.tiles.splice(_bo.tiles.indexOf(_bo.tiles.filter(function(t) {
                        return t.screenX == screenX && t.screenY == screenY;
                    })[0]), 1);
                    paint();
                }

                bos.push(_bo);

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
            page.marquee("BRICK GAME");
            page.canvasColor("black");
            page.keydown(function() {
                console.log("exited brick game marquee");
                GameSound.sound.select();
                navigate(GameSelectPage);
            });
            LifeTilePanel.blink();
            return page;
        }
        function GameSelectPage() {
            var page = new Page();

            BrickGameModel.setScore();

            var gameChar = new page.BrickObject({ brickLocation: { x: 3, y: 1 } });

            // var characterTiles = brickObjectTiles.filter(function(l) { return l.name == character }).first().tiles;
			// var loc = brickObject.getLocation();
			// brickObject.setLocation(loc.x, loc.y, characterTiles);
            
            page.keydown(GameSound.sound.select,
            {
                left: {
                    repeat: true,
                    _function: () => BrickGameModel.setSpeed("down")
                },
                right: {
                    repeat: true,
                    _function: () => BrickGameModel.setSpeed("up")
                },
                up: {
                    repeat: true,
                    _function: () => BrickGameModel.setLevel("up")
                },
                down: {
                    repeat: true,
                    _function: () => BrickGameModel.setLevel("down")
                },
                space: {
                    repeat: true,
                    _function: function() {
                        BrickGameModel.changeGame("up");
                        gameChar.setTiles(brickObjects[String.fromCharCode(BrickGameModel.currentGame() + 65)]);
                    } 
                },
                enter: function() {
                    console.log("Game started"); navigate(GamePage);
                }
            });

            gameChar.setTiles(brickObjects[String.fromCharCode(BrickGameModel.currentGame() + 65)]);

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

                        var sides = { };
                        var myCar = { };
                        var cars = [];
                        var tmr = { };

                        function loadSides() {
                            for (var i = 0; i < 6; i++) {
                                var y = 0;
                                if (!sides[1][i]) {
                                    sides[1].push(new page.BrickObject({ color: "red", tiles: brickObjects["1x3"] }));
                                    sides[2].push(new page.BrickObject({ color: "red", tiles: brickObjects["1x3"] }));
                                    y = -3 + (i * 4);
                                }
                                else {
                                    y = sides[1][i].getLocation().y + 1;
                                }
                                sides[1][i].setLocation(0, y > 20 ? -3: y);
                                sides[2][i].setLocation(9, y > 20 ? -3: y);
                            }

                            for (var i = 0; i < 3; i++) {
                                var x = 0, y = 0;
                                if (!cars[i]) {
                                    cars.push(new page.BrickObject({ tiles: brickObjects["car"] }));
                                    x = ((Math.floor(Math.random() * 100) % 2) * 3) + 2;
                                    y = -4 - (i * 10);
                                }
                                else {
                                    loc = cars[i].getLocation();
                                    if (loc.y > 24) {
                                        x = ((Math.floor(Math.random() * 100) % 2) * 3) + 2;
                                        y = -4;
                                    } 
                                    else {
                                        x = loc.x;
                                        y = ++loc.y;
                                    }
                                    if (y == 20) score();
                                }
                                cars[i].setLocation(x, y);
                            }
                        }

                        function run() {
                            loadSides();
                            if (myCar && myCar.isOverlapped()) lifeLost();
                        }

                        function initializeBrickObjects() {
                            sides = { 1: [], 2: [] };
                            cars = [];
                            myCar = new page.BrickObject({ tiles: brickObjects["car"], brickLocation: { x: 2, y: 16 } });
                            loadSides();
                        }

                        function initializeTimers() {
                            tmr = new page.Timer({
                                interval: 50,
                                func: function() {
                                    run();
                                }
                            });
                            tmr.start();
                        }

                        this.keydown = {
                            left: function() { 
                                var loc = myCar.getLocation();
                                if (loc.x != 2) myCar.setLocation(loc.x - 3, loc.y);
                                if (myCar.isOverlapped()) lifeLost();
                            },
                            right: function() { 
                                var loc = myCar.getLocation();
                                if (loc.x != 5) myCar.setLocation(loc.x + 3, loc.y);
                                if (myCar.isOverlapped()) lifeLost();
                            },
                            space: function() { console.log("life - 1"); lifeLost(); },
                            up: function() { 
                                console.log(page.brickObjects);
                            },
                            down: function() {
                                //brickObject1.remove();
                            }
                        };
                        this.initialize = function() {
                            initializeBrickObjects();
                            initializeTimers();
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

                        var sides = [];
                        var myCar = { };
                        var cars = [];
                        var tmr = { };

                        function loadSides() {
                            for (var i = 0; i < 6; i++) {
                                var y = 0;
                                if (!sides[i]) {
                                    sides.push(new page.BrickObject({ color: "red", tiles: brickObjects["1x3"] }));
                                    y = -3 + (i * 4);
                                }
                                else {
                                    y = sides[i].getLocation().y + 1;
                                }
                                
                                sides[i].setLocation(9, y > 20 ? -3: y);
                            }

                            for (var i = 0; i < 3; i++) {
                                var x = 0, y = 0;
                                if (!cars[i]) {
                                    cars.push(new page.BrickObject({ tiles: brickObjects["car"] }));
                                    x = (Math.floor(Math.random() * 100) % 3) * 3;
                                    y = -4 - (i * 10);
                                }
                                else {
                                    loc = cars[i].getLocation();
                                    if (loc.y > 24) {
                                        x = (Math.floor(Math.random() * 100) % 3) * 3;
                                        y = -4;
                                    } 
                                    else {
                                        x = loc.x;
                                        y = ++loc.y;
                                    }
                                    if (y == 20) score();
                                }
                                cars[i].setLocation(x, y);
                            }
                        }

                        function run() {
                            loadSides();
                            if (myCar && myCar.isOverlapped()) lifeLost();
                        }

                        function initializeBrickObjects() {
                            sides = [];
                            cars = [];
                            loadSides();
                            myCar = new page.BrickObject({ tiles: brickObjects["car"], brickLocation: { x: 3, y: 16 } });
                        }

                        function initializeTimers() {
                            tmr = new page.Timer({
                                interval: 50,
                                func: function() {
                                    run();
                                }
                            });
                            tmr.start();
                        }

                        this.keydown = {
                            left: function() { 
                                var loc = myCar.getLocation();
                                if (loc.x != 0) myCar.setLocation(loc.x - 3, loc.y);
                                if (myCar.isOverlapped()) lifeLost();
                            },
                            right: function() { 
                                var loc = myCar.getLocation();
                                if (loc.x != 6) myCar.setLocation(loc.x + 3, loc.y);
                                if (myCar.isOverlapped()) lifeLost();
                            },
                            space: function() { console.log("life - 1"); lifeLost(); },
                            up: function() { 
                                console.log(page.brickObjects);
                            },
                            down: function() {
                                //brickObject1.remove();
                            }
                        };
                        this.initialize = function() {
                            initializeBrickObjects();
                            initializeTimers();
                            tmr.start();
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
                },
                {
                    gameType: "war1", 
                    mode: 3, 
                    score: 0, 
                    speedTimeout: [300, 280, 260, 240, 220, 200, 180, 160, 140, 120],
                    gameplay: function() {
                        var soldier = { };
                        var obstacles = [];
                        var tmr = { };

                        function run() {
                            // trim
                            obstacles = obstacles.filter(function(o) {
                                return o.tileCount() > 0;
                            });

                            if (obstacles[obstacles.length - 1].getLocation().y < 17) {
                                for (var i = 0; i < obstacles.length; i++) {
                                    var loc = obstacles[i].getLocation();
                                    obstacles[i].setLocation(loc.x, ++loc.y);
                                }
                                obstacles.unshift(new page.BrickObject({ tiles: brickObjects["warobstacle"](), brickLocation: { x: 0, y: 0 } }));
                            }
                            else lifeLost();
                        }

                        function fire() {
                            var exists = false;
                            var ctr = obstacles.length - 1;
                            while (obstacles.length > 0 && !exists && ctr >= 0) {
                                var locy = obstacles[ctr].getLocation().y;
                                var slocx = soldier.getLocation().x;
                                if (exists = obstacles[ctr].hasTile(slocx + 1, locy)) {
                                    obstacles[ctr].removeTile(slocx + 1, locy);
                                    GameSound.sound.fire();
                                    score();
                                }
                                ctr--;
                            }
                        }

                        function initializeBrickObjects() {
                            obstacles = [];
                            soldier = new page.BrickObject({ tiles: brickObjects["soldier"], brickLocation: { x: 4, y: 18 } });
                            for (var i = 9; i >= 0; i--) {
                                obstacles.unshift(new page.BrickObject({ tiles: brickObjects["warobstacle"](), brickLocation: { x: 0, y: i } }));
                            }
                        }

                        function initializeTimers() {
                            tmr = new page.Timer({
                                interval: 500,
                                func: function() {
                                    run();
                                }
                            });
                            tmr.start();
                        }

                        this.keydown = {
                            left: { 
                                _function: function() { 
                                    var loc = soldier.getLocation();
                                    if (loc.x != -1) {
                                        soldier.setLocation(--loc.x, loc.y);
                                        GameSound.sound.move();
                                    }
                                },
                                repeat: true
                            },
                            right: {
                                _function: function() {
                                    var loc = soldier.getLocation();
                                    if (loc.x != 8) {
                                        soldier.setLocation(++loc.x, loc.y);
                                        GameSound.sound.move();
                                    }
                                },
                                repeat: true
                            },
                            space: { 
                                _function: function() { fire(); },
                                repeat: true
                            }
                        };
                        this.initialize = function() {
                            initializeBrickObjects();
                            initializeTimers();
                            console.log("initialized game");
                        };
                    }
                },
                {
                    gameType: "war2", 
                    mode: 3, 
                    score: 0, 
                    speedTimeout: [300, 280, 260, 240, 220, 200, 180, 160, 140, 120],
                    gameplay: function() {
                        var soldier = { };
                        var obstacles = [];
                        var tmr = { };

                        function run() {
                            // trim
                            obstacles = obstacles.filter(function(o) {
                                return o.tileCount() > 0;
                            });

                            if (obstacles[obstacles.length - 1].getLocation().y < 17) {
                                for (var i = 0; i < obstacles.length; i++) {
                                    var loc = obstacles[i].getLocation();
                                    console.log(loc.x, loc.y);
                                    obstacles[i].setLocation(loc.x, ++loc.y);
                                }
                                obstacles.unshift(new page.BrickObject({ tiles: brickObjects["warobstacle"](), brickLocation: { x: 0, y: 0 } }));
                            }
                            else lifeLost();
                        }

                        function fire() {
                            var exists = false, exists2 = false;
                            var ctr = obstacles.length - 1;
                            while (!exists && ctr >= 0) {
                                var locy = obstacles[ctr].getLocation().y;
                                var slocx = soldier.getLocation().x;
                                if (exists = ctr == 0 || obstacles[ctr].hasTile(slocx + 1, locy)) {
                                    if (ctr < 17) {
                                        if (ctr + 1 == obstacles.length) {
                                            obstacles.push(new page.BrickObject({ tiles: [], brickLocation: { x: 0, y: ctr + 1 } }));
                                        }
                                        obstacles[ctr + 1].addTile(slocx + 1, locy + 1);
                                        GameSound.sound.fire2();
                                    }
                                }
                                ctr--;
                            }
                        }
                        
                        function initializeBrickObjects() {
                            obstacles = [];
                            soldier = new page.BrickObject({ tiles: brickObjects["soldier"], brickLocation: { x: 4, y: 18 } });
                            for (var i = 9; i >= 0; i--) {
                                console.log(i);
                                obstacles.unshift(new page.BrickObject({ tiles: brickObjects["warobstacle"](), brickLocation: { x: 0, y: i } }));
                            }
                        }

                        function initializeTimers() {
                            tmr = new page.Timer({
                                interval: 5000,
                                func: function() {
                                    run();
                                }
                            });
                            tmr.start();
                        }

                        this.keydown = {
                            left: { 
                                _function: function() { 
                                    var loc = soldier.getLocation();
                                    if (loc.x != -1) {
                                        soldier.setLocation(--loc.x, loc.y);
                                        GameSound.sound.move();
                                    }
                                },
                                repeat: true
                            },
                            right: {
                                _function: function() {
                                    var loc = soldier.getLocation();
                                    if (loc.x != 8) {
                                        soldier.setLocation(++loc.x, loc.y);
                                        GameSound.sound.move();
                                    }
                                },
                                repeat: true
                            },
                            space: {
                                repeat: true,
                                _function: function() { fire(); }
                            } 
                        };
                        this.initialize = function() {
                            initializeBrickObjects();
                            initializeTimers();
                            console.log("initialized game");
                        };
                    }
                }
            ];
            
            var paused = false;

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
                LifeTilePanel.setLife("down");

                var params = {
                    brickObjects: brickObjects,
                    interval: 400,
                    count: 3,
                    endFunction: function() {
                        if (LifeTilePanel.getLife() === 0) {
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
                                // remove all brick objects if exists
                                page.removeBrickObjects();
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
            LifeTilePanel.setLife(4);

            initialize();
            return page;
        }
        function LevelUpPage() {
            var page = new Page();
            page.canvasColor("black");
            page.marquee("LEVEL UP");
            page.keydown("disableAll");
            GameSound.music.levelUp(function() {
                page.keydown("enableAll");
                navigate(GamePage);
            });
            return page;
        }
        function GameOverPage() {
            var page = new Page();
            page.canvasColor("black");
            page.marquee("GAME OVER");
            page.keydown(function() {
                console.log("exited game over marquee");
                KeySound();
                navigate(GameSelectPage);
            });
            LifeTilePanel.blink();
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

