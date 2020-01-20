# 👷‍♀️ node-inline-worker [![npm](https://img.shields.io/npm/v/node-inline-worker.svg?style=flat)](https://www.npmjs.org/package/node-inline-worker)

> Moves a node module into a Node.js Worker, automatically reflecting exported functions as asynchronous proxies.

[Dev.to Article](https://dev.to/christophemarois/seamless-workers-for-node-js-213)

You might already be familiar with the [Workerize](https://github.com/developit/workerize) npm package, which is the web counterpart for this module. The feature list and API are the same:

* Bundles a tiny, purpose-built RPC implementation into your node app
* If exported module methods are already async, signature is unchanged
* Supports synchronous and asynchronous worker functions
* Works beautifully with async/await

Available for Node `>=12` without runtime flags. Uses node's [Worker Threads](http://nodejs.org/api/worker_threads.html#//apple_ref/cl/Worker).

## Install

```bash
npm install --save node-inline-worker
```

## Usage

Pass a function to be executed in the Worker thread

```javascript
const workerize = require('node-inline-worker')

const add = workerize(async (a, b) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return a + b
})

async function main () {
  // Pre-curried use
  console.log('3 + 9 = ', await add(3, 9)) // Logs after 1 second
  console.log('1 + 2 = ', await add(1, 2)) // Logs after 1 second

  // Direct invocation
  const sequence = await workerize(function fib (n) {
    return n <= 1 ? n : fib(n - 1) + fib(n - 2)
  })(10)

  console.log(sequence) // logs `55`
}

main()
```

### License

[MIT License](https://oss.ninja/mit/developit/) © [Christophe Marois](https://www.github.com/christophemarois)
