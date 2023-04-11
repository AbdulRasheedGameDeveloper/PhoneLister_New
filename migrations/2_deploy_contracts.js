var MobileAdder = artifacts.require("./MobileAdder.sol");

module.exports = function(deployer) {
  deployer.deploy(MobileAdder);
};