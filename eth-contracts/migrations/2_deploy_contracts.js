// migrating the appropriate contracts
const Verifier = artifacts.require("TrustedSquareVerifier");
const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

module.exports = async (deployer) => {
  await deployer.deploy(Verifier);
  await deployer.deploy(SolnSquareVerifier, Verifier.address);
};
