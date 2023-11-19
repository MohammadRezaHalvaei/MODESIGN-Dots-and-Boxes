export const pairs = (
  array: (string | number)[][],
  diffrence: number,
  isPlayerOne: boolean
) =>
  array.flatMap((value, index, arr) => {
    let maxTimeColor: string = isPlayerOne ? "#BF4F51" : "#6CB4EE";

    const validPairs = arr.slice(0, index).map((otherValue) => {
      const time =
        typeof value[0] === "string" ? parseInt(value[0], 10) : value[0];
      const otherTime =
        typeof otherValue[0] === "string"
          ? parseInt(otherValue[0], 10)
          : otherValue[0];

      const numericValue =
        typeof value[1] === "string" ? parseInt(value[1], 10) : value[1];
      const numericOtherValue =
        typeof otherValue[1] === "string"
          ? parseInt(otherValue[1], 10)
          : otherValue[1];

      if (Math.abs(numericValue - numericOtherValue) === diffrence) {
        const minValue = Math.min(numericValue, numericOtherValue);
        const maxTime = Math.max(time, otherTime);

        if (maxTime === time) {
          // Update maxTimeColor when the current time is greater
          maxTimeColor = String(value[2]); // Convert to string
        }

        return { time: maxTime, value: minValue, color: maxTimeColor };
      }
      return null;
    });

    return validPairs.filter((pair) => pair !== null) as {
      time: number;
      value: number;
      color: string;
    }[];
  });
