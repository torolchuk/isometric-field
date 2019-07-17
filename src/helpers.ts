export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const colorList: string[] = ["#ccc", "#eee", "#bbb", "#ddd", "#aaa"];

export function getRandomColor() {
  return colorList[getRandomInt(0, colorList.length - 1)];
}

export function randomLog(chance: number, log: any) {
  if (Math.random() < chance) console.log(log);
}
