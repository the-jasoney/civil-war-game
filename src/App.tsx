import "./App.scss";

import { Active, IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import { EventBus } from "./game/EventBus";

import { useEffect, useRef, useState } from "react";
import { Progress } from "flowbite-react";
import { FaTrophy } from "react-icons/fa";
import { IoMdStopwatch } from "react-icons/io";

function App() {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    // Event emitted from the PhaserGame component
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const currentScene = () => {};

    const [wave, setWave] = useState(1);

    const [questionsCorrect, setQuestionsCorrect] = useState(0);

    const [currentActive, setCurrentActive] = useState(Active.MainMenu);

    const [timerActive, setTimerActive] = useState(false);

    const [timeLeft, setTimeLeft] = useState(100);

    const [gameIsStarted, setGameIsStarted] = useState(false);

    const nextWave = () => {
        EventBus.emit("next-wave", 2 * questionsCorrect);
        setTimerActive(false);
        setTimeLeft(100);
        setCurrentActive(Active.Game);
    };

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
    }, [timerActive, questionsCorrect]);

    useEffect(() => {
        if (gameIsStarted) {
            setTimerActive(true);
            setCurrentActive(Active.Question);
        }
    }, [gameIsStarted]);

    EventBus.on("wave-complete", () => {
        setTimeout(() => {
            setTimerActive(true);
            setCurrentActive(Active.Question);
            setQuestionsCorrect(0);
            setWave(wave + 1);
        }, 3000);
    });

    EventBus.on("question", () => {
        document.getElementById("");
    });

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
                    startGame={() => setGameIsStarted(true)}
                    currentActiveScene={currentScene}
                    currentActive={currentActive}
                    setQuestionsCorrect={setQuestionsCorrect}
                />
                <div id="menu">
                    <div className="item">
                        <div className="left">
                            <IoMdStopwatch width="25px" height="25px" />
                        </div>
                        <div className="center">|</div>
                        <div className="right">
                            {Math.floor(timeLeft * 0.3)}s
                        </div>
                    </div>
                    <div className="item">
                        <div className="left">
                            <FaTrophy width="25px" height="25px" />
                        </div>
                        <div className="center">|</div>
                        <div className="right">{wave}</div>
                    </div>
                    <div className="item">
                        <div className="left">
                            <img
                                width="22px"
                                src="./assets/confederate.png"
                            ></img>
                        </div>
                        <div className="center">|</div>
                        <div className="right">
                            {5 * Math.floor(Math.pow(wave, 1.1)) * 5000}
                        </div>
                    </div>
                    <div className="item">
                        <div className="left">
                            <img width="22px" src="./assets/union.png"></img>
                        </div>
                        <div className="center">|</div>
                        <div className="right">
                            {25000 + 2 * questionsCorrect * 5000}
                        </div>
                    </div>
                    <p>v0.1 by Jason Wen, 2024</p>
                </div>
            </div>
        </>
    );
}

export default App;
