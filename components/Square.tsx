"use client";

import { pairs } from "@/utils/pairs";
import { separateArrays } from "@/utils/seperateArrays";
import { useEffect, useState } from "react";
import Switch, { Case, Default } from "./Switch";
import { DataItem } from "@/types";

export default function Square() {
  const [colorsX, setColorsX] = useState<string[]>(Array(20).fill(""));
  const [colorsY, setColorsY] = useState<string[]>(Array(20).fill(""));

  const [cordinate, setCordinate] = useState<(string | number)[][]>([]);

  const [isPlayerOne, setIsPlayerOne] = useState(true);

  const [prevFinalValuesLength, setPrevFinalValuesLength] = useState<number>(0);

  // toggle color of the buttons and add data to colorsX and colorsY
  const toggleColor = (
    index: number,
    colors: string[],
    setter: (value: React.SetStateAction<string[]>) => void,
    direction: string
  ) => {
    setIsPlayerOne((prev) => !prev);

    const newColors = [...colors];
    newColors[index] = isPlayerOne ? "#6CB4EE" : "#BF4F51";
    setter(newColors);

    setCordinate([
      ...cordinate,
      [
        new Date().getTime(),
        direction === "top" ? index + 1 : index,
        direction,
        isPlayerOne ? "#6CB4EE" : "#BF4F51",
      ],
    ]);
  };

  const toggleColorX = (index: number) =>
    toggleColor(index, colorsX, setColorsX, "top");

  const toggleColorY = (index: number) =>
    toggleColor(index, colorsY, setColorsY, "left");

  // Seperate Y and X button Location
  const { topArrays, leftArrays } = separateArrays(cordinate);

  // Get the arrays that have a 4(for x) and 1(for y) diffrence between them
  const xPairs = pairs(topArrays, 4);
  const yPairs = pairs(leftArrays, 1);

  // Final touched for the x and y arrays and set the correct index
  const resultX = xPairs.map((item) => ({
    time: item.time,
    value: item.value - 1,
    color: item.color,
  }));

  const resultY = yPairs
    .filter((item) => ![4, 9, 14].includes(item.value))
    .map((item) => {
      const modifiedValue =
        item.value > 4 && item.value < 9
          ? item.value - 1
          : item.value > 9 && item.value < 14
          ? item.value - 2
          : item.value > 14 && item.value < 19
          ? item.value - 3
          : item.value;

      return {
        time: item.time,
        value: modifiedValue,
        color: item.color,
      };
    });

  const final = [...resultX, ...resultY];

  // Process the final data that have a two values in common and
  // return the color that has a greatest number in the time object
  const processData = () => {
    const groupedData = final.reduce(
      (acc: Map<number, DataItem[]>, item: DataItem) => {
        const value = item.value;
        if (!acc.has(value)) {
          acc.set(value, []);
        }
        acc.get(value)!.push(item);

        return acc;
      },
      new Map()
    );

    const filteredData = [...groupedData.entries()].filter(
      ([_, items]) => items.length === 2
    );

    const filteredResults = filteredData.map(([value, items]) => {
      const sortedItems = items.sort((a, b) => b.time - a.time);
      return { value, color: sortedItems[0].color };
    });

    return filteredResults;
  };

  const finalValues = processData();

  // Calculate scores
  const calculateScore = (color: string) =>
    finalValues.filter((item) => item.color === color)?.length;

  const scores = {
    one: calculateScore("#6CB4EE"),
    two: calculateScore("#BF4F51"),
  };

  // Check the finalValues length between rerenders and if the length changed keeps the current color
  useEffect(() => {
    const player = finalValues.at(-1)?.color == "#6CB4EE";

    if (finalValues.length > prevFinalValuesLength) {
      setIsPlayerOne(player);
      setPrevFinalValuesLength(finalValues.length);
    }
  }, [finalValues, prevFinalValuesLength]);

  const gameEnded = finalValues?.length === 16;

  return (
    <div className="grid grid-cols-5 gap-1 relative">
      {Array.from({ length: 25 }, (_, index) => {
        return (
          <div
            key={index}
            className="flex items-center mb-[94px] relative"
            style={{ filter: gameEnded ? "blur(2px)" : "" }}
          >
            <div className="dots" />

            {(index + 1) % 5 !== 0 && (
              <button
                className={`w-full h-1.5 rounded-full bg-black ml-1 transition-all duration-200 ${
                  isPlayerOne ? "hover:bg-[#6CB4EE]" : "hover:bg-[#BF4F51]"
                }`}
                style={{
                  backgroundColor:
                    index > 4
                      ? index > 9
                        ? index > 13
                          ? index > 18
                            ? colorsX[index - 4]
                            : colorsX[index - 3]
                          : colorsX[index - 2]
                        : colorsX[index - 1]
                      : colorsX[index],
                }}
                disabled={
                  index > 4
                    ? index > 9
                      ? index > 13
                        ? index > 18
                          ? !!colorsX[index - 4]
                          : !!colorsX[index - 3]
                        : !!colorsX[index - 2]
                      : !!colorsX[index - 1]
                    : !!colorsX[index]
                }
                onClick={() => {
                  if (index > 18) {
                    toggleColorX(index - 4);
                  } else if (index > 13) {
                    toggleColorX(index - 3);
                  } else if (index > 9) {
                    toggleColorX(index - 2);
                  } else if (index > 4) {
                    toggleColorX(index - 1);
                  } else {
                    toggleColorX(index);
                  }
                }}
              />
            )}
            {index < 20 && (
              <button
                className={`absolute w-[89px] h-1.5 bg-black rounded-full rotate-90 top-[64px] -left-[34px] transition-all duration-200 ${
                  isPlayerOne ? "hover:bg-[#6CB4EE]" : "hover:bg-[#BF4F51]"
                }`}
                style={{ backgroundColor: colorsY[index] }}
                onClick={() => {
                  toggleColorY(index);
                }}
                disabled={!!colorsY[index]}
              />
            )}
          </div>
        );
      })}
      <div className="grid grid-cols-4 absolute top-0 left-0 justify-items-center w-[455px] h-[490px] -z-10">
        {Array.from({ length: 16 }, (_, index) => (
          <div
            key={index}
            className="h-24 w-20 rounded-xl"
            style={{
              filter: gameEnded ? "blur(2px)" : "",
              background:
                finalValues.find((item) => item!.value === index)?.color || "",
              marginLeft: index === 0 || index % 4 === 0 ? 18 : 0,
              marginTop: index < 4 ? 20 : 0,
              marginRight: (index + 1) % 4 === 0 ? 18 : 0,
            }}
          />
        ))}
      </div>
      <h1 className="w-[460px] mx-auto text-center text-xl">
        <Switch>
          <Case condition={gameEnded && scores.one === scores.two}>
            Blue and Red drew
          </Case>
          <Case condition={gameEnded && scores.one > scores.two}>
            Blue beat Red {scores.one}-{scores.two}
          </Case>
          <Case condition={gameEnded && scores.one < scores.two}>
            Red beat Blue {scores.two}-{scores.one}
          </Case>
          <Default>It&apos;s {isPlayerOne ? "Blue" : "Red"} Turn</Default>
        </Switch>
      </h1>

      <Switch>
        <Case condition={gameEnded}>
          <a
            href="/"
            className="w-[300px] text-xl bg-blue-500 block px-10 py-7 rounded-lg text-center
          absolute top-1/2 left-1/2 -translate-y-[120%] -translate-x-[60%]
        hover:bg-blue-600 transition-all duration-200 hover:text-white shadow-2xl"
          >
            Reset The Game
          </a>
        </Case>
      </Switch>
    </div>
  );
}
