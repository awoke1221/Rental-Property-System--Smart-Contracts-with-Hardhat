const { ethers } = require("hardhat");

async function main() {
  const RentalPropertySystem = await ethers.getContractFactory("RentalPropertySystem");
  const rentalPropertySystem = await RentalPropertySystem.deploy();

  await rentalPropertySystem.deployed();

  console.log("RentalPropertySystem contract deployed to:", rentalPropertySystem.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });