export const pairs = (array: (string | number)[][], diffrence: number) =>
  array.flatMap((value, index, arr) => {
    let maxTimeColor: string;

    const validPairs = arr.slice(0, index).map((secondValue) => {
      const time = +value[0];
      const secondTime = +secondValue[0];

      const numericValue = +value[1];
      const numericSecondValue = +secondValue[1];

      if (Math.abs(numericValue - numericSecondValue) === diffrence) {
        const minValue = Math.min(numericValue, numericSecondValue);
        const maxTime = Math.max(time, secondTime);

        if (maxTime === time) {
          maxTimeColor = String(value[2]);
        }

        return { time: maxTime, value: minValue, color: maxTimeColor };
      }
      return null;
    });

    return validPairs.filter((pair) => pair !== null) as DataItem[];
  });
