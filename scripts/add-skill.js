import fs from "fs";
import yaml from "js-yaml";
import { input, select } from "@inquirer/prompts";
import { execSync } from "child_process";

/**
 * Interactive script to add a new skill to skills.yaml
 * Prompts for name and type, generates slug automatically
 * Usage: node scripts/add-skill.js
 */

// Load existing skill types from skills.yaml
function getSkillTypes() {
  try {
    const skillsData = yaml.load(
      fs.readFileSync("src/content/skills.yaml", "utf8"),
    );
    const types = [...new Set(skillsData.map((skill) => skill.type))];
    types.sort();
    return types;
  } catch (error) {
    console.error("❌ Error reading skills.yaml:", error.message);
    process.exit(1);
  }
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

async function addSkill() {
  try {
    console.log("🛠️  Adding a new skill to skills.yaml\n");

    // Prompt for skill name
    const name = await input({
      message: "Enter skill name:",
      validate: (input) => {
        if (!input.trim()) {
          return "Skill name cannot be empty";
        }
        return true;
      },
    });

    // Generate slug
    const slug = generateSlug(name);
    console.log(`📝 Generated slug: ${slug}`);

    // Check if slug already exists
    const skillsData = yaml.load(
      fs.readFileSync("src/content/skills.yaml", "utf8"),
    );

    const existingSkill = skillsData.find((skill) => skill.id === slug);
    if (existingSkill) {
      console.error(
        `❌ Skill with slug "${slug}" already exists (${existingSkill.name})`,
      );
      process.exit(1);
    }

    // Load existing skill types and add "new" option
    const existingTypes = getSkillTypes();
    const typeChoices = [
      ...existingTypes.map((type) => ({ name: type, value: type })),
      { name: "➕ Create new type", value: "new" },
    ];

    // Interactive type selection
    const selectedType = await select({
      message: "Select skill type:",
      choices: typeChoices,
    });

    let finalType = selectedType;

    // Handle "new" option - prompt for custom type
    if (selectedType === "new") {
      const customType = await input({
        message: "Enter new skill type:",
        validate: (input) => {
          if (!input.trim()) {
            return "Custom skill type cannot be empty";
          }
          return true;
        },
      });
      finalType = customType.toLowerCase().trim();
    }

    // Create new skill object
    const newSkill = {
      id: slug,
      name: name,
      type: finalType,
    };

    // Add skill to data
    skillsData.push(newSkill);

    // Sort the skills
    const sortedSkills = skillsData.sort((a, b) => {
      // First sort by type
      if (a.type < b.type) return -1;
      if (a.type > b.type) return 1;

      // If types are equal, sort by name
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;

      return 0;
    });

    // Convert back to YAML with line breaks between entries
    const yamlOutput = yaml.dump(sortedSkills, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      flowLevel: -1,
    });

    // Add an extra line break between each entry for better readability
    const formattedYaml = yamlOutput.replace(/^- /gm, "\n- ");

    // Write back to file
    fs.writeFileSync("src/content/skills.yaml", formattedYaml);

    // Run prettier on the file to ensure consistent formatting
    try {
      execSync("bun run format -- src/content/skills.yaml", {
        stdio: "inherit",
      });
    } catch (formatError) {
      console.warn(
        "⚠️  Skill added successfully, but prettier formatting failed:",
        formatError.message,
      );
    }

    // Sync skill IDs to generate TypeScript types
    try {
      execSync("node scripts/sync-skill-ids.js", {
        stdio: "inherit",
      });
    } catch (syncError) {
      console.warn(
        "⚠️  Skill added successfully, but syncing skill IDs failed:",
        syncError.message,
      );
    }

    console.log("✅ Skill added successfully!");
    console.log(`   Added: ${newSkill.name} (${newSkill.type})`);
  } catch (error) {
    console.error("❌ Error adding skill:", error.message);
    process.exit(1);
  }
}

// Run the script
addSkill();
