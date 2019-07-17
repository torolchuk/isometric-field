import { randomLog } from "./helpers";

export class Ticker {
  private tickerIncrement: number = 0;
  private startTime: number;
  private callback: Function;
  private callbackScope: Function;

  constructor(
    private tickerPeriod: number,
    private readonly minimumTickPeriod: number
  ) {}

  start() {
    this.startTime = new Date().getTime();
  }

  public reduce(newStartTime: number, reduceValue: number) {
    this.startTime = newStartTime;
    this.tickerIncrement = 0;
    this.tickerPeriod = Math.max(
      this.tickerPeriod - reduceValue,
      this.minimumTickPeriod
    );
  }

  public getTickerPeriod() {
    return this.tickerPeriod;
  }

  tick(newTime: number) {
    const inc = Math.floor((newTime - this.startTime) / this.tickerPeriod);
    if (inc !== this.tickerIncrement && inc > this.tickerIncrement) {
      this.tickerIncrement = inc;
      if (this.callback) this.callback.apply(this.callbackScope);
    }
    const res = (newTime - this.startTime) % this.tickerPeriod;
    return res;
  }

  registerCallback(callback, scope) {
    this.callback = callback;
    this.callbackScope = scope;
  }
}
