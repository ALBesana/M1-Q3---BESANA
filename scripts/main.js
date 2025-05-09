var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let player, enemy, prize, bananaBundle, cursors, scoreText, restartButton;
let jumpCount = 0;
const maxJump = 2;
var platforms;
let gameOver = false;
let score = 0;

//asset loader
function preload() {
    this.load.image('bg', 'assets/images/backgrounds/Brown.png');
    this.load.image('ground', 'assets/images/platforms/ground.png');
    
    this.load.spritesheet('playerIdle', 'assets/images/players/Ninja Frog/Idle (32x32).png', {
        frameWidth: 32,
        frameHeight: 32
    });

    this.load.spritesheet('playerRun', 'assets/images/players/Ninja Frog/Run (32x32).png', {
        frameWidth: 32,
        frameHeight: 32
    });

    this.load.spritesheet('playerJump', 'assets/images/players/Ninja Frog/Jump (32x32).png', {
        frameWidth: 32,
        frameHeight: 32
    });

    this.load.spritesheet('playerFall', 'assets/images/players/Ninja Frog/Fall (32x32).png', {
        frameWidth: 32,
        frameHeight: 32
    });

    this.load.spritesheet('prizeFruit', 'assets/images/items/Fruits/Bananas.png', {
        frameWidth: 32,
        frameHeight: 32
    });
    
}

//function creator
function create() {
    background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'bg').setOrigin(0, 0);

    cursors = this.input.keyboard.createCursorKeys();
    platforms = this.physics.add.staticGroup();

    platforms.create(400, 585, 'ground').setScale(2).refreshBody();
    platforms.create(600, 425, 'ground');
    platforms.create(50, 310, 'ground');
    platforms.create(750, 250, 'ground');

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 10}),
        frameRate: 16,
        repeat: -1
    });

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('playerRun', { start: 0, end: 10 }),
        frameRate: 24,
        repeat: -1
    });

    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('playerJump', { start: 0, end: 0 }),
        frameRate: 1
    });

    this.anims.create({
        key: 'fall',
        frames: this.anims.generateFrameNumbers('playerFall', { start: 0, end: 0 }),
        frameRate: 1
    });

    this.anims.create({
        key: 'prize',
        frames: this.anims.generateFrameNumbers('prizeFruit', { start: 0, end: 16 }),
        frameRate: 32,
        repeat: -1
    });

    player = this.physics.add.sprite(100, 100, 'playerIdle');
    player.play('idle');
    player.setCollideWorldBounds(true);

    bananaBundle = this.physics.add.group({
        key: 'prizeFruit',
        repeat: 19,
        setXY: { x: 50, y: 0, stepX: 40 }
    });

    bananaBundle.children.iterate(function (prize) {
        prize.play('prize');
        prize.setBounce(Phaser.Math.FloatBetween(0.3, 0.8));
        prize.setCollideWorldBounds(true);
        prize.body.setAllowGravity(true);

        prize.y = Phaser.Math.Between(0, 200);
    });

    this.physics.add.collider(player, platforms, () => {
        jumpCount = 0;
    });

    this.physics.add.collider(bananaBundle, platforms);

    scoreText = this.add.text(16, 16, 'Collect 120 points to win! Score: 0', {
        fontSize: '32px',
        fill: '#ffffff'
    });

    this.physics.add.overlap(player, bananaBundle, function (player, prize) {
        prize.disableBody(true, true);
        score += 10;
        scoreText.setText('Collect 120 points to win! Score: ' + score);
    }, null, this);
}

//updates game
function update() {
    background.tilePositionY -= 0.2;
    if (gameOver) return;

    player.setVelocityX(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.flipX = true;
        player.anims.play('run', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.flipX = false;
        player.anims.play('run', true);
    } else {
        player.anims.play('idle', true);
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.up) && jumpCount < maxJump) {
        player.setVelocityY(-450);
        jumpCount++;
    }

    if (player.body.velocity.y < 0) {
        player.anims.play('jump', true);
    } else if (player.body.velocity.y > 0) {
        player.anims.play('fall', true);
    }

    if (score >= 120 && !gameOver) {
        gameOver = true;
        scoreText.setText('🎉 You win! Final Score: ' + score);

        player.setVelocityX(0);
        player.anims.play('idle');
    }
}
