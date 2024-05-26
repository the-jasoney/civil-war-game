import { useRef, useState } from 'react';
import { Active, IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import { EventBus } from './game/EventBus';
import './App.css';

function App()
{
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    // Event emitted from the PhaserGame component
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const currentScene = (scene: Phaser.Scene) => {}

    const [nextWaveDisabled, setNextWaveDisabled] = useState(true);

    const [wave, setWave] = useState(1);

    const [currentActive, setCurrentActive] = useState(Active.Question);

    const nextWave = () => {
        EventBus.emit('next-wave')
        setNextWaveDisabled(true);
    }

    EventBus.on('main-scene-ready', () => {
        setNextWaveDisabled(false)
    })

    EventBus.on('wave-complete', () => {
        setNextWaveDisabled(false)
        setWave(wave + 1);
    })

    EventBus.on('question', () => {
        document.getElementById('')
    })

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} currentActive={currentActive} />
            <div id="menu">
                <button className="menu-button" onClick={nextWave} disabled={nextWaveDisabled}>Next Wave</button>

                <button className="menu-button" onClick={() => setCurrentActive(Active.Question)}>Quiz</button>
                <button className="menu-button" onClick={() => setCurrentActive(Active.Game)}>Game</button>
                <p>Wave: {wave}</p>
            </div>
        </div>
    )
}

export default App
