import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Confederate } from '../objects/Confederate';

export class Game extends Scene
{
    background: Phaser.GameObjects.Image;

    graphics: Phaser.GameObjects.Graphics;
    path: Phaser.Curves.Path;

    washingtonCircle: Phaser.GameObjects.Shape;
    washingtonText: Phaser.GameObjects.Text;

    // Number of enemies left to spawn (5 * wave^1.1)
    remainingEnemies: number = 0;

    // Array of all enemies
    enemies: Confederate[] = [];

    // Wave
    wave: number = 1;

    // Speed of enemies (1 + (wave - 1) * 0.1)
    speed: number = 1;

    // Not to be confused with remainingEnemies, this is the number of enemies left on the map
    enemiesLeft: number = 0;


    constructor ()
    {
        super('Game');
    }

    createBackground ()
    {
        this.background = this.add.sprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'map');
        this.background.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);
    }

    createPath ()
    {
        this.graphics = this.add.graphics();
        this.path = this.add.path(96, -32);
        this.path.lineTo(96, 100);
        this.path.lineTo(900, 100);
        this.path.lineTo(900, 668);
        this.path.lineTo(96, 668);
        this.path.lineTo(96, 450);
        this.path.lineTo(450, 450);

        this.graphics.lineStyle(5, 0xffffff, 1);
        this.path.draw(this.graphics);
    }

    createWashington ()
    {
        this.washingtonCircle = this.add.circle(450, 450, 10, 0x00ff00);
        this.washingtonText = this.add.text(460, 450, 'Washington', { font: '16px Arial Black', color: "#000000" });
    }

    createWave()
    {
        this.remainingEnemies = 5 * Math.floor(Math.pow(this.wave, 1.1));
        this.speed = 1 + ((this.wave - 1) * 0.1);
        console.log(`${this.remainingEnemies} ${this.wave}`);

        const onEnemyReachWashington = () => {
            console.log('Enemy reached Washington');
            this.enemiesLeft--;
            if(this.enemiesLeft == 0) {
                EventBus.emit('wave-complete');
            }
        }

        const int = setInterval(() => {
            if(this.remainingEnemies == 0) {
                clearInterval(int);
            }

            this.enemies.push(new Confederate(this, this.path, 96, -32, this.speed, onEnemyReachWashington));
            this.remainingEnemies--;
            this.enemiesLeft++;
        }, 500 / this.speed)
        this.wave++;
    }


    create ()
    {
        this.scale.setGameSize(1024, 768);
        this.createBackground();
        this.createPath();
        this.createWashington();
        this.wave = 1;
        this.enemies = [];
        EventBus.emit('current-scene-ready', this);

        EventBus.on('next-wave', () => this.createWave());
    }
}
