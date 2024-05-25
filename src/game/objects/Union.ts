export class Union extends Phaser.GameObjects.PathFollower {
    path: Phaser.Curves.Path;
    private onCompleteCallback: () => void = () => {console.log('oncomplete')};

    constructor(scene: Phaser.Scene, path: Phaser.Curves.Path, x: number, y: number, speed: number, strength: number, onCompleteCallback: () => void) {
        super(scene, path, x, y, 'union');
        this.scale = 0.2
        this.path = path;
        this.onCompleteCallback = onCompleteCallback;

        // Add this game object to the existing scene
        scene.add.existing(this);

        this.startFollow(
            {
                duration: 7500 / (speed),
                onComplete: () => {this.onComplete()}
            }
        );
    }

    onComplete() {
        this.onCompleteCallback();
    }

}
