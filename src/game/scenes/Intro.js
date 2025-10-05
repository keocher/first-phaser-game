import {Scene} from "phaser";

export class Intro extends Scene {
    constructor() {
        super("Intro");
    }

    preload() {
        this.load.image("background", "kitchen.png");

    }

    create() {
        
        const titleText = this.add.text(400, -200, "Finn's\nTakeaway", {
            fontSize: '80px',
            fill: '#ffffff',
            fontFamily:'Pistilli',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center',
            
        });

        const gameText = this.add.text(-400, 275, "THE GAME", {
            fontSize: '30px',
            fill: '#ffffffff',
            fontFamily:'Pistilli',
            stroke: '#000000ff',
            strokeThickness: 4,
        });

        gameText.setOrigin(0.5);
        titleText.setOrigin(0.5);

        this.tweens.add({
            targets: titleText,
            y: 150,
            duration: 1000,
            ease: 'Sine.easeOut',
        });
        this.tweens.add({
            targets: gameText,
            x: 400,
            duration: 500,
            ease: 'Sine.easeOut',
            delay: 1000,
        });
        
        const startText = this.add.text(400, 450, "Press Enter to start", {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily:'Pistilli',
            stroke: '#000000',
            strokeThickness: 3,
        });

        this.tweens.add({
            targets: startText,
            alpha: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        startText.setOrigin(0.5);

        this.input.keyboard.on('keydown-ENTER', () => {
           
            this.scene.start('IntroCutscene');
            
        });
    }

}