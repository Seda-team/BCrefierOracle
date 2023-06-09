pragma circom 2.1.2;

include "../node_modules/circomlib/circuits/mimc.circom";
include "../node_modules/circomlib/circuits/switcher.circom";
include "./mimc.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";

/*
 * IfThenElse sets `out` to `true_value` if `condition` is 1 and `out` to
 * `false_value` if `condition` is 0.
 *
 * It enforces that `condition` is 0 or 1.
 *
 */

/*
 * SelectiveSwitch takes two data inputs (`in0`, `in1`) and produces two ouputs.
 * If the "select" (`s`) input is 1, then it inverts the order of the inputs
 * in the ouput. If `s` is 0, then it preserves the order.
 *
 * It enforces that `s` is 0 or 1.
 */
template SelectiveSwitch() {
    signal input in0;
    signal input in1;
    signal input s;
    signal output out0;
    signal output out1;

    component Switch = Switcher(); 

    s *(s- 1) === 0;

    Switch.sel <== s;
    Switch.L <== in0;
    Switch.R <== in1;

    out0 <== Switch.outL;
    out1 <== Switch.outR; 
    // TODO
}

/*
 * Verifies the presence of H(`nullifier`, `nonce`) in the tree of depth
 * `depth`, summarized by `digest`.
 * This presence is witnessed by a Merle proof provided as
 * the additional inputs `sibling` and `direction`, 
 * which have the following meaning:
 *   sibling[i]: the sibling of the node on the path to this coin
 *               at the i'th level from the bottom.
 *   direction[i]: "0" or "1" indicating whether that sibling is on the left.
 *       The "sibling" hashes correspond directly to the siblings in the
 *       SparseMerkleTree path.
 *       The "direction" keys the boolean directions from the SparseMerkleTree
 *       path, casted to string-represented integers ("0" or "1").
 */

 // template MerkleProcess(depth) {
//     signal input leaf_hash;
//     signal input sibling[depth];
//     signal input direction[depth];

//     for(var i = 0; i < depth; ++i) {

//     }
template Node () {
    signal input leaf;
    signal output out;

    out <== leaf;
}

template Spend(depth) {
    signal input digest;
    signal input amount;
    signal input balance;
    signal input liquidition;
    signal input nonce;
    signal input op1;
    signal input op2;
    signal input op3;
    signal input sibling[depth];
    signal input direction[depth];

    component Mimc = Mimc2();

    Mimc.in0 <== amount;
    Mimc.in1 <== balance;

    component Mimc1 = Mimc2();

    Mimc1.in0 <== Mimc.out;
    Mimc1.in1 <== liquidition;

    component Mimc2 = Mimc2();

    Mimc2.in0 <== Mimc1.out;
    Mimc2.in1 <== op1;
    
    component Mimc3 = Mimc2();

    Mimc3.in0 <== Mimc2.out;
    Mimc3.in1 <== op2;

    component Mimc4 = Mimc2();

    Mimc4.in0 <== Mimc3.out;
    Mimc4.in1 <== op3;

    component Mimc5 = Mimc2();

    Mimc5.in0 <== Mimc4.out;
    Mimc5.in1 <== nonce;


    component hashNode[depth+1];
    component selectiveSwitch[depth];
    hashNode[0] = Node();

    hashNode[0].leaf <== Mimc5.out;

     component Mimcupdate[depth];

    for (var i = 0;i < depth; i++)
    {
        Mimcupdate[i]  = Mimc2();
        selectiveSwitch[i] = SelectiveSwitch();
        hashNode[i+1] = Node();
        //hashNode[i+1].leaf <== nonce;
        selectiveSwitch[i].in0 <== hashNode[i].out;
        selectiveSwitch[i].in1 <== sibling[i];         
        selectiveSwitch[i].s <== direction[i];
    //      component selectiveSwitch = SelectiveSwitch();

    //      selectiveSwitch.in0 <== hashNode[i].out;
    //      selectiveSwitch.in1 <== sibling[i];         
    //      selectiveSwitch.s <== direction[i];

         Mimcupdate[i].in0 <==  selectiveSwitch[i].out0;
         Mimcupdate[i].in1 <==  selectiveSwitch[i].out1;
        // log(selectiveSwitch[i].out0);
         //log(selectiveSwitch[i].out1);
         //log(Mimcupdate.out);
        hashNode[i+1].leaf <== Mimcupdate[i].out;
        log(hashNode[i+1].out);
    }

    hashNode[depth].out === digest;
    //TODO
}

component main {public [digest,amount,balance,liquidition,op1,op2,op3]} = Spend(4);
