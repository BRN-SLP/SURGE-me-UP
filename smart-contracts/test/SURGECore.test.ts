import { expect } from "chai";
import { ethers } from "hardhat";

describe("SURGECore - Basic Tests", function () {
    let surgeCore: any;
    let factory: any;
    let owner: any;
    let addr1: any;
    let addr2: any;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy Factory
        const SURGEFactory = await ethers.getContractFactory("SURGEFactory");
        factory = await SURGEFactory.deploy(owner.address);

        // Event metadata
        const eventMetadata = {
            name: "Test Event",
            description: "A test SURGE event",
            imageURI: "ipfs://Qm...",
            chainId: 31337,
            tier: 0, // Official
            maxSupply: 100,
            expiryTimestamp: Math.floor(Date.now() / 1000) + 86400,
            mode: 0, // Public
            creator: owner.address
        };

        // Deploy SURGECore
        const SURGECore = await ethers.getContractFactory("SURGECore");
        surgeCore = await SURGECore.deploy(eventMetadata, factory.address);
    });

    describe("Deployment", function () {
        it("Should set correct event metadata", async function () {
            const metadata = await surgeCore.getEventMetadata();
            expect(metadata.name).to.equal("Test Event");
            expect(metadata.maxSupply).to.equal(100);
        });

        it("Should start with zero claimed", async function () {
            expect(await surgeCore.claimed()).to.equal(0);
        });
    });

    describe("Public Claiming", function () {
        it("Should allow public claiming", async function () {
            await surgeCore.connect(addr1).claim(addr1.address);
            expect(await surgeCore.balanceOf(addr1.address)).to.equal(1);
            expect(await surgeCore.claimed()).to.equal(1);
        });

        it("Should prevent double claiming", async function () {
            await surgeCore.connect(addr1).claim(addr1.address);
            await expect(
                surgeCore.connect(addr1).claim(addr1.address)
            ).to.be.reverted;
        });

        it("Should track remaining supply", async function () {
            expect(await surgeCore.getRemainingSupply()).to.equal(100);
            await surgeCore.connect(addr1).claim(addr1.address);
            expect(await surgeCore.getRemainingSupply()).to.equal(99);
        });
    });

    describe("Admin Functions", function () {
        it("Should allow owner to pause", async function () {
            await surgeCore.setPaused(true);
            expect(await surgeCore.isPaused()).to.be.true;
        });

        it("Should prevent claiming when paused", async function () {
            await surgeCore.setPaused(true);
            await expect(
                surgeCore.connect(addr1).claim(addr1.address)
            ).to.be.reverted;
        });
    });

    describe("Bridge Functions", function () {
        beforeEach(async function () {
            await surgeCore.connect(addr1).claim(addr1.address);
            await surgeCore.setBridgeContract(owner.address);
        });

        it("Should lock token for bridge", async function () {
            await surgeCore.lockForBridge(1);
            expect(await surgeCore.lockedForBridge(1)).to.be.true;
        });

        it("Should mint from bridge", async function () {
            await surgeCore.mintFromBridge(addr2.address, 1);
            expect(await surgeCore.balanceOf(addr2.address)).to.equal(1);
            expect(await surgeCore.claimed()).to.equal(2);
        });
    });
});
