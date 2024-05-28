export class Confederate extends Phaser.GameObjects.PathFollower {
    public path: Phaser.Curves.Path;
    public collisionFlag: boolean = false;
    public dead: boolean = false;

    private onCompleteCallback: () => void = () => {
        console.log("oncomplete");
    };

    constructor(
        scene: Phaser.Scene,
        path: Phaser.Curves.Path,
        x: number,
        y: number,
        speed: number,
        onCompleteCallback: () => void
    ) {
        super(scene, path, x, y, "confederate");
        console.log("confederate created");
        this.scale = 0.2;
        this.path = path;
        this.onCompleteCallback = onCompleteCallback;

        // Add this game object to the existing scene
        scene.add.existing(this);

        this.startFollow({
            duration: 7500 / speed,
            onComplete: () => {
                this.onComplete();
            },
        });
    }

    destroy() {
        console.log("confederate destroyed")
        super.destroy()
    }

    onComplete() {
        this.onCompleteCallback();
    }
}
