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
    this.load.image("whiteboard", "assets/whiteboard.png");
    this.load.image("moldyBurger", "assets/moldyBurger.png");
    this.load.spritesheet("dude", "assets/finn2.png", {
      frameWidth: 64,
      frameHeight: 91,
    });
  }

  collectStar(player, star) {
    star.disableBody(true, true);
    this.score += 10.0;
    if (this.score < 0) {
      this.scoreText.setText("Today's Loss:\n€" + this.score.toFixed(2));
    } else {
      this.scoreText.setText("Today's Profit:\n€" + this.score.toFixed(2));
    }
    if (this.score >= this.nextBinThreshold) {
      this.spawnBin(1);
      this.nextBinThreshold += 100;
    }
    if(this.score >= 50){
      this.spawnMoldyBurger();
}
  }

  binStar(bin, star) {
    star.disableBody(true, true);
    this.score -= 15.0;
    if (this.score < 0) {
      this.scoreText.setText("Today's Loss:\n€" + this.score.toFixed(2));
    } else {
      this.scoreText.setText("Today's Profit:\n€" + this.score.toFixed(2));
    }
    const binX = Phaser.Math.Between(50, 750);
    const binY = 520;

    bin.setPosition(binX, binY);
    bin.refreshBody();
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

  avoidMold(moldyBurger, platform) {
    moldyBurger.disableBody(true, true);
  }

  hitMold(player, moldyBurger) {
     this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("turn");
    this.gameOver = true;
  }

  spawnMoldyBurger() {
    const activeMold = this.moldyBurgers.countActive(true);
    if (activeMold >= this.moldyBurgers.maxSize) {
      return;
    }

    const spawnX = Phaser.Math.Between(40, 760);
    const moldyBurger = this.moldyBurgers.get(spawnX, 0, "moldyBurger");

    if (!this.moldyBurgers) {
      return;
    }

    moldyBurger.setActive(true);
    moldyBurger.setVisible(true);
    moldyBurger.body.enable = true;
    moldyBurger.body.reset(spawnX, 0);
    moldyBurger.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    moldyBurger.setGravityY(0);
    moldyBurger.setVelocity(0, 0);

}
    

  create() {
    this.score = 0.0;

    const bg = this.add.image(0, 0, "sky").setOrigin(0, 0);
    bg.setDisplaySize(800, 600);

    this.whiteboard = this.add.image(50, 50, "whiteboard").setOrigin(0, 0);
    this.whiteboard.setScale(0.8)
    this.scoreText = this.add.text(110, 80, "Today's Profit:\n€0.00", {
      fontFamily: "Permanent Marker",
      fontSize: "28px",
      fill: "#000",
        align: "center",
        lineSpacing: 10,
        
    }).setOrigin(0,0);

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
    this.binMultiplier = 1;
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

    //moldyBurger
    this.moldyBurgers = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 2,
    });

    
    

    this.physics.add.collider(
      this.moldyBurgers,
      this.platforms,
      this.avoidMold,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.moldyBurgers,
      this.hitMold,
      null,
      this
    );
    this.time.addEvent({
      delay: 800,
      callback: this.spawnStar,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(
      this.stars,
      this.platforms,
      this.bounceStar,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    this.physics.add.overlap(this.bins, this.stars, this.binStar, null, this);

    

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
