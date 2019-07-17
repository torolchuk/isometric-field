import { StateManager } from "../state-manager";
import {
  MainStateActions,
  INCREASE_SCORE,
  SET_REMAINING_TIME
} from "./main.state-actions";

export interface MainState {
  remainTime: number;
  score: number;
}

export const initialMainState: MainState = {
  remainTime: 0,
  score: 0
};

export class MainStateManager extends StateManager<MainState> {
  public reducer(state: MainState, action: MainStateActions): MainState {
    switch (action.type) {
      case INCREASE_SCORE:
        return Object.assign({}, state, {
          score: state.score + 1
        });
      case SET_REMAINING_TIME:
        return Object.assign({}, state, {
          remainTime: action.payload
        });
      default:
        return state;
    }
  }
}
