var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Speed = 180;
const JumpVel = 500;
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
var MainGame;
(function (MainGame) {
    class InitPhaser {
        static initGame() {
            const Config = {
                type: Phaser.AUTO,
                width: 800,
                height: 600,
                physics: {
                    default: "arcade",
                    arcade: {
                        gravity: { y: 300 },
                        debug: false,
                    },
                },
                scene: [MainScene],
            };
            this.gameRef = new Phaser.Game(Config);
        }
    }
    MainGame.InitPhaser = InitPhaser;
    class MainScene extends Phaser.Scene {
        constructor() {
            super({ key: "MainScene" });
            this.starCount = 0;
            this.bombCount = 0;
        }
        preload() {
            this.load.image("sky", "./assets/sky.png");
            this.load.image("ground", "./assets/platform.png");
            this.load.image("star", "./assets/star.png");
            this.load.image("bomb", "./assets/bomb.png");
            this.load.spritesheet("dude", "./assets/dude.png", {
                frameWidth: 32,
                frameHeight: 48,
            });
        }
        create() {
            this.add.image(400, 300, "sky");
            this.scoreText = this.add.text(16, 16, "", {
                fontSize: "40px",
                fill: "#000",
            });
            this.platforms = this.physics.add.staticGroup();
            this.player = this.physics.add.sprite(100, 450, "dude");
            this.cursors = this.input.keyboard.createCursorKeys();
            this.stars = this.physics.add.group({
                key: "star",
                repeat: 11,
                setXY: { x: 12, y: 0, stepX: 70 },
            });
            this.bombs = this.physics.add.group();
            this.physics.add.collider(this.bombs, this.platforms);
            this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
            this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
            this.platforms.create(600, 400, "ground");
            this.platforms.create(50, 250, "ground");
            this.platforms.create(750, 220, "ground");
            this.player.setBounce(0.2);
            this.player.setCollideWorldBounds(true);
            this.stars.children.iterate(function (child) {
                child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
            });
            const body = this.player.body;
            body.setGravityY(300);
            this.physics.add.collider(this.player, this.platforms);
            this.physics.add.collider(this.stars, this.platforms);
            this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
            this.anims.create({
                key: "left",
                frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
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
                frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
                frameRate: 10,
                repeat: -1,
            });
            this.createBombs(this.player);
        }
        update() {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-Speed);
                this.player.anims.play("left", true);
            }
            else if (this.cursors.right.isDown) {
                this.player.setVelocityX(Speed);
                this.player.anims.play("right", true);
            }
            else {
                this.player.setVelocityX(0);
                this.player.anims.play("turn");
            }
            if (this.cursors.up.isDown && this.player.body.touching.down) {
                this.player.setVelocityY(-JumpVel);
            }
            let score = Math.max(0, this.starCount * 2 - this.bombCount * 8);
            this.scoreText.setText("Score: " + score);
        }
        collectStar(player, star) {
            star.disableBody(true, true);
            this.starCount++;
            if (this.stars.countActive(true) === 0) {
                this.stars.children.iterate(function (child) {
                    child.enableBody(true, child.x, 0, true, true);
                });
                this.createBombs(player);
            }
            (() => __awaiter(this, void 0, void 0, function* () {
                player.setTint(0xffff00);
                yield delay(700);
                player.clearTint();
            }))();
        }
        createBombs(player) {
            for (let i = 0; i < 2; i++) {
                var x = player.x < 400
                    ? Phaser.Math.Between(400, 800)
                    : Phaser.Math.Between(0, 400);
                var bomb = this.bombs.create(x, 16, "bomb");
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            }
        }
        hitBomb(player, bomb) {
            bomb.disableBody(true, true);
            this.bombCount++;
            (() => __awaiter(this, void 0, void 0, function* () {
                player.setTint(0xff0000);
                yield delay(1500);
                player.clearTint();
            }))();
        }
    }
    MainGame.MainScene = MainScene;
})(MainGame || (MainGame = {}));
window.onload = () => {
    MainGame.InitPhaser.initGame();
};
//# sourceMappingURL=main.js.map