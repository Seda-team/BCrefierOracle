//const fs = require("fs");
const doc = `Usage:
  compute_spend_inputs.js [options] <depth> <transcript> <rank>
  compute_spend_inputs.js -h | --help

Options:
  -o <file>     name of the created witness file [default: input.json]
  -h --help     Print this message

Arguments:
   <depth>       The number of non-root layers in the merkle tree.
   <transcript>  The file containing transcript of all coins.
                 A file with a line for each coin.
                 Each coin is either a single number (the coin
                 itself) or it can be two space-separated number, which are, in
                 order, the rank and the nonce for the coin.

                 Example:

                     1839475893
                     1984375234 2983475298
                     3489725451 9834572345
                     3452345234

   <rank>   The rank to print a witness of validity for.
                 Must be present in the transcript.
`

/*
 * Computes inputs to the Spend circuit.
 *
 * Inputs:
 *   depth: the depth of the merkle tree being used.
 *   transcript: A list of all coins added to the tree.
 *               Each item is an array.
 *               If the array hash one element, then that element is the coin.
 *               Otherwise the array will have two elements, which are, in order:
 *                 the rank and
 *                 the nonce
 *               This list will contain **no** duplicate ranks or coins.
 *   rank: The rank to print inputs to validity verifier for.
 *              This rank will be one of the ranks in the transcript.
 *
 * Return:
 *   an object of the form:
 * {
 *   "digest"            : ...,
 *   "rank"         : ...,
 *   "nonce"             : ...,
 *   "sibling[0]"        : ...,
 *   "sibling[1]"        : ...,
 *      ...
 *   "sibling[depth-1]"  : ...,
 *   "direction[0]"      : ...,
 *   "direction[1]"      : ...,
 *      ...
 *   "direction[depth-1]": ...,
 * }
 * where each ... is a string-represented field element (number)
 * notes about each:
 *   "digest": the digest for the whole tree after the transcript is
 *                  applied.
 *   "rank": the rank for the coin being spent.
 *   "nonce": the nonce for that coin
 *   "sibling[i]": the sibling of the node on the path to this coin
 *                 at the i'th level from the bottom.
 *   "direction[i]": "0" or "1" indicating whether that sibling is on the left.
 *       The "sibling" hashes correspond directly to the siblings in the
 *       SparseMerkleTree path.
 *       The "direction" keys the boolean directions from the SparseMerkleTree
 *       path, casted to string-represented integers ("0" or "1").
 */
function computeInput(depth,transcript,amount, balance, liquidition,op1,op2,op3, nonce) {
    // TODO
    var sparse_merkle_tree = new SparseMerkleTree(depth);

    var wanted_coin_and_nonce = null;

    const commitment1 = mimc2(amount,balance);
    const commitment2 = mimc2(commitment1,liquidition);
    const commitment3 = mimc2(commitment2,op1);
    const commitment4 = mimc2(commitment3,op2);
    const commitment5 = mimc2(commitment4,op3);
    const commitment6 = mimc2(commitment5,nonce);
  
    for (var i = 0;i < transcript.length; i++) {
      const coin =  transcript[i] ; 
      sparse_merkle_tree.insert(coin);
      if(transcript[i] === commitment6) wanted_coin_and_nonce = [coin , nonce];
    }

    if ( wanted_coin_and_nonce === null) return null;
    const merkle_proof = sparse_merkle_tree.path(wanted_coin_and_nonce[0]);
    
    var snark_input = {
      "digest": sparse_merkle_tree.digest,
      "amount": amount,
      "balance": balance,
      "liquidition": liquidition,
      "nonce": nonce,
      "op1": op1,
      "op2": op2,
      "op3": op3,
  };
  
  snark_input["sibling"] = [];
  snark_input["direction"] = [];
  for(var i = 0; i < depth; i++) {
      snark_input["sibling"].push(merkle_proof[i][0]);
  const direction = merkle_proof[i][1] ? "1" : "0";
  snark_input["direction"].push(direction);
  }
  return snark_input;
}

