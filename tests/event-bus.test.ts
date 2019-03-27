import EventBus from '../src/event-bus';

const eventBus = new EventBus();

describe('EventBus', () => {
  it('should register a listener for an event', () => {
    eventBus.on('test.event', () => {});
    expect(Object.keys(eventBus.getEvents())).toHaveLength(1);
  });

  it('should clear all the listeners for an event when `unsubscribe` is called', () => {
    eventBus.on('test.event', () => {});
    eventBus.unsubscribe('test.event');
    expect(Object.keys(eventBus.getEvents())).toHaveLength(0);
  });

  it('should call a listener when an event is emitted', () => {
    eventBus.on('test.event', (data: any) => data);
    expect(eventBus.emit('test.event', 1)).toEqual([1]);
  });

  it('should call all the listeners for an event', () => {
    eventBus.on('test.event', (data: any) => data);
    eventBus.on('test.event', (data: any) => data);
    expect(eventBus.emit('test.event', 1)).toEqual([1, 1]);
  });

  afterEach(() => {
    eventBus.unsubscribe('test.event');
  });
});
