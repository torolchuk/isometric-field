import { Action, ActionWithPayload } from "../state-manager";

export const INCREASE_SCORE = "Increase score";
export class IncreaseScoreAction implements Action {
  readonly type = INCREASE_SCORE;
}

export const SET_REMAINING_TIME = "SET_REMAINING_TIME";
export class SetRemainingTimeAction implements ActionWithPayload<number> {
  readonly type = SET_REMAINING_TIME;
  constructor(public payload: number) {}
}

export type MainStateActions = IncreaseScoreAction | SetRemainingTimeAction;
