const deleteAllComma = (num: any) => {
  if (num === undefined) {return ""; }
  const stringNum = String(num).replace(" ", "");
  const stringList = stringNum.split(".");
  stringList[0] = stringList[0].replace(",", "");
  if (stringList.length > 1) {
    const wordList = stringList[1].split("");
    for (let i = wordList.length - 1 ; i > 0 ; i--) {
      if (wordList[i] === "0") {
        wordList.splice(i, 1);
      } else {break; }
    }
    stringList[1] = wordList.join("");
  }
  return (stringList.join("."));
};

const checkNumIsError = (num: any, canBeNegative: boolean = true) => {
  if (!canBeNegative && parseFloat(num) <= 0) {return true; }
  if (isNaN(num) || num === "NaN") {return true; }
  if (String(num).length === 0) {return false; }
  return (String(parseFloat(num)) !== String(num));
};

const NumberFormatter = (value: number) => {
  if (value === Infinity || isNaN(value)) {return value; }
  const allArray = String(value).split(".");
  const stringArray = String(allArray[0]).split("");
  let count = 0;
  for (let i = stringArray.length - 1; i > -1; i--) {
    count++;
    if ((count) % 3 === 0 && i !== 0) {
      if (stringArray[i - 1] !== "-") {
        stringArray[i - 1] += ",";
      }
    }
  }
  return (allArray.length === 1) ? stringArray.join("") : stringArray.join("") + "." + allArray[1];
};

export default {NumberFormatter, deleteAllComma, checkNumIsError};
