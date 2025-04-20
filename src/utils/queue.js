/**
 * Simple queue implementation with concurrency control
 */
class Queue {
  constructor(options = {}) {
    this.options = {
      concurrency: 1, // Number of tasks to process concurrently
      autoStart: true, // Whether to start processing automatically
      ...options
    };
    
    this.queue = [];
    this.running = 0;
    this.paused = false;
    this.processingPromise = null;
    this.resolveProcessing = null;
  }
  
  /**
   * Add a task to the queue
   * @param {Function} task - The task function to execute
   * @param {any[]} args - Arguments to pass to the task
   * @returns {Promise<any>} - Promise that resolves with the task result
   */
  add(task, ...args) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        task,
        args,
        resolve,
        reject
      });
      
      if (this.options.autoStart && !this.paused) {
        this.process();
      }
    });
  }
  
  /**
   * Start processing the queue
   */
  process() {
    if (this.paused) {
      return;
    }
    
    while (this.running < this.options.concurrency && this.queue.length > 0) {
      const item = this.queue.shift();
      this.running++;
      
      Promise.resolve()
        .then(() => item.task(...item.args))
        .then(
          result => {
            this.running--;
            item.resolve(result);
            this.process();
          },
          error => {
            this.running--;
            item.reject(error);
            this.process();
          }
        );
    }
    
    // If queue is empty and nothing is running, resolve the processing promise
    if (this.queue.length === 0 && this.running === 0 && this.resolveProcessing) {
      this.resolveProcessing();
      this.resolveProcessing = null;
      this.processingPromise = null;
    }
  }
  
  /**
   * Pause queue processing
   */
  pause() {
    this.paused = true;
  }
  
  /**
   * Resume queue processing
   */
  resume() {
    if (this.paused) {
      this.paused = false;
      this.process();
    }
  }
  
  /**
   * Clear all pending tasks from the queue
   */
  clear() {
    const rejectedItems = [...this.queue];
    this.queue = [];
    
    rejectedItems.forEach(item => {
      item.reject(new Error('Queue was cleared'));
    });
  }
  
  /**
   * Get the number of pending tasks
   * @returns {number} - Number of pending tasks
   */
  size() {
    return this.queue.length;
  }
  
  /**
   * Get the number of tasks currently running
   * @returns {number} - Number of running tasks
   */
  runningCount() {
    return this.running;
  }
  
  /**
   * Wait for all tasks to complete
   * @returns {Promise<void>} - Promise that resolves when all tasks are complete
   */
  onIdle() {
    if (this.queue.length === 0 && this.running === 0) {
      return Promise.resolve();
    }
    
    if (!this.processingPromise) {
      this.processingPromise = new Promise(resolve => {
        this.resolveProcessing = resolve;
      });
    }
    
    return this.processingPromise;
  }
}

export default Queue;