


class Shooter {
    constructor() {
    }
    draw() {
        if (moveleft) shooterspeed = -shootermaxSpeed;
        else if (moveright) shooterspeed = shootermaxSpeed;
        else shooterspeed = 0;

        shooterposition.x += shooterspeed;
        if (shooterposition.x < 0) shooterposition.x = 0;
        if (shooterposition.x + shootersize > canvas.width) shooterposition.x = canvas.width - shootersize;
        context.imageSmoothingEnabled = false;
        context.drawImage(shooterimg, shooterposition.x, shooterposition.y, shootersize, shootersize);

    }
}

function background() {
    context.imageSmoothingEnabled = false;
    for (let i = map.length - 1; i > -1; --i) {
        let value = map[i];
        let tilex = (i % tilesize) * columns;
        let tiley = Math.floor(i / tilesize) * rows;
        context.drawImage(tilesheet, value * tilesize, 0, tilesize - 1, tilesize - 1, tilex, tiley, columns + 1, rows + 1);

    }
}
class Bullet {
    constructor() {
        this.x = shooterposition.x + shootersize / 2;
        this.y = shooterposition.y;
        this.vy = bulletspeed;
        this.viscible = true;
        bullets.push(this);
    }

    movebullet() {
        if (this.viscible) {
            context.beginPath();
            context.fillStyle = "#6b6b6b";
            context.arc(this.x, this.y, bulletradius, 0, Math.PI * 2, false);
            context.closePath();
            context.fill();
            this.y += -this.vy;
            if (this.y < 0) {
                bullets.splice(bullets.indexOf(this), 1);
            }
        }
        else {
            bullets.splice(bullets.indexOf(this), 1);
        }
    }
    bulletvisciblity() {
        this.viscible = false;
    }
    get bulletx() {
        return this.x;
    }
    get bullety() {
        return this.y;
    }
    get getviscibility() {
        return this.viscible;
    }

}

class Rock {
    constructor(radius, startx, starty, strength, vx, vy) {
        this.radius = radius;
        this.x = startx;
        this.y = starty;
        this.beginy = this.y;
        this.vx = vx;
        this.vy = vy;
        this.gravity = 0.05 * scale;
        this.bounce = 1;
        this.strength = strength;
        this.power = this.strength;
        rocks.push(this);

    }
    moverock() {
        if (this.strength > 0) {
            context.beginPath();
            context.fillStyle = 'yellow';
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.closePath();
            context.fill();

            context.fillStyle = "black";
            var fontsize = 20 * scale;
            context.font = fontsize + "px Arial";
            context.textAlign = "center";
            context.fillText(this.strength, this.x, this.y);


            if (this.x < this.radius || this.x > canvas.width - this.radius) {
                this.vx = -this.vx;
            }
            if (this.y >= ((7 * canvas.height / 8) - this.radius)) {
                this.y = ((7 * canvas.height / 8) - this.radius);
                this.vy = -(this.vy * this.bounce);
            }
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
        }
        else {
            if (this.radius > 30 * scale) {
                var rradius = this.radius / 1.5;
                if (rradius < 20 * scale)
                    rradius = 20 * scale;
                var ry = this.y;
                var rx1 = this.x - rradius;
                var rx2 = this.x + rradius;
                var rvx = this.vx;
                var rvy = this.vy;

                if (rvx < 0)
                    rvx = -rvx;
                if (rvx < 0.5)
                    rvx = 0.5

                var rstrength = this.power / 2;
                if (rstrength > 0.9) {
                    if (rx1 < rradius) rx1 = rradius;
                    if (rx2 > canvas.width - rradius) rx2 = canvas.width - rradius;
                    rocke = new Rock(rradius, rx1, ry, rstrength, -rvx, rvy);
                    rocke = new Rock(rradius, rx2, ry, rstrength, +rvx, rvy);
                }


            }
            rocks.splice(rocks.indexOf(this), 1);
        }
    }
    rockpower() {
        this.strength--;
    }
    get rockx() {
        return this.x;
    }
    get rocky() {
        return this.y;
    }
    get rockradius() {
        return this.radius;
    }
}


