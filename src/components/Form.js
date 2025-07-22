import React, { useContext, useState } from "react";
import { MachineContext } from "../index";

export const Form = () => {
  const { state, service } = useContext(MachineContext);
  const [cols, setCols] = useState(state.context.colCount);
  const [rows, setRows] = useState(state.context.rowCount);
  const [playerAName, setPlayerAName] = useState(state.context.playerAName);
  const [playerBName, setPlayerBName] = useState(state.context.playerBName);

  function handleSubmit(e) {
    e.preventDefault();

    service.send({
      type: "SUBMIT_GAME_DATA",
      cols,
      rows,
      playerAName,
      playerBName,
    });
    service.send({ type: "START_GAME" });
  }
  return (
    <form className="form" onSubmit={(e) => handleSubmit(e)}>
      <h2>Start a new game</h2>
      <div className="input-group--horizontal">
        <div className="input-group">
          <label htmlFor="cols">Columns</label>
          <input
            onChange={(e) => setCols(e.target.value)}
            value={cols}
            type="number"
            id="cols"
            min="1"
          />
        </div>

        <div className="input-group">
          <label htmlFor="rows">Rows</label>
          <input
            onChange={(e) => setRows(e.target.value)}
            value={rows}
            type="number"
            id="rows"
            min="1"
          />
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="playerA">Player A</label>
        <input
          onChange={(e) => setPlayerAName(e.target.value)}
          value={playerAName}
          type="text"
          id="playerA"
          placeholder="Enter a name"
        />
      </div>
      <div className="input-group">
        <label htmlFor="playerB">Player B</label>
        <input
          onChange={(e) => setPlayerBName(e.target.value)}
          value={playerBName}
          type="text"
          id="playerB"
          placeholder="Enter a name"
        />
      </div>
      <button className="button" type="submit">
        Start
      </button>
    </form>
  );
};
