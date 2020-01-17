/**
 * Function that is ran in the Worker context. Can be async.
 * The execution environment has some notable differences:
 * http://nodejs.org/api/worker_threads.html#//apple_ref/cl/Worker
 * 
 * @callback workerFn
 * @param {any} workerData Data received from the parent context
 * @returns {any} Data that will be returned to the parent context, wrapped in a promise. Must adhere to http://nodejs.org/api/worker_threads.html#worker_threads_port_postmessage_value_transferlist
 */

/**
 * Runs a function in a worker thread and return its result.
 * Supported with no flag since Node 12.x
 * 
 * Example:
 * const addOneTo = workerize(async n => n + 1)
 * await addOneTo(1) //=> 2
 * 
 * @function workerize 
 * @param {workerFn} fn Function that will be stringified and ran in the Worker context.
 * @param {object} [workerOptions={}] Used to extend the native Worker constructor's options
 * @returns Workerized function
 * @throws
 */
module.exports = function workerize (fn, workerOptions = {}) {
  const { Worker } = require('worker_threads')
  
  /**
   * Workerized function
   * 
   * @function workerized
   * @param {any} workerData Any data type supported by https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
   * @returns {Promise<any>} Result returned by function workerFn when it exists
   * @async
   */
  return function workerized (...workerData) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(`
        const { workerData, parentPort } = require('worker_threads')
        Promise.resolve((${fn.toString()})(...workerData)).then(returnedData => {
          parentPort.postMessage(returnedData)
        })
      `, { ...workerOptions, eval: true, workerData })
  
      worker.on('message', resolve)
      worker.on('error', reject)
      worker.on('exit', code => {
        if (code === 0) {
          resolve(null)
        } else {
          reject(new Error(`Worker stopped with exit code ${code}`))
        }
      })
    })
  }
}