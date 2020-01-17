const workerize = require('.')

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