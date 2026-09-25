const { execSync } = require("child_process");
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

// Warna buat console
const colors = {
    green: "\x1b[32m",
    blue: "\x1b[36m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    reset: "\x1b[0m",
    bold: "\x1b[1m",
};

const log = {
    info: (msg) => console.log(`${colors.blue}ℹ️ ${msg}${colors.reset}`),
    success: (msg) => console.log(`${colors.green}${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}${msg}${colors.reset}`),
    warn: (msg) => console.log(`${colors.yellow}⚠️ ${msg}${colors.reset}`),
    title: (msg) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}\n`),
};

// Template commit types dengan emoji
const commitTypes = {
    feat: { emoji: "✨", desc: "New feature" },
    fix: { emoji: "🐛", desc: "Bug fix" },
    docs: { emoji: "📝", desc: "Documentation" },
    chore: { emoji: "🔧", desc: "Chore/maintenance" },
    refactor: { emoji: "♻️", desc: "Code refactoring" },
    test: { emoji: "🧪", desc: "Testing" },
    perf: { emoji: "⚡", desc: "Performance improvement" },
    style: { emoji: "💄", desc: "Code style/formatting" },
    ci: { emoji: "👷", desc: "CI/CD configuration" },
    build: { emoji: "📦", desc: "Build system/dependencies" },
    revert: { emoji: "⏪", desc: "Revert changes" },
};

// Cek status git
function checkGitStatus() {
    try {
        const status = execSync("git status --porcelain").toString().trim();
        if (!status) {
            log.warn("No changes to commit!");
            return false;
        }

        const files = status.split("\n").length;
        log.info(`${files} file(s) changed:`);
        console.log(status);
        return true;
    } catch (error) {
        log.error("Not a git repository!");
        return false;
    }
}

// Preview commit
function previewCommit(type, scope, message, version) {
    const emoji = commitTypes[type]?.emoji || "📌";
    const scopeStr = scope ? `(${scope})` : "";
    const fullMsg = `${type}${scopeStr}: ${message}`;

    console.log(`\n${colors.bold}Commit Preview:${colors.reset}`);
    console.log(`  ${colors.yellow}Version:${colors.reset} v${version}`);
    console.log(`  ${colors.yellow}Type:${colors.reset} ${emoji} ${type} (${commitTypes[type]?.desc || "Unknown"})`);
    if (scope) console.log(`  ${colors.yellow}Scope:${colors.reset} ${scope}`);
    console.log(`  ${colors.yellow}Message:${colors.reset} ${message}`);
    console.log(`\n  ${colors.blue}git commit -m "${fullMsg}"${colors.reset}`);
    console.log(`  ${colors.blue}git tag -a v${version} -m "Release v${version}"${colors.reset}\n`);
}

// Main function
async function release() {
    try {
        log.title("RELEASE SCRIPT");

        // 1. Cek git status
        if (!checkGitStatus()) {
            rl.close();
            return;
        }

        // 2. Baca package.json
        const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
        let [major, minor, patch] = pkg.version.split(".").map(Number);

        console.log(`\n${colors.bold}Current version:${colors.reset} ${colors.green}v${pkg.version}${colors.reset}`);

        // 3. Ask inputs dengan default value
        const bumpType = (await ask(`Bump type (${colors.yellow}patch${colors.reset} | minor | major) [patch]: `)) || "patch";
        const commitType = (await ask(`Commit type (${colors.yellow}chore${colors.reset} | feat | fix | docs | refactor | test | perf) [chore]: `)) || "chore";
        const scope = (await ask("Scope (e.g. auth, user, api) [none]: ")) || "";
        const message = await ask("Commit message: ");

        // 4. Validasi input
        if (!message.trim()) {
            log.error("Commit message is required!");
            rl.close();
            return;
        }

        if (!commitTypes[commitType]) {
            log.warn(`Unknown commit type: ${commitType}, using "chore"`);
        }

        // 5. Versioning
        switch (bumpType.toLowerCase()) {
            case "major":
                major++;
                minor = 0;
                patch = 0;
                break;
            case "minor":
                minor++;
                patch = 0;
                break;
            case "patch":
            default:
                patch++;
        }

        const newVersion = `${major}.${minor}.${patch}`;
        const finalCommitType = commitTypes[commitType] ? commitType : "chore";
        const finalScope = scope ? `(${scope})` : "";
        const finalMsg = message.trim();
        const commitFull = `${finalCommitType}${finalScope}: ${finalMsg}`;

        // 6. Preview
        previewCommit(finalCommitType, scope, finalMsg, newVersion);

        // 7. Confirmation
        const confirm = (await ask(`\nProceed with release? (${colors.green}y${colors.reset}/${colors.red}n${colors.reset}) [y]: `)) || "y";

        if (confirm.toLowerCase() !== "y") {
            log.warn("Release cancelled");
            rl.close();
            return;
        }

        // 8. Execute
        console.log(`\n${colors.blue}Releasing v${newVersion}...${colors.reset}\n`);

        // Update package.json
        pkg.version = newVersion;
        fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
        log.info("Updated package.json");

        // Git add
        execSync("git add -A", { stdio: "inherit" });
        log.info("Staged changes");

        // Git commit
        execSync(`git commit -m "${commitFull}"`, { stdio: "inherit" });
        log.info("Committed changes");

        // Git tag
        execSync(`git tag -a v${newVersion} -m "Release v${newVersion}"`, { stdio: "inherit" });
        log.info("Created tag");

        // Push
        const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
        execSync(`git push origin ${branch} --tags`, { stdio: "inherit" });
        log.info(`Pushed to ${branch}`);

        // bagian release

        // 9. Success
        console.log(`\n${colors.green}${colors.bold}Successfully released v${newVersion}!${colors.reset}\n`);

        // 10. Show next steps
        console.log(`${colors.blue}Next steps:${colors.reset}`);
        console.log(`  1. Check deployment: ${colors.yellow}npm run deploy${colors.reset}`);
        console.log(`  2. View logs: ${colors.yellow}npm run pm2:logs${colors.reset}`);
        console.log(`  3. Monitor: ${colors.yellow}npm run pm2:monit${colors.reset}\n`);
    } catch (error) {
        console.error(`\n${colors.red}${colors.bold}Release failed:${colors.reset}`, error.message);

        // Helpful error messages
        if (error.message.includes("not a git repository")) {
            log.error("Make sure you are in a git repository!");
        } else if (error.message.includes("no changes added to commit")) {
            log.error("No changes to commit!");
        } else if (error.message.includes("failed to push")) {
            log.error("Push failed! Check your connection and permissions.");
        }

        process.exit(1);
    } finally {
        rl.close();
    }
}

// Run
release();
