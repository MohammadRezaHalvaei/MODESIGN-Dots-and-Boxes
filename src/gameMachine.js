import { createMachine, assign } from "xstate";

export const gameMachine = createMachine(
  {
    initial: "idle",
    context: {
      playedLines: new Set(),
      colCount: 5,
      rowCount: 4,
      playerAName: "",
      playerBName: "",
      gameBoard: {
        boxes: [],
        lines: [],
        dots: [],
        newBoxFilled: false,
        numberofNewBoxesFilled: 0,
      },
      filledBoxSet: new Set(),
      playerAScore: 0,
      playerBScore: 0,
    },
    states: {
      idle: {
        entry: ["clearBoardData", "resetScore"],
        on: {
          SUBMIT_GAME_DATA: {
            actions: ["updateGameData"],
          },

          START_GAME: {
            target: "active",
            cond: (ctx) => ctx.playerAName && ctx.playerBName,
          },
        },
      },
      active: {
        initial: "playerA",
        entry: ["generateBoard"],
        states: {
          playerA: {
            on: {
              DRAW_LINE: {
                target: "checkPlay",
                actions: ["recordLine"],
              },
            },
          },
          checkPlay: {
            always: [
              {
                target: "playerA",
                cond: "playerAFilledABox",
                actions: "incrementPlayerAScore",
              },
              {
                target: "playerB",
                cond: "playerBFilledABox",
                actions: "incrementPlayerBScore",
              },
              {
                target: "playerB",
                cond: "playerADrewALine",
              },
              {
                target: "playerA",
                cond: "playerBDrewALine",
              },
            ],
          },
          playerB: {
            on: {
              DRAW_LINE: {
                target: "checkPlay",
                actions: ["recordLine"],
              },
            },
          },
        },
        always: {
          cond: "isBoardCompete",
          target: "done",
        },
        on: {
          END_GAME: {
            target: "idle",
            actions: ["clearBoardData", "resetScore"],
          },
          CLEAR_BOARD: {
            target: "active",
            actions: ["resetScore"],
          },
        },
      },
      done: {
        after: {
          50000: {
            target: "idle",
          },
        },
        on: {
          END_GAME: {
            target: "idle",
            actions: ["clearBoardData", "resetScore"],
          },
          CLEAR_BOARD: {
            target: "active",
            actions: ["resetScore"],
          },
        },
      },
    },
  },

  {
    actions: {
      updateGameData: assign({
        playerAName: (ctx, e) => e.playerAName,
        playerBName: (ctx, e) => e.playerBName,
        colCount: (ctx, e) => e.cols,
        rowCount: (ctx, e) => e.rows,
      }),
      generateBoard: assign({
        gameBoard: (ctx) => {
          const rows = +ctx.rowCount;
          const cols = +ctx.colCount;

          let lines = [];
          let dots = [];
          let boxes = [];

          let curPoint = 0;

          function makeLine(orientation, curPoint, col, row) {
            const cords =
              orientation === "horizontal"
                ? `${curPoint},${curPoint + 1}`
                : `${curPoint},${curPoint + cols + 1}`;

            lines.push({
              orientation,
              cords,
              active: false,
              curPoint,
              col,
              row,
            });
          }

          function makeDot(col, row) {
            dots.push({ col, row, curPoint });
          }

          function makeBox(curPoint, cols, rows, col, row, activeLineCount) {
            boxes.push({
              col,
              cols,
              curPoint,
              lines: [
                `${curPoint + cols + 1},${curPoint + cols + 2}`, // bottom
                `${curPoint},${curPoint + cols + 1}`, // left
                `${curPoint + 1},${curPoint + cols + 2}`, // right
                `${curPoint},${curPoint + 1}`, // top
              ],
              activeLineCount: 0,
              row,
              rows,
            });
          }

          for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
              makeLine("vertical", curPoint, col, row);
              makeLine("horizontal", curPoint, col, row);
              makeDot(col, row, curPoint);

              makeBox(curPoint, cols, rows, col, row);
              curPoint++;
              if (col === cols - 1) {
                makeLine("vertical", curPoint, col + 1, row);
                makeDot(col + 1, row);
              }
            }
            if (row === rows - 1) {
              for (let col = 0; col < cols; col++) {
                curPoint++;
                makeLine("horizontal", curPoint, col, row + 1);
                makeDot(col, row + 1);
                if (col === cols - 1) {
                  curPoint++;
                  makeDot(col + 1, row + 1);
                }
              }
            }
            curPoint++;
          }

          return { lines, boxes, dots };
        },
      }),

      clearBoardData: assign({
        lines: [],
        boxes: [],
        dots: [],
      }),

      resetScore: assign({
        playerAScore: 0,
        playerBScore: 0,
      }),

      recordLine: assign({
        gameBoard: (ctx, e) => {
          let { lines, boxes, dots, newBoxFilled, numberofNewBoxesFilled } =
            ctx.gameBoard;

          const filledBoxSetLengthBefore = ctx.filledBoxSet.size;

          lines.forEach((line) => {
            if (line.cords === e.cords) {
              line.drawn = true;
            }
          });
          boxes.forEach((box) => {
            if (box.lines.includes(e.cords)) {
              console.log(
                e.cords,
                box.curPoint,
                "before increment",
                box.activeLineCount
              );
              box.activeLineCount = box.activeLineCount + 1;
              console.log(
                e.cords,
                box.curPoint,
                "after increment",
                box.activeLineCount
              );
            }
            if (box.activeLineCount === 4) {
              console.log("we got 4 active lines");
              box.isFilled = true;
              if (!box.filledBy) box.filledBy = e.currentPlayer;
              ctx.filledBoxSet.add(box.lines);
            }
          });

          if (ctx.filledBoxSet.size > filledBoxSetLengthBefore) {
            newBoxFilled = true;
            numberofNewBoxesFilled =
              ctx.filledBoxSet.size - filledBoxSetLengthBefore;
          } else {
            newBoxFilled = false;
            numberofNewBoxesFilled = 0;
          }
          return { lines, boxes, dots, newBoxFilled, numberofNewBoxesFilled };
        },
      }),
      incrementPlayerAScore: assign({
        playerAScore: (ctx, e) =>
          ctx.playerAScore + ctx.gameBoard.numberofNewBoxesFilled,
      }),
      incrementPlayerBScore: assign({
        playerBScore: (ctx, e) =>
          ctx.playerBScore + ctx.gameBoard.numberofNewBoxesFilled,
      }),
    },
    guards: {
      isBoardCompete: (ctx) =>
        ctx.playerAScore + ctx.playerBScore === ctx.gameBoard.boxes.length,
      drawnLineDidNotFillBox: (ctx, e) => {
        return !ctx.gameBoard.newBoxFilled;
      },

      playerAFilledABox: (ctx, e, meta) => {
        const playedBy = meta.state.transitions[0].source.key;
        if (playedBy === "playerA" && ctx.gameBoard.newBoxFilled) return true;
      },

      playerBFilledABox: (ctx, e, meta) => {
        const playedBy = meta.state.transitions[0].source.key;
        if (playedBy === "playerB" && ctx.gameBoard.newBoxFilled) return true;
      },

      playerADrewALine: (ctx, e, meta) => {
        const playedBy = meta.state.transitions[0].source.key;
        if (playedBy === "playerA") return true;
      },

      playerBDrewALine: (ctx, e, meta) => {
        const playedBy = meta.state.transitions[0].source.key;
        if (playedBy === "playerB") return true;
      },
    },
  }
);
