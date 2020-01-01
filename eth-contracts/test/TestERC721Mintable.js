var CustomERC721Token = artifacts.require("CustomERC721Token");
var assert = require("chai").assert;

contract("TestERC721Mintable", accounts => {
  const account_one = accounts[0];
  const account_two = accounts[1];

  describe("match erc721 spec", function() {
    beforeEach(async () => {
      this.contract = await CustomERC721Token.new({from: account_one});

      // TODO: mint multiple tokens
      await this.contract.mint(account_one, "1", {from: account_one});
      await this.contract.mint(account_one, "2", {from: account_one});
      await this.contract.mint(account_one, "3", {from: account_one});
      await this.contract.mint(account_two, "4", {from: account_one});
      await this.contract.mint(account_two, "5", {from: account_one});
    });

    it("should return total supply", async () => {
      const totalSupply = await this.contract.totalSupply();
      assert.equal(5, totalSupply);
    });

    it("should get token balance", async () => {
      const balance_one = await this.contract.balanceOf(account_one);
      const balance_two = await this.contract.balanceOf(account_two);
      assert.equal(3, balance_one);
      assert.equal(2, balance_two);
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async () => {
      const tokenURI_one = await this.contract.tokenURI("1");
      const tokenURI_five = await this.contract.tokenURI("5");
      assert.equal(
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1",
        tokenURI_one
      );
      assert.equal(
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/5",
        tokenURI_five
      );
    });

    it("should transfer token from one owner to another", async () => {
      await this.contract.transferFrom(account_one, account_two, "3", {
        from: account_one
      });
      const newOwner = await this.contract.ownerOf("3");
      assert.equal(account_two, newOwner);
    });
  });

  describe("have ownership properties", function() {
    beforeEach(async () => {
      this.contract = await CustomERC721Token.new({from: account_one});
    });

    it("should fail when minting when address is not contract owner", async () => {
      try {
        await this.contract.mint(account_two, "2", {from: account_two});
        throw new Error(`mint should throw error`);
      } catch (e) {
        assert.equal("Sender must be owner", e.reason);
      }
    });

    it("should return contract owner", async () => {
      const owner = await this.contract.owner();
      assert.equal(account_one, owner);
    });
  });
});