function bulletrockcollision() {
    for (let i = 0; i < bullets.length; i++) {
        if (bullets[i].getviscibility) {
            for (let j = 0; j < rocks.length; j++) {
                if (bullets[i].bulletx > rocks[j].rockx - rocks[j].rockradius && bullets[i].bulletx < rocks[j].rockx + rocks[j].rockradius &&
                    bullets[i].bullety > rocks[j].rocky - rocks[j].rockradius && bullets[i].bullety < rocks[j].rocky + rocks[j].rockradius) {
                    bullets[i].bulletvisciblity();
                    rocks[j].rockpower();
                    score++;
                    gamescore();
                }
            }
        }
    }
}


function gameover() {
    for (let i = 0; i < rocks.length; i++) {
        if ((shooterposition.x < rocks[i].rockx && shooterposition.x + (3 / 8 * shootersize) > rocks[i].rockx && shooterposition.y + (13 / 33 * shootersize) < rocks[i].rocky + rocks[i].rockradius) ||
            (shooterposition.x + (shootersize * 3 / 8) < rocks[i].rockx && shooterposition.x + (5 / 8 * shootersize) > rocks[i].rockx && shooterposition.y < rocks[i].rocky + rocks[i].rockradius) ||
            (shooterposition.x + (shootersize * 5 / 8) < rocks[i].rockx && shooterposition.x + shootersize > rocks[i].rockx && shooterposition.y + (13 / 33 * shootersize) < rocks[i].rocky + rocks[i].rockradius)) {

            if (localStorage.getItem("Highscore")) {
                var highscore = parseFloat(localStorage.getItem("Highscore"));

                if (highscore < score) {
                    localStorage.setItem("Highscore", score);
                }
            }
            else {
                localStorage.setItem("Highscore", score);
            }
            var message = "End of game";
            var newLine = "\r\n";
            message += newLine;
            message += "Your score : " + score;
            message += newLine;
            message += "Highscore : " + Highscore;
            window.alert(message);
            gamestate = false;
            rocks = [];
            bullets = [];
            shooterposition = {
                x: (columns * 8.3) - shootersize,
                y: (rows * 14.2) - shootersize
            };
            moveleft = false;
            moveright = false;
            rockinterval = 3000;
            rockintervalspeed = 20;
            rockintervalspeed1 = 0;
            timeperbullet = 100;
            timeperbulletspeed = 0;

            clearInterval(shoot);
            clearInterval(drawinterval);
            clearInterval(rock);
            clearInterval(shooterdraw);
            score = 0;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.rect(0, 0, canvas.width, canvas.height);
            context.fillStyle = "rgba(0,0,0,0.1)";
            context.fill();
            context.fillStyle = "white";
            var fontsize = 30 * scale;
            context.font = fontsize + "px Verdana";
            context.fillText("Press SPACE to start", (canvas.width / 2), (canvas.height / 2) - (30 * scale));
            var fontsize = 15 * scale;
            context.font = fontsize + "px Verdana";
            context.fillText("Press SPACE to Pause during game ", (canvas.width / 2), (canvas.height / 2));

        }
    }
}

function gamescore() {
    context.fillStyle = "black";
    var fontsize = 20 * scale;
    context.font = fontsize + "px Verdana";
    context.fillText("Score : " + score, 120 * scale, 40 * scale);
    if (Highscore < score)
        Highscore = score;
    context.fillText("Highscore : " + Highscore, 120 * scale, 70 * scale);

    var fontsize = 30 * scale;
    context.font = fontsize + "px Verdana";
    context.fillStyle = "Purple";
    context.fillText("Ball Blast", 620 * scale, 60 * scale);

}


var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");
var gamestate = false;
var tilesheet = new Image();
tilesheet.src = "shoot.png";




shooterimg = document.getElementById("shooterimg");
var tilesize = 16;

var map = [1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1,
    0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0,
    0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1,
    1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0,
    1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1,
    0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0,
    0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0,
    1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0,
    1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0,
    0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0,
    0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1,
    1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];

var height = document.documentElement.clientHeight - 16;
var width = document.documentElement.clientWidth - 16;
var minsize = height < width ? height : width;
canvas.height = minsize;
canvas.width = minsize;
var columns = minsize / 16;
var rows = minsize / 16;
var scale = minsize / 756;

