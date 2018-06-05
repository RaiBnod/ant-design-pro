import { eventBusUrl } from './urls';

let eb;
export const registerEventBus = (component, address) => {
  // eslint-disable-next-line no-undef
  eb = new vertx.EventBus(eventBusUrl);
  eb.onopen = () => {
    eb.registerHandler(address, event => {
      component.callback(event);
    });
  };
};

export const unregisterEventBus = () => {
  try {
    // Sometimes eb may not be opened and we want to just close it out
    eb.close();
  } catch (e) {
    // Nothing need to do...
  }
};
