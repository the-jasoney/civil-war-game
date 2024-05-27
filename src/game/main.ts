import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { Game as MainGame } from "./scenes/Game";
import { MainMenu } from "./scenes/MainMenu";
import { CANVAS, Game } from "phaser";
import { Preloader } from "./scenes/Preloader";

const config: Phaser.Types.Core.GameConfig = {
    type: CANVAS,
    width: 1024,
    height: 768,
    backgroundColor: "#028af8",
    scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
};

const StartGame = (canvas: HTMLCanvasElement) => {
    return new Game({ ...config, canvas });
};

export default StartGame;
