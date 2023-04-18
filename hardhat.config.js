require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80']
    },
    // localganache: {
    //   url: process.env.PROVIDER_URL,
    //   accounts: [process.env.PRIVATE_KEY]
    // },
  },
  libraries: {
    // Liên kết thư viện SafeMath với tên alias là "SafeMath"
    SafeMath: {
      // Đường dẫn tới tệp tin SafeMath.sol trong thư mục contracts
      path: "./libraries/SafeMath.sol",
    },
  },
};
