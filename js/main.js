twineRogue = function() {
    var map = [];
    var known = [];
    var px;
    var py;
    var lightradius = 2;
    var prevdesc = "";

    var width = 31;
    var height = 11;
    var squareWidth = 19;
    var squareHeight = 36;
    var gridfont = "48px VT323";
    var div, c, ctx;

    // http://roguebasin.roguelikedevelopment.org/index.php?title=Cellular_Automata_Method_for_Generating_Random_Cave-Like_Levels
    function generateMap(width, height) {
        var map = [];
        for (var y = 0; y < height; y++) {
            map[y] = [];
            for (var x = 0; x < width; x++) {
                if (Math.random() <= 0.45) {
                    map[y][x] = "#";
                } else {
                    map[y][x] = ".";
                }
            }
        }
        var numTiles = function(y, x, n) {
            var count = 0;
            for (var my = y - n; my <= y + n; my++) {
                for (var mx = x - n; mx <= x + n; mx++) {
                    if ((my < 0 || my >= map.length || mx < 0 || mx >= map[my].length) || map[my][mx] == "#") {
                        count++;
                    }
                }
            }
            return count;
        }

        var iter = function() {
            var map2 = [];
            for (var y = 0; y < height; y++) {
                map2[y] = [];
                for (var x = 0; x < width; x++) {
                    if (numTiles(y, x, 1) >= 5 || numTiles(y, x, 2) <= 2) {
                        map2[y][x] = "#";
                    } else {
                        map2[y][x] = ".";
                    }
                }
            }
            map = map2;
        }
        for (var i = 0; i < 5; i++) {
            iter();
        }

        // var iter = function() {
        //     var x = Math.floor(Math.random() * width);
        //     var y = Math.floor(Math.random() * height);
        //     if (numTiles(y, x, 1) > 5) {
        //         map[y][x] = "#";
        //     } else {
        //         map[y][x] = ".";
        //     }
        // }
        // for (var i = 0; i < 80000; i++) {
        //     iter();
        // }

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                if (y == 0 || y == height - 1 || x == 0 || x == width - 1) {
                    map[y][x] = "#";
                }
            }
        }

        for (var i = 0; i < 100; i++) {
            var found = false;
            while (!found) {
                var x = Math.floor(Math.random() * width);
                var y = Math.floor(Math.random() * height);
                if (map[y][x] == ".") {
                    map[y][x] = "$";
                    found = true;
                }
            }
        }

        var found = false;
        while (!found) {
            var x = Math.floor(Math.random() * width);
            var y = Math.floor(Math.random() * height);
            if (map[y][x] == "." && numTiles(y, x, 2) < 6) {
                py = y;
                px = x;
                map[y][x] = "<";
                found = true;
            }
        }

        // for (var y = 0; y < height; y++) {
        //     console.log(map[y].join(""));
        // }
        return map;
    }

    function init() {
        createCanvas();
        restart();
        // clearCanvas();

        // map = generateMap(100, 100);
        // for (var y = 0; y < map.length; y++) {
        //     known[y] = new Array(map[y].length).fill(0);
        // }
        // demo();
        /*
        fetch('js/map.txt')
            .then(response => response.text())
            .then(function(text) {
                var lines = text.split("\n");
                for (var i = 0; i < lines.length; i++) {
                    map[i] = lines[i].split("");
                    known[i] = new Array(map[i].length).fill(0);
                }
            })
            .then(function() {
                // restart();
                drawMap();
            });
            */
    }

    function restart() {
        clearCanvas();

        map = generateMap(100, 100);
        for (var y = 0; y < map.length; y++) {
            known[y] = new Array(map[y].length).fill(0);
        }
        demo();
    }

    function createCanvas() {
        c = document.createElement("canvas");
        c.width = width * squareWidth;
        c.height = height * squareHeight;
        c.id = "grid";
        ctx = c.getContext("2d");

        div = document.createElement("div");
        div.id = "canvas";
        div.append(c);
        div.style.display = "none";

        var story = document.getElementById("story");
        story.parentNode.insertBefore(div, story);
    }

    function hideCanvas() {
        div.style.display = "none";
    }

    function showCanvas() {
        div.style.display = "block";
    }

    function clearCanvas() {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, c.width, c.height);
    }

    function drawCharacter(y, x, ch, cl) {
        cl = cl || "#FFFFFF";
        ctx.textAlign = "center";
        ctx.font = gridfont;
        ctx.fillStyle = cl;
        ctx.fillText(ch, x * squareWidth + squareWidth / 2, (y + 1) * squareHeight);
    }

    function getTextWidth(text, font) {
        // re-use canvas object for better performance
        var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        // console.log(metrics.width);
        return metrics.width;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function demo() {
        await sleep(1000);

        // ctx.fillStyle = "#FFFFFF";
        // ctx.textAlign = "center";
        // ctx.font = gridfont;
        // getTextWidth("M", "48px VT323");

        drawMap();
    }

    function drawMap() {
        for (var my = py - lightradius; my <= py + lightradius; my++) {
            for (var mx = px - lightradius; mx <= px + lightradius; mx++) {
                if (!(my < 0 || my >= map.length || mx < 0 || mx >= map[my].length)) {
                    known[my][mx] = 1;
                }
            }
        }

        for (var my = py - Math.floor((height / 2)), y = 0; y < height; my++, y++) {
            for (var mx = px - Math.floor((width / 2)), x = 0; x < width; mx++, x++) {
                var ch = " ";
                var cl = "#FFFFFF";
                if (!(my < 0 || my >= map.length || mx < 0 || mx >= map[my].length)) {
                    if (my == py && mx == px) {
                        ch = "@";
                    } else if (known[my][mx] === 1) {
                        ch = map[my][mx];
                    }

                    if (my == 0 || my == map.length - 1 || mx == 0 || mx == map[my].length - 1) {
                        cl = "#FF0000";
                    } else if (ch == "$") {
                        cl = "#FFFA00";
                    } else if (ch == "<") {
                        cl = "#00DA00";
                    } else {
                        var dist = max_dist(my, mx, py, px);
                        if (dist <= lightradius) {
                            cl = "#FFFFFF";
                        } else if (dist <= lightradius + 1) {
                            cl = "#CCCCCC";
                        } else if (dist <= lightradius + 2) {
                            cl = "#999999";
                        } else {
                            cl = "#333333";
                        }
                    }
                }
                drawCharacter(y, x, ch, cl);
            }
        }
    }

    function max_dist(y1, x1, y2, x2) {
        return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
    }

    function move(y, x) {
        var elemAscend = document.getElementById("ascend");
        elemAscend.setAttribute("hidden", true);

        var ny = py + y;
        var nx = px + x;
        if (map[ny][nx] == "#") {
            if (ny == 0 || nx == 0 || ny == map.length - 1 || nx == map[ny].length - 1) {
                clickdesc("desc-pwall");
            } else {
                SugarCube.State.variables.fuelLeft -= 10;
                px = nx;
                py = ny;
                if (SugarCube.State.variables.fuelLeft <= 0) {
                    SugarCube.Engine.play("nomorefuel");
                } else {
                    map[ny][nx] = ".";
                    clickdesc("desc-wall");
                    document.getElementById("fuelLeft-none").children[0].click();
                }
            }
        } else {
            SugarCube.State.variables.fuelLeft -= 1;
            px = nx;
            py = ny;

            if (SugarCube.State.variables.fuelLeft <= 0) {
                SugarCube.Engine.play("nomorefuel");
            } else {
                if (map[ny][nx] == "<") {
                    elemAscend.removeAttribute("hidden");
                }
                if (map[ny][nx] == "$") {
                    map[ny][nx] = ".";
                    SugarCube.State.variables.treasure += 1;
                    document.getElementById("treasure-none").children[0].click();
                    clickdesc("desc-treasure");
                } else {
                    clickdesc("desc-none");
                }
                document.getElementById("fuelLeft-none").children[0].click();
            }
        }
        clearCanvas();
        drawMap();
    }

    function clickdesc(desc) {
        if (prevdesc != desc) {
            document.getElementById(desc).children[0].click();
            prevdesc = desc;
        }
    }

    function hookkeys(b) {
        if (b) document.onkeydown = checkKey;
        else document.onkeydown = null;
    }

    function checkKey(e) {
        e = e || window.event;
        if (e.keyCode == '38') {
            // up arrow
            move(-1, 0);
        } else if (e.keyCode == '40') {
            // down arrow
            move(1, 0);
        } else if (e.keyCode == '37') {
            // left arrow
            move(0, -1);
        } else if (e.keyCode == '39') {
            // right arrow
            move(0, 1);
            //console.log("right");
        }
    }
    // window.onload = function() {
    //     console.log("!");
    //     //document.getElementById("menu-item-restart").children[0].click();
    // }
    init();

    return {
        restart: restart,
        move: move,
        hookkeys: hookkeys,
        hideCanvas: hideCanvas,
        showCanvas: showCanvas
    }
}();
