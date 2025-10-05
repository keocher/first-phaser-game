import { Game as MainGame } from './scenes/Game';
import {Intro } from './scenes/Intro';
import {IntroCutscene } from './scenes/IntroCutscene';
import { AUTO, Scale,Game, Physics } from 'phaser';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: AUTO,
    width: 800,
    height: 600,
     physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    parent: 'game-container',
   
    backgroundColor: '#735e82',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    scene: [
        Intro, IntroCutscene, MainGame
    ]
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
}

export default StartGame;
