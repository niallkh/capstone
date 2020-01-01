// Test if a new solution can be added for contract - SolnSquareVerifier
const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
const Verifier = artifacts.require("Verifier");
const assert = require("chai").assert;

const proof = require("../../zokrates/code/square/proof.json");

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
contract("SolnSquareVerifier", async accounts => {
  describe("test verification", function() {
    beforeEach(async () => {
      const verifier = await Verifier.new({from: accounts[0]});
      this.contract = await SolnSquareVerifier.new(verifier.address, {
        from: accounts[0]
      });
    });

    it("mintToken", async () => {
      await this.contract.mint(
        proof.proof.a,
        proof.proof.b,
        proof.proof.c,
        proof.inputs,
        accounts[0],
        "0",
        {from: accounts[0]}
      );

      const totalSupply = await this.contract.totalSupply();
      assert.equal(1, totalSupply);
    });

    it("mintToken with the same proof should error", async () => {
      await this.contract.mint(
        proof.proof.a,
        proof.proof.b,
        proof.proof.c,
        proof.inputs,
        accounts[0],
        "0",
        {from: accounts[0]}
      );
      try {
        const result = await this.contract.mint(
          proof.proof.a,
          proof.proof.b,
          proof.proof.c,
          proof.inputs,
          accounts[1],
          "1",
          {from: accounts[1]}
        );
        throw new Error(`Mint with the same proof should throw error`);
      } catch (e) {
        assert.equal("This solution is already registered", e.reason);
      }

      const totalSupply = await this.contract.totalSupply();
      assert.equal(1, totalSupply);
    });
  });
});
