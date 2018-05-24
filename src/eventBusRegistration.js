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
  eb.close();
};
