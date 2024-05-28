import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import StartGame from "./main";
import { EventBus } from "./EventBus";
import { Question } from "../components/question/Question";
import { MainMenu } from "../components/mainmenu/MainMenu";

export interface IRefPhaserGame {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

export enum Active {
    Game,
    Question,
    MainMenu,
}

interface IProps {
    currentActiveScene?: (scene_instance: Phaser.Scene) => void;
    currentActive: Active;
    setQuestionsCorrect: React.Dispatch<React.SetStateAction<number>>;
    startGame: () => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(
    function PhaserGame(
        { currentActiveScene, currentActive, setQuestionsCorrect, startGame },
        ref
    ) {
        const game = useRef<Phaser.Game | null>(null!);

        useLayoutEffect(() => {
            if (game.current === null) {
                game.current = StartGame(
                    document.getElementById("game-canvas") as HTMLCanvasElement
                );

                if (typeof ref === "function") {
                    ref({ game: game.current, scene: null });
                } else if (ref) {
                    ref.current = { game: game.current, scene: null };
                }
            }

            return () => {
                if (game.current) {
                    game.current.destroy(true);
                    if (game.current !== null) {
                        game.current = null;
                    }
                }
            };
        }, [ref]);

        useEffect(() => {
            EventBus.on(
                "current-scene-ready",
                (scene_instance: Phaser.Scene) => {
                    if (
                        currentActiveScene &&
                        typeof currentActiveScene === "function"
                    ) {
                        currentActiveScene(scene_instance);
                    }

                    if (typeof ref === "function") {
                        ref({ game: game.current, scene: scene_instance });
                    } else if (ref) {
                        ref.current = {
                            game: game.current,
                            scene: scene_instance,
                        };
                    }
                }
            );
            return () => {
                EventBus.removeListener("current-scene-ready");
            };
        }, [currentActiveScene, ref]);

        return (
            <div id="game-container">
                <canvas id="game-canvas" hidden={currentActive != Active.Game}></canvas>
                {currentActive == Active.Question && (
                    <Question
                        hidden={currentActive != Active.Question}
                        setQuestionsCorrect={setQuestionsCorrect}
                    />
                )}
                {currentActive == Active.MainMenu && (
                    <MainMenu
                        startGame={startGame}
                        hidden={currentActive != Active.MainMenu}
                    />
                )}
            </div>
        );
    }
);
