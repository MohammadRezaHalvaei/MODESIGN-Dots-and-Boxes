import React, { useContext } from "react";
import { Scoreboard } from "./components/Scoreboard";
import { MachineContext } from "./index";

function Dot({ row, col, curPoint }) {
  return (
    <div
      className="dot"
      aria-hidden
      style={{
        gridColumnStart: col + 1,
        gridRowStart: row + 1,
      }}
    >
      {/* <span>{curPoint}</span> */}
    </div>
  );
}

function Box({ boxData }) {
  const boxIsFilled = boxData.activeLineCount === 4;
  const { state } = useContext(MachineContext);

  return (
    <div
      className={`box  ${boxIsFilled && "box--is-filled"} ${
        boxData.filledBy && `box--${boxData.filledBy}`
      }`}
      aria-hidden
      style={{
        gridColumnStart: boxData.col + 1,
        gridRowStart: boxData.row + 1,
      }}
    >
      {boxData.filledBy === "playerA" && state.context.playerAName}
      {boxData.filledBy === "playerB" && state.context.playerBName}
    </div>
  );
}

function LineButton({ cords, drawn, orientation, col, row }) {
  const { service, state } = useContext(MachineContext);

  const isVertical = orientation === "vertical";
  const currentPlayer = state.value.active;
  return (
    <button
      style={{
        gridColumnStart: col + 1,
        gridRowStart: row + 1,
      }}
      onClick={() => {
        service.send({
          type: "DRAW_LINE",
          cords,
          currentPlayer,
        });
      }}
      className={`line-btn ${isVertical && "line-btn--vertical"} ${
        drawn && "line-btn--drawn"
      }`}
      disabled={drawn}
      title={JSON.stringify(cords)}
    />
  );
}

export function GameBoard({ cols, rows }) {
  const { service, state } = useContext(MachineContext);

  const { rowCount, colCount } = state.context;

  return (
    <div className={`game-board__wrapper `}>
      {(state.matches("active") || state.matches("done")) && <Scoreboard />}

      <div
        className="game-board"
        style={{
          gridTemplateColumns: `repeat(${colCount}, var(--grid-size))`,
          gridTemplateRows: `repeat(${rowCount}, var(--grid-size))`,
        }}
      >
        {state.context.gameBoard.boxes.map((box) => (
          <Box key={`${box.row} ${box.col}`} boxData={box} />
        ))}
        {state.context.gameBoard.lines.map((line) => (
          <LineButton
            key={line.cords}
            col={line.col}
            drawn={line.drawn}
            row={line.row}
            orientation={line.orientation}
            cords={line.cords}
          />
        ))}
        {state.context.gameBoard.dots.map((dot) => (
          <Dot
            key={`${dot.row} ${dot.col}`}
            row={dot.row}
            col={dot.col}
            curPoint={dot.curPoint}
          />
        ))}
      </div>
      <div className="button-group">
        <button
          className="button button--small"
          onClick={() => service.send("END_GAME")}
        >
          End Game
        </button>
        <button
          className="button button--small"
          onClick={() => service.send("CLEAR_BOARD")}
        >
          Clear Board
        </button>
      </div>
    </div>
  );
}
