// Helper functions to unwrap the leafs
function trim(tree) {
  const node = tree[1]
  if (typeof node === 'string') {
    return node
  } else {
    return [trim(node[0]), trim(node[1])]
  }
}

function encode(input) {
  const codes = {}
  
  // Assign 0 or 1 to leafs
  function assignBin(node, binString = '') {
    binString = binString || ''
    if (typeof node === "string") {
      codes[node] = binString
    } else {
      assignBin(node[0], binString + '0')
      assignBin(node[1], binString + '1')
    }
    return codes
  }
  
  // Get frequency
  const x = {}
  for (const c in input) {
    x[input[c]] = x[input[c]] !== undefined ? x[input[c]] += 1 : 1
  }
  
  // Make tuples and sort frequency
  let tuples = [];
  for (const a in x)
    tuples.push([x[a], a])
  
  tuples.sort((a, b) => {
    return a[0] - b[0]
  })
  
  // Build tree
  while (tuples.length > 1) {
    const lastTwo = tuples.slice(tuples.length - 2,tuples.length)
    const rest = tuples.slice(0, tuples.length - 2)
    const frequency = tuples[0][0] + tuples[1][0]
    tuples = rest
    
    const node = [ frequency, lastTwo ]
    tuples.push(node)
    tuples.sort(((a, b) => {
      return a[0] - b[0]
    }))
  }
  
  const node = trim(tuples[0])
  const bin = assignBin(node)
  
  let out = ''
  
  for (const i in bin) {
    out += bin[i]
  }
  
  return {
    out: out,
    tree: tuples[0]
  }
}

const encoded = encode("AAAAAAAAAAAABBBBBBBCCCDDDDDDDDDDDDDDEEEEEEEEEEEEEEEEEEEEEEEEEEEEFFFFFFFFFGGGGGHHHHHHHHHHHHHHHHHHHHHH")
console.log("Encoded:", encoded.out)

function decode(tree, str) {
  let output = ""
  let node = tree
  for (let i = 0; i < str.length; i++) {
    if(str[i] === '0') {
      node = node[0]
    } else {
      node = node[1]
    }
    
    if (typeof node === 'string') {
      output += node[0]
      node = tree
    }
  }
  
  return output
}

const decoded = decode(trim(encoded.tree), encoded.out)
console.log("Decoded:", decoded)
