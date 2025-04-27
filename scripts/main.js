var config = {
    type: Phaser.AUTO,
    width: 1690,
    height: 910,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// variable initializers
let game = new Phaser.Game(config);
let player, enemy, prize, cursors;
let gameOver = false;
let score = 0;
let scoreText;
let restartButton;

// asset preloader
function preload ()
{
    this.load.image('background', 'assets/background.jpg');
    this.load.image('player', 'assets/player.jpg');
    this.load.image('enemy', 'assets/enemy.jpg');
    this.load.image('platform', 'assets/platform.jpg');
    this.load.image('prize', 'assets/prize.png');

}

function create ()
{
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    background.scale = 0.7;
    // this.add.image(-420, -270, 'background').setOrigin(0, 0);
    // image.setScale(1690, 910);

    const platform = this.physics.add.staticGroup();
    platform.create(850, 1000, 'platform').setScale(2.35).refreshBody();
    
    // assets added + size changer + physics added
    player = this.physics.add.image(200, 0, 'player').setScale(1.1).refreshBody();
    player.setBounce(0.3);
    player.setCollideWorldBounds(true);

    enemy = this.physics.add.image(700, 0, 'enemy').setScale(0.3).refreshBody();
    enemy.setBounce(0.3);
    enemy.setCollideWorldBounds(true);

    prize = this.physics.add.image(1400, 0, 'prize').setScale(0.2).refreshBody();
    prize.setBounce(0.3);
    prize.setCollideWorldBounds(true);

    this.physics.add.collider(player, platform);
    this.physics.add.collider(enemy, platform);
    this.physics.add.collider(prize, platform);
    this.physics.add.collider(player, enemy, hitEnemy, null, this);

    this.physics.add.overlap(player, prize, collectPrize, null, this);

    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#ffffff'
    });

}

function update ()
{
    if (gameOver) return;

    // player movement
    player.setVelocityX(0); 

    if (cursors.left.isDown) {
        player.setVelocityX(-600);
        player.setFlipX(false);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(600);
        player.setFlipX(true);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-700);
    }
}

// win condition when touching prize
function collectPrize (player, prize)
{
    prize.disableBody(true, true);
    score += 100;
    updateScoreDisplay(); // updates score
    gameOver = true;
    window.alert("You win! Enjoy your La-La-La-Lava Chi-Chi-Chi-Chichen dinner!");
    freezeGame();
    showRestartButton();
}

// lose condition when touching enemy
function hitEnemy(player, enemy) {
    gameOver = true;
    score -= 100;
    updateScoreDisplay();
    window.alert("You got hit by CHICKEN JOCKEY and DIED! Game Over.");
    freezeGame();
    showRestartButton();
}

// stops game when winning or losing 
function freezeGame() {
    // stops all player and enemy movement
    player.setVelocity(0);
    enemy.setVelocity(0);
}

function updateScoreDisplay() {
    scoreText.setText('Score: ' + score);
}

// creates the restart button (I googled this)
function showRestartButton() {
    restartButton = document.createElement("button");
    restartButton.innerHTML = "Restart Game";
    restartButton.style.position = "absolute";
    restartButton.style.top = "50%";
    restartButton.style.left = "50%";
    restartButton.style.transform = "translate(-50%, -50%)";
    restartButton.style.fontSize = "20px";
    restartButton.style.padding = "10px 20px";
    restartButton.onclick = function() {
        location.reload(); // reload the page to restart the game
    };
    document.body.appendChild(restartButton);
}