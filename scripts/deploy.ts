import { ethers } from "hardhat";

async function main() {
    console.log("Deploying JesseGM contract...");

    const JesseGM = await ethers.getContractFactory("JesseGM");
    const jesseGM = await JesseGM.deploy();

    await jesseGM.waitForDeployment();

    const address = await jesseGM.getAddress();

    console.log("JesseGM deployed to:", address);
    console.log("Update your .env file with:");
    console.log(`NEXT_PUBLIC_JESSE_GM_CONTRACT_ADDRESS=${address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
