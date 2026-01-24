import { execSync } from "child_process";
import fs from "fs";
import yaml from "js-yaml";

/**
 * Syncs skill IDs from skills.yaml to skills.gen.ts
 * Generates a TypeScript file with all skill IDs as a const array and union type
 * Usage: node scripts/sync-skill-ids.js
 */
function syncSkillIds() {
  try {
    // Read the YAML file
    const skillsData = yaml.load(
      fs.readFileSync("src/content/skills.yaml", "utf8"),
    );

    if (!Array.isArray(skillsData)) {
      throw new Error("skills.yaml must contain an array of skills");
    }

    if (skillsData.length === 0) {
      throw new Error("skills.yaml is empty");
    }

    // Extract all skill IDs
    const skillIds = skillsData
      .map((skill) => {
        if (!skill || !skill.id) {
          throw new Error("Invalid skill entry: missing id field");
        }
        return skill.id;
      })
      .sort(); // Sort alphabetically for consistency

    // Generate TypeScript file content
    const tsContent = `// This file is auto-generated. Do not edit manually.
// Run: bun run sync-skill-ids

export const SKILL_IDS = [
${skillIds.map((id) => `  "${id}",`).join("\n")}
] as const;

export type SkillId = (typeof SKILL_IDS)[number];
`;

    // Write to file
    fs.writeFileSync("src/content/skills.gen.ts", tsContent);

    // Run prettier on the generated file
    try {
      execSync("bun run format -- src/content/skills.gen.ts", {
        stdio: "inherit",
      });
      console.log("✅ Skill IDs synced and formatted successfully!");
    } catch (formatError) {
      console.warn(
        "⚠️  Sync completed, but prettier formatting failed:",
        formatError.message,
      );
      console.log("✅ Skill IDs synced successfully!");
    }

    console.log(`   Generated ${skillIds.length} skill IDs in skills.gen.ts`);
  } catch (error) {
    console.error("❌ Error syncing skill IDs:", error.message);
    process.exit(1);
  }
}

// Run the script
syncSkillIds();
