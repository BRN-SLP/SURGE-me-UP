import { run, network } from "hardhat";

// Identity contract addresses per network
const IDENTITY_CONTRACTS: Record<string, { anchor: string; registry: string; badges: string }> = {
    base: {
        anchor: "0x60ECC66e77663083d417F9b3Eb946B4b7fc99F6a",
        registry: "0x7Be26Cc7823eBf117E55079f8fB83833452514a2",
        badges: "0xC7B3F56a1b1C5b9E2ad2fb4115a5e728F19F8032",
    },
    optimism: {
        anchor: "0x02D70E8160eeC113d1069C822b3110C53c623f7E",
        registry: "0xc82E129CcF75e6262DCe6F6420908d74235D4188",
        badges: "0x43516e86C58c26C00964e38f38ae79DCcb4d9E07",
    },
    celo: {
        anchor: "0x4FC7c1F5f49a04E1372507daB984a3D87D73A6a9",
        registry: "0x170fb7943d29299D6941029e5dF6C42281C90e47",
        badges: "0xEeB8fB619dD0cf0e185e590955Ba98487d6A3547",
    },
    zora: {
        anchor: "0x02254bB1883A397e0b8229B47302E7ED1c52F9E5",
        registry: "0xa48Fab6213fED674230D581b4649968a50AD19E7",
        badges: "0xF2585C1947C6D318Db8a053003158a6b40a7F180",
    },
    ink: {
        anchor: "0x98865Bc0219D9E002329c37994A0d7d475bAB4d7",
        registry: "0x02254bB1883A397e0b8229B47302E7ED1c52F9E5",
        badges: "0xa48Fab6213fED674230D581b4649968a50AD19E7",
    },
    lisk: {
        anchor: "0x98865Bc0219D9E002329c37994A0d7d475bAB4d7",
        registry: "0x02254bB1883A397e0b8229B47302E7ED1c52F9E5",
        badges: "0xa48Fab6213fED674230D581b4649968a50AD19E7",
    },
    unichain: {
        anchor: "0x98865Bc0219D9E002329c37994A0d7d475bAB4d7",
        registry: "0x02254bB1883A397e0b8229B47302E7ED1c52F9E5",
        badges: "0xa48Fab6213fED674230D581b4649968a50AD19E7",
    },
    soneium: {
        anchor: "0x98865Bc0219D9E002329c37994A0d7d475bAB4d7",
        registry: "0x02254bB1883A397e0b8229B47302E7ED1c52F9E5",
        badges: "0xa48Fab6213fED674230D581b4649968a50AD19E7",
    },
};

async function main() {
    const networkName = network.name;
    console.log(`\n🔍 Verifying Identity contracts on ${networkName}...`);

    const contracts = IDENTITY_CONTRACTS[networkName];
    if (!contracts) {
        console.error(`❌ No Identity contracts found for ${networkName}`);
        return;
    }

    // Verify IdentityAnchor
    console.log(`\n📝 Verifying IdentityAnchor at ${contracts.anchor}...`);
    try {
        await run("verify:verify", {
            address: contracts.anchor,
            constructorArguments: [
                "SURGE Identity Anchor",
                "SURGE-ID",
                "https://surge-me-up.vercel.app/api/identity/metadata/"
            ],
        });
        console.log(`   ✅ IdentityAnchor verified!`);
    } catch (error: any) {
        console.log(`   ⚠️  ${error.message}`);
    }

    // Verify IdentityRegistry
    console.log(`\n📝 Verifying IdentityRegistry at ${contracts.registry}...`);
    try {
        await run("verify:verify", {
            address: contracts.registry,
            constructorArguments: [contracts.anchor],
        });
        console.log(`   ✅ IdentityRegistry verified!`);
    } catch (error: any) {
        console.log(`   ⚠️  ${error.message}`);
    }

    // Verify HeritageBadges
    console.log(`\n📝 Verifying HeritageBadges at ${contracts.badges}...`);
    try {
        await run("verify:verify", {
            address: contracts.badges,
            constructorArguments: [
                contracts.registry,
                "https://surge-me-up.vercel.app/api/heritage/metadata/"
            ],
        });
        console.log(`   ✅ HeritageBadges verified!`);
    } catch (error: any) {
        console.log(`   ⚠️  ${error.message}`);
    }

    console.log("\n✨ Identity verification process complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