context.rect(0, 0, canvas.width, canvas.height);
context.fillStyle = "rgba(0,0,0,0.1)";
context.fill();
context.textAlign = "center";
context.fillStyle = "white";
var fontsize = 30 * scale;
context.font = fontsize + "px Verdana";
context.fillText("Press SPACE to start ", (canvas.width / 2), (canvas.height / 2) - (50 * scale));
var fontsize = 15 * scale;
context.font = fontsize + "px Verdana";
context.fillText("Press SPACE to Pause during game ", (canvas.width / 2), (canvas.height / 2));

var shootersize = minsize / 10;
var shooterposition = {
    x: (columns * 8.3) - shootersize,
    y: (rows * 14.2) - shootersize
};
var timepershooter = 20;
var shootermaxSpeed = 5 * scale;

var moveleft = false;
var moveright = false;

let shooter = new Shooter();
var shooterspeed = 0;

var bullets = [];
var bulletradius = 5 * scale;
var bulletspeed = 10 * scale;
var setinterval = 10;
var timeperbullet = 100;
var timeperbulletspeed = 0;
var rocks = [];
var rockinterval = 3000;
var rockintervalspeed = 0;
var rockintervalspeed1 = 20;

var score = 0;
var Highscore = 0;
if (localStorage.getItem("Highscore")) {
    Highscore = parseFloat(localStorage.getItem("Highscore"));
}
document.addEventListener("keydown", event => {
    switch (event.keyCode) {
        case 37:
        case 65:
            moveleft = true;
            break;
        case 39:
        case 68:
            moveright = true;
            break;
        case 32:
            if (gamestate == true) {
                gamestate = false;
                clearInterval(shoot);
                clearInterval(drawinterval);
                clearInterval(rock);
                clearInterval(shooterdraw);
                context.rect(0, 0, canvas.width, canvas.height);
                context.fillStyle = "rgba(0,0,0,0.1)";
                context.fill();
                context.fillStyle = "white";
                var fontsize = 30 * scale;
                context.font = fontsize + "px Verdana";
                context.fillText("Press SPACE to resume ", (canvas.width / 2), (canvas.height / 2) - (30 * scale));

            }
            else if (gamestate == false) {
                gamestate = true;
                gameloop();
            }
            break;
        default: break;
    }
});
document.addEventListener("keyup", event => {
    switch (event.keyCode) {
        case 37:
        case 65:
            moveleft = false;
            break;
        case 39:
        case 68:
            moveright = false;
            break;
        default: break;
    }
});

var shoot, drawinterval, rock, shooterdraw, rocke;

function gameloop() {
    if (gamestate == true) {
        shoot = setInterval(function () {
            if (gamestate == true) {
                bullet = new Bullet();
                timeperbulletspeed++;
                if (timeperbulletspeed >= 300) {
                    timeperbullet -= 2;
                    timeperbulletspeed = 0;
                }
            }
        }, timeperbullet);

        rock = setInterval(function () {
            if (gamestate == true) {
                var rradius = Math.random() * 50 * scale;
                if (rradius < 25 * scale)
                    rradius = 25 * scale;
                var ry = rradius + canvas.height / 8;
                if ((Math.random()) < 0.5)
                    var rx = canvas.width - rradius;
                else
                    rx = rradius;

                var rvx = Math.random() * scale;
                var rvy = 0;
                var rstrength = Math.pow(2, Math.floor(Math.random() * rockintervalspeed1 / 5));
                rocke = new Rock(rradius, rx, ry, rstrength, rvx, rvy);
                rockintervalspeed++;
                rockintervalspeed1++;
                if (rockinterval <= 1000) rockinterval = 1000;
                else if (rockintervalspeed >= 10) {
                    rockinterval -= 100;
                    rockintervalspeed = 0;
                }
            }
        }, rockinterval);

        drawinterval = setInterval(function () {
            if (gamestate == true) {
                background();
                for (i = 0; i < rocks.length; i++) {
                    rocks[i].moverock();
                }
                shooter.draw();
                for (i = 0; i < bullets.length; i++) {
                    bullets[i].movebullet();
                }

                bulletrockcollision();
                gamescore();
                gameover();
            }
        }, setinterval);
    }

}