export default class EventBus {
  private events: any = {};

  /**
   * Add a listener to a given event.
   *
   * @param event The name of the event
   * @param listener A listener
   */
  public on(event: string, listener: (data: any) => void) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(listener);

    return this;
  }

  /**
   * Fire all the listeners for a given events.
   *
   * @param event The name of the event
   * @param data The argument to pass to the listeners
   */
  public emit(event: string, data: any = {}) {
    if (!this.events[event]) {
      return;
    }

    return this.events[event].map((listener: (data: any) => void) => listener(data));
  }

  /**
   * Remove the listeners for an event.
   *
   * @param event The name of the event
   */
  public unsubscribe(event: string) {
    delete this.events[event];
  }

  /**
   * Returns the list of events.
   *
   */
  public getEvents() {
    return this.events;
  }
}
