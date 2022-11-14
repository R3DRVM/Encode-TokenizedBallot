import { ethers } from "hardhat"
import * as dotenv from "dotenv"
import { TokenizedBallot__factory } from "../typechain-types"
dotenv.config()


const ballotAddress = "0x19b8C35cEB46D3F273d9b87d4AEd183037dA8251" // add the address of our TokenizedBallot from etherscan
const proposalToVoteFor = 3 // index of the proposal to vote for
const votes = 100 // amount of voting power to spend

async function main() {
    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_API })
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
    const signer = wallet.connect(provider);
    const ballotContractFactory = new TokenizedBallot__factory(signer)
    const ballotContract = ballotContractFactory.attach(ballotAddress)

    console.log("Checking your voting power")
    const votingPower = await ballotContract.votingPower(signer.address)
    if (votingPower.eq(0)) {
        console.log("You do not have voting power")
        return
    } else {
        console.log(`You have ${votingPower} votes left`)
    }
    console.log(`Voting for proposal #${proposalToVoteFor}...`)

    const voteTx = await ballotContract.vote(proposalToVoteFor, votes)
    await voteTx.wait()
    console.log("Thank you for voting!")
    const proposalVoteCount = await (await ballotContract.proposals(proposalToVoteFor)).voteCount

    console.log(`Your chosen proposal now has ${proposalVoteCount} votes!`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})