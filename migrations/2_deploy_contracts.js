const HTLC = artifacts.require("HTLC");

module.exports = function(deployer) {
  deployer.deploy(HTLC);
};