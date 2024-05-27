import { useEffect, useRef, useState } from "react";
import { Active, IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import { EventBus } from "./game/EventBus";
import "./App.css";
import { Progress } from "flowbite-react";

function App() {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    // Event emitted from the PhaserGame component
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const currentScene = (scene: Phaser.Scene) => {};

    const [nextWaveDisabled, setNextWaveDisabled] = useState(true);

    const [wave, setWave] = useState(1);

    const [questionsCorrect, setQuestionsCorrect] = useState(0);

    const [currentActive, setCurrentActive] = useState(Active.Question);

    const [timerActive, setTimerActive] = useState(true);

    const [timeLeft, setTimeLeft] = useState(100);

    useEffect(() => {
        if (timerActive) {
            let int = setInterval(() => {
                setTimeLeft((prevTimeLeft) => {
                    if (prevTimeLeft <= 1) {
                        nextWave();
                        clearInterval(int);
                        return 100;
                    }
                    return prevTimeLeft - 0.1;
                });
            }, 30);
            return () => clearInterval(int);
        }
    }, [timerActive]);

    const nextWave = () => {
        EventBus.emit("next-wave", questionsCorrect);
        setTimerActive(false);
        setTimeLeft(100);
        setCurrentActive(Active.Game);
        setNextWaveDisabled(true);
    };

    EventBus.on("main-scene-ready", () => {
        setNextWaveDisabled(false);
    });

    EventBus.on("wave-complete", () => {
        setNextWaveDisabled(false);
        setWave(wave + 1);

        setTimeout(() => {
            setTimerActive(true);
            setCurrentActive(Active.Question);
        }, 3000);
    });

    EventBus.on("question", () => {
        document.getElementById("");
    });

    useEffect(() => console.log("questionsCorrect", questionsCorrect), [questionsCorrect])

    return (
        <>
            <Progress
                style={{ width: "100%" }}
                progress={timeLeft}
                color={timerActive ? "teal" : "gray"}
                size="lg"
            />
            <div id="app">
                <PhaserGame
                    ref={phaserRef}
                    currentActiveScene={currentScene}
                    currentActive={currentActive}
                    setQuestionsCorrect={setQuestionsCorrect}
                />
                <div id="menu">
                    <button
                        className="menu-button"
                        onClick={nextWave}
                        disabled={nextWaveDisabled}
                    >
                        Next Wave
                    </button>
                    <p>Wave: {wave}</p>
                    <p>Confederate Troops: {wave * 5000}</p>
                </div>
            </div>
        </>
    );
}

export default App;
