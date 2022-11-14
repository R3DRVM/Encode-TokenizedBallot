import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config()


async function main() {
    console.log("Deploying MyToken");
    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_API });
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
    const signer = wallet.connect(provider);

    const tokenContractFactory = new MyToken__factory(signer);

    const tokenContract = await tokenContractFactory.deploy();
    await tokenContract.deployed();
    console.log(`Token contract was successfully deployed at ${tokenContract.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});