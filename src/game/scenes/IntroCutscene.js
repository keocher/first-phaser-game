import { Scene } from "phaser";

export class IntroCutscene extends Scene {
  constructor() {
    super("IntroCutscene");
  }

  preload() {
    this.load.image("bg", "assets/kitchen.png");
    this.load.image("ground", "assets/floor.png");
    this.load.image("burger", "assets/burger.png");
    this.load.image("bin", "assets/bin.png");
    this.load.image("whiteboard", "assets/whiteboard.png");
    this.load.image("moldyBurger", "assets/moldyBurger.png");
    this.load.image("chipperJesusBust", "assets/chipperJesusBust2.png");
    this.load.spritesheet("chipperJesus", "assets/chipperJesus.png", {
      frameWidth: 38,
      frameHeight: 60,
    });
    this.load.spritesheet("finn", "assets/finn3.png", {
      frameWidth: 38,
      frameHeight: 60,
    });
  }

  create() {
    this.score = 0.0;

    const bg = this.add.image(0, 0, "bg").setOrigin(0, 0);
    bg.setDisplaySize(800, 600);

    this.whiteboard = this.add.image(50, 50, "whiteboard").setOrigin(0, 0);
    this.whiteboard.setScale(0.8);

    // Declare platforms as a property of the scene
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, "ground").refreshBody();
    this.platforms.create(-400, 568, "ground");

    //player
    this.player = this.physics.add.sprite(-150, 480, "finn");
    this.player.setScale(1.2).refreshBody();

    this.jesus = this.physics.add.sprite(600, 480, "chipperJesus");
    this.jesus.setScale(1.2).refreshBody();
    //collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.jesus, this.platforms);
    this.jesus.setCollideWorldBounds(true);
    this.jesus.setBounce(0.2);
    this.player.setBounce(0.2);

    //movement
    this.anims.create({
      key: "finn-left",
      frames: this.anims.generateFrameNumbers("finn", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "finn-turn",
      frames: [{ key: "finn", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "finn-right",
      frames: this.anims.generateFrameNumbers("finn", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "finn-stop",
      frames: [{ key: "finn", frame: 0 }],
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "jesus-left",
      frames: this.anims.generateFrameNumbers("chipperJesus", {
        start: 5,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "jesus-turn",
      frames: [{ key: "chipperJesus", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "jesus-right",
      frames: this.anims.generateFrameNumbers("chipperJesus", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "jesus-stop",
      frames: [{ key: "chipperJesus", frame: 0 }],
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "jesus-stop-left",
      frames: [{ key: "chipperJesus", frame: 5 }],
      frameRate: 20,
    });

    // Start walking animation and move to Jesus
   

    const x = 60, y = 420, w = 680, h = 160, r = 18;
     const panel = this.add.graphics();
    panel.fillStyle(0x0b0b1e, 0.85);
    panel.fillRoundedRect(x, y, w, h, r);
    panel.lineStyle(4, 0xffffff, 1);
    panel.strokeRoundedRect(x, y, w, h, r);
    const portrait = this.add
      .image(100, 450, "chipperJesusBust")
      .setOrigin(0,0)
      .setDisplaySize(96, 96);
    const nameText = this.add.text(x+290, 435, "Chipper Jesus",
        {
            fontFamily: "Pistilli",
            fontSize: "20px",
            color: "#ffffff",
            wordWrap: { width: 430, useAdvancedWrap: true}
        }
    );

    const text = this.add.text(x+290, y+50, "You think you're the chipper messiah, eh? Earn me €500 to prove me your worth! Also be wary of the moldy burgers, they'll kill ya on the spot....\nPress Enter to continue",{
        fontFamily: "Arial",
        fontSize: "15px",
        color: "#ffffff",
        wordWrap: { width: 350, useAdvancedWrap: true},
        lineSpacing: 7,
    });

    this.dialogueBox = this.add.container(0, 0, [panel, portrait, nameText, text]);
    this.dialogueBox.setVisible(false);

     this.ready = false;
    this.player.play("finn-right"); // start walking right away
    this.tweens.add({
      targets: this.player,
      x: this.jesus.x - 80, // stop just in front of Chipper
      duration: 5000, // tweak for slower/faster walk
      ease: "Linear",
      onComplete: () => {
        this.player.play("finn-stop"); // stop animation when reaching Jesus;
        this.jesus.play("jesus-stop-left");
        this.time.delayedCall(1000, () => {
            this.dialogueBox.setVisible(true);
            this.ready = true;
        });
      },
    });

  
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start("Game");
        });
    
    


    


    
  }
}
