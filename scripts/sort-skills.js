import { execSync } from "child_process";
import fs from "fs";
import yaml from "js-yaml";

/**
 * Sorts the skills.yaml file by type, then by name within each type group
 * Usage: node scripts/sort-skills.js
 */
function sortSkills() {
  try {
    // Read the YAML file
    const skillsData = yaml.load(
      fs.readFileSync("src/content/skills.yaml", "utf8"),
    );

    // Sort by type first, then by name within each type
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
      console.log("✅ Skills sorted and formatted successfully!");
    } catch (formatError) {
      console.warn(
        "⚠️  Sorting completed, but prettier formatting failed:",
        formatError.message,
      );
      console.log("✅ Skills sorted successfully!");
    }

    console.log("Sorted by type, then by name within each type group.");
  } catch (error) {
    console.error("❌ Error sorting skills:", error.message);
    process.exit(1);
  }
}

// Run the script
sortSkills();
