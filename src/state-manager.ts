export interface Action {
  type: string;
}

export interface ActionWithPayload<ActionType> extends Action {
  payload: ActionType;
}

export abstract class StateManager<StateInterface> {
  private state: StateInterface;

  constructor(private initalState: StateInterface) {
    this.state = initalState;
  }

  abstract reducer(state: StateInterface, action: Action): StateInterface;

  public dispatch(action: Action) {
    const newState: StateInterface = this.reducer(this.state, action);
    if (newState !== this.state) {
      this.state = Object.freeze(newState);
    }
  }

  public getState() {
    return this.state;
  }
}
