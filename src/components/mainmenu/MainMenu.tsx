import './MainMenu.scss'

interface MainMenuProps {
    hidden: boolean,
    startGame: () => void,
}

export function MainMenu({ hidden, startGame }: MainMenuProps) {
    return (
        <div className="main-menu" hidden={hidden} >
            <img src="/assets/logo.png"></img>
            <div className="text">
                <h1>Rules</h1>
                <p>
                    You are given 30 seconds to answer as much questions as possible. For every question, you get troops, shown on the right after the Union flag.
                    <br />
                    <br />
                    Every 30 seconds, the confederates will attack, with increasing numbers every wave (confederate numbers shown after confederate flag on the right, and waves shown after the trophy).
                    <br />
                    <br />
                    If the confederate soldiers make it to Washington, D.C., they decrease the health, shown as the top red bar. If the health reaches 0, the game is over.
                </p>
            </div>

            <button className="start" onClick={startGame} >
                Start Game
            </button>
        </div>

    )
}
