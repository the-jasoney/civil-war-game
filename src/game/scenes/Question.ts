import { Scene } from "phaser";

// A Scene for asking multiple choice questions
export class Question extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    questionText: Phaser.GameObjects.Text;

    constructor() {
        super('Question');
    }
}
