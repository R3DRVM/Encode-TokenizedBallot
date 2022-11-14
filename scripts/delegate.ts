import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { MyToken__factory } from "../typechain-types";
dotenv.config()
//MyToken Address
const contractAddress = "0x350e655770e02e05B4f22169A7b8d3d5aAd6B46a";
async function main() {
    console.log("Checking voting power");
    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_API });
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
    const signer = wallet.connect(provider);
    const tokenContractFactory = new MyToken__factory(signer);
    const tokenContract = tokenContractFactory.attach(contractAddress);
    const votePower = await tokenContract.getVotes(signer.address);
    console.log(`Your current voting power: ${votePower}`);
    console.log("Delegating votes");
    const mintTx = await tokenContract.delegate(signer.address);
    await mintTx.wait();

    const newVotePower = await tokenContract.getVotes(signer.address);
    console.log(`Your new voting power: ${newVotePower}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})