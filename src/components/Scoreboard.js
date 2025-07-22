import React, { useContext } from "react";
import { MachineContext } from "../index";

export const Scoreboard = () => {
  const { state } = useContext(MachineContext);
  return (
    <div className="scoreboard">
      {state.matches("active.playerA") && (
        <h2>{state.context.playerAName}'s Turn</h2>
      )}
      {state.matches("active.playerB") && (
        <h2>{state.context.playerBName}'s Turn</h2>
      )}
      {state.matches("done") && (
        <h2>
          {state.context.playerAScore === state.context.playerBScore
            ? "It's a tie!"
            : state.context.playerAScore > state.context.playerBScore
            ? `${state.context.playerAName} wins!`
            : `${state.context.playerBName} wins!`}
        </h2>
      )}
      <div className="scores">
        <div
          className={`score score--player-a ${
            state.matches("active.playerA") && "score--your-turn"
          }`}
        >
          {state.context.playerAName}: {state.context.playerAScore}
        </div>
        <div
          className={`score score--player-b ${
            state.matches("active.playerB") && "score--your-turn"
          }`}
        >
          {state.context.playerBName}: {state.context.playerBScore}
        </div>
      </div>
    </div>
  );
};
