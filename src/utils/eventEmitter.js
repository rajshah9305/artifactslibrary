/**
 * Simple event emitter implementation
 */
class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    this.events[event].push(listener);
    return this;
  }
  
  once(event, listener) {
    const onceWrapper = (...args) => {
      listener(...args);
      this.off(event, onceWrapper);
    };
    
    onceWrapper.listener = listener;
    this.on(event, onceWrapper);
    return this;
  }
  
  off(event, listener) {
    if (!this.events[event]) {
      return this;
    }
    
    const index = this.events[event].findIndex(
      (l) => l === listener || (l.listener && l.listener === listener)
    );
    
    if (index !== -1) {
      this.events[event].splice(index, 1);
    }
    
    if (this.events[event].length === 0) {
      delete this.events[event];
    }
    
    return this;
  }
  
  emit(event, ...args) {
    if (!this.events[event]) {
      return false;
    }
    
    this.events[event].forEach((listener) => {
      listener(...args);
    });
    
    return true;
  }
  
  listenerCount(event) {
    return this.events[event] ? this.events[event].length : 0;
  }
  
  eventNames() {
    return Object.keys(this.events);
  }
}

export default EventEmitter;