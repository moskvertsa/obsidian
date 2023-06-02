const fs = require("fs")
const hre = require("hardhat")
const { ethers } = hre

const network = process.env.HARDHAT_NETWORK || "apothem"

;(async function () {
    try {
        const toll = "30000000000000"

        const [deployer] = await ethers.getSigners()

        // deploy the Obsidian contract
        const Obsidian = await ethers.getContractFactory("Obsidian", deployer)
        const obsidian = await Obsidian.deploy(toll, deployer.address, deployer.address)
        await obsidian.deployed()
        console.log("Obsidian:", obsidian.address)

        // deploy the Registry contract
        const StealthKeyRegistry = await ethers.getContractFactory("StealthKeyRegistry", deployer)
        const registry = await StealthKeyRegistry.deploy()
        await registry.deployed()
        console.log("StealthKeyRegistry: ", registry.address)

        // deploy the Multicall contract
        const Multicall2 = await ethers.getContractFactory("Multicall2", deployer)
        const multicall = await StealthKeyRegistry.deploy()
        await multicall.deployed()
        console.log("Multicall2: ", multicall.address)
    } catch (error) {
        save(error.toString(), "actions", "Error")
        console.log("Deployment Error: ", error.toString())
    }
})()
