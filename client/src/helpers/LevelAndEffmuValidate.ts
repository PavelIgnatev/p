export const getLvlAndEffmu = (str: string) => {
  if (str[0] === "-") {
    return [str.slice(2), str.slice(0, 2)];
  }

  let sliceIndex = 0;

  for (let i = 0; i < str.length; i++) {
    if (isNaN(Number(str[i]))) {
      break;
    }
    sliceIndex = i;
  }

  return [str.slice(sliceIndex + 1), str.slice(0, sliceIndex + 1)];
};

export const LevelAndEffmuValidate = (lvl: string, lvl2: string) => {
  if (
    (lvl[0] === "-" && lvl[lvl.length - 1] === "l") ||
    (lvl2[0] === "-" && lvl2[lvl2.length - 1] === "l")
  ) {
    return true;
  }

  const [effmu, level] = getLvlAndEffmu(lvl);
  const [effmu2, level2] = getLvlAndEffmu(lvl2);
  console.log(lvl, "-", effmu, level);
  console.log(lvl2, "--", effmu2, level2);

  if (level === level2 && effmu2 === "all") {
    return true;
  }
  if (level === level2 && effmu === "all") {
    return true;
  }
  if (level === "all" && effmu2 === effmu) {
    return true;
  }
  if (level2 === "all" && effmu2 === effmu) {
    return true;
  }
  if (level === level2 && effmu === effmu2) {
    return true;
  }
  if (level === "-1" && effmu === "all") {
    return true;
  }
  if (level === "-1" && effmu2 === effmu) {
    return true;
  }

  return false;
};
