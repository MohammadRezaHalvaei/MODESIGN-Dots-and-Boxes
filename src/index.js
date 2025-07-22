import "./styles.css";
import React from "react";
import ReactDOM from "react-dom";
import { useActor, useInterpret } from "@xstate/react";
import { GameBoard } from "./GameBoard";
import { inspect } from "@xstate/inspect";
import { gameMachine } from "./gameMachine";
import { Header } from "./components/Header";
import { Form } from "./components/Form";
import { Scoreboard } from "./components/Scoreboard";

inspect({
  // options
  // url: 'https://statecharts.io/inspect', // (default)
  iframe: false, // open in new window
});
export const MachineContext = React.createContext({});

function App() {
  const service = useInterpret(gameMachine, { devTools: true });
  const [state] = useActor(service);

  return (
    <MachineContext.Provider value={{ service, state }}>
      <Header />
      <div
        className={`container ${
          state.matches("active.playerA") ? "player-a" : "player-b"
        }`}
      >
        {state.matches("idle") && <Form />}
        {(state.matches("active") || state.matches("done")) && <GameBoard />}
      </div>
    </MachineContext.Provider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
