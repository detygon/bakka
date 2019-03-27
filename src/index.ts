import { STATE_UPDATED } from './constants';
import EventBus from './event-bus';

interface IBakkaOptions {
  strict: boolean;
  debugging?: boolean;
}

export default class Bakka {
  private eventBus: EventBus = new EventBus();
  private isTransactionSafe = false;
  private options: IBakkaOptions;
  private actions: any;
  private mutations: any;
  private state: any;

  constructor({ initialState = {}, actions = {}, mutations = {} }, options?: IBakkaOptions) {
    this.actions = actions;
    this.mutations = mutations;
    this.options = options || { strict: false, debugging: true };
    this.state = this.initializeState(initialState);
  }

  /**
   * Call an action.
   *
   * @param action The name of the action
   * @param payload The payload of the action
   */
  public dispatch(action: string, payload?: any): any {
    if (!this.actions[action]) {
      this.handleError(`Action: ${action} does not exist.`);

      return false;
    }

    const self = this;

    return this.actions[action](
      {
        commit: this.commit.bind(this),
        dispatch: this.dispatch.bind(this),
        state: self.state,
      },
      payload,
    );
  }

  /**
   * Call a mutation.
   *
   * @param mutation The name of the mutation
   * @param payload The payload to pass to the mutation
   */
  public commit(mutation: string, payload?: any): any {
    if (!this.mutations[mutation]) {
      this.handleError(`Mutation: ${mutation} does not exists.`);

      return false;
    }

    this.isTransactionSafe = true;

    return this.mutations[mutation](this.state, payload);
  }

  /**
   * Returns the event bus to allow using events.
   */
  public get $events() {
    return this.eventBus;
  }

  /**
   * Add subscriber for state changes.
   *
   * @param listener
   */
  public subscribe(listener: () => void) {
    this.$events.on(STATE_UPDATED, listener);

    return this;
  }

  /**
   * Set up the state as a proxy to monitor state changes.
   *
   * @param state The initial state
   */
  private initializeState(initialState: any) {
    return new Proxy(initialState, {
      set: (state: any, key: string, value: any) => {
        if (!this.isTransactionSafe) {
          this.handleError(`Trying to update ${String(key)} in non-safe mode.`);
        }

        state[key] = value;
        this.eventBus.emit(STATE_UPDATED, state);
        this.isTransactionSafe = false;

        return true;
      },
    });
  }

  /**
   * Decide what action to do based on the options.
   *
   * @param errorMessage The error message
   */
  private handleError(errorMessage: string) {
    if (this.options.strict) {
      throw new Error(errorMessage);
    } else if (this.options.debugging) {
      // tslint:disable-next-line
      console.warn(errorMessage);
    }
  }
}
