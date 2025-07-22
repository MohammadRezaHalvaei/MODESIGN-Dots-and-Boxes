export const separateArrays = (arr: (string | number)[][]) => {
  const topArrays = arr
    .filter(([, , direction]) => direction === "top")
    .map((arr) => [arr[0], arr[1], arr[3]]);
  const leftArrays = arr
    .filter(([, , direction]) => direction === "left")
    .map((arr) => [arr[0], arr[1], arr[3]]);

  return { topArrays, leftArrays };
};
