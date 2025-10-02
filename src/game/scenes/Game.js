import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  preload() {
    this.load.image("sky", "assets/kitchen.png");
    this.load.image("ground", "assets/floor.png");
    this.load.image("star", "assets/burger.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.image("bin", "assets/bin.png");
    this.load.spritesheet("dude", "assets/finn2.png", {
      frameWidth: 64,
      frameHeight: 91,
    });
  }

  collectStar(player, star) {
    star.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText("Score: " + this.score);
    if (this.score >= this.nextBinThreshold) {
       this.spawnBin(1);
       this.nextBinThreshold += 100;
    }
  }

  binStar(bin, star) {
    star.disableBody(true, true);
    this.score -= 20;
    this.scoreText.setText("Score: " + this.score);
    const binX = Phaser.Math.Between(50, 750);
    const binY = 520;

    bin.setPosition(binX, binY);
    bin.refreshBody();
    
  }

  hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("turn");
    this.gameOver = true;
  }

  bounceStar(star, platform) {
    // Add a slight random horizontal velocity on bounce
  
    star.setGravityY(Phaser.Math.Between(-100, 200));
  }

  spawnStar() {
    const activeStars = this.stars.countActive(true);
    if (activeStars >= this.stars.maxSize) {
      return;
    }

    const spawnX = Phaser.Math.Between(40, 760);
    const star = this.stars.get(spawnX, 0, "star");

    if (!star) {
      return;
    }

    star.setActive(true);
    star.setVisible(true);
    star.body.enable = true;
    star.body.reset(spawnX, 0);
    star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    star.setGravityY(0);
    star.setVelocity(0, 0);
  }

  spawnBin(count) {
    for (let i = 0; i < count; i += 1) {
        const x = Phaser.Math.Between(50, 750);
        const bin = this.bins.create(x, 520, "bin");
        bin.refreshBody();
    }
}

  
  

  create() {
    this.score = 0;

    const bg = this.add.image(0, 0, "sky").setOrigin(0, 0);
    bg.setDisplaySize(800, 600);

    // Declare platforms as a property of the scene
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, "ground").refreshBody();

    //player
    this.player = this.physics.add.sprite(100, 450, "dude");
    this.player.setScale(0.8).refreshBody();

    //collisions
    this.physics.add.collider(this.player, this.platforms);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    //bin
    const binX = Phaser.Math.Between(50, 750);
    const binY = 520;
    this.binMultiplier =1;
    this.bins = this.physics.add.staticGroup();
    this.spawnBin(this.binMultiplier);

    //movement
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.stars = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 12,
    });

    for (let i = 0; i < 4; i += 1) {
      this.spawnStar();
    }

    this.time.addEvent({
      delay: 800,
      callback: this.spawnStar,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(this.stars, this.platforms, this.bounceStar, null, this);
   
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    this.physics.add.overlap(
      this.bins,
      this.stars,
      this.binStar,
      null,
      this
    );

   
    
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontFamily: "Pistilli",
      fontSize: "32px",
      fill: "#000",
    });


     this.nextBinThreshold = 100;
     



  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
}
