---
name: skill-creator
description: Meta-skill that instructs the agent on how to properly create, format, and structure new skills and workflows.
---

# Skill Creator

This skill provides the standard operating procedure for creating new skills within this workspace.

## 1. Directory Structure
All skills must be created in the `.agents/skills/` directory at the root of the workspace. Each skill is a folder containing at minimum a `SKILL.md` file.

```
.agents/
└── skills/
    └── [skill-name-kebab-case]/
        ├── SKILL.md          (Required: Core instructions)
        ├── scripts/          (Optional: Helper bash/python scripts)
        ├── examples/         (Optional: Reference implementations)
        └── resources/        (Optional: Templates or assets)
```

## 2. SKILL.md Formatting
The `SKILL.md` file MUST start with YAML frontmatter containing `name` and `description`.

```yaml
---
name: [skill-name]
description: [Short, concise description of what the skill does and when to use it]
---
```

Followed by markdown sections:
- **Overview**: High-level explanation of the skill.
- **When to Use**: Clear triggers for the agent to know when this skill applies.
- **Workflow / Steps**: Step-by-step instructions for the agent to execute.
- **Rules & Constraints**: Strict boundaries the agent must respect when using the skill.

## 3. Creating Rules
If the skill requires setting project-wide rules, create or update `.cursorrules` or `.windsurfrules` in the project root to ensure other AI assistants or future sessions maintain context.

## 4. Workflows vs Skills
- **Skills** are broad capabilities (e.g., "Review Code", "Deploy to App Store").
- **Workflows** are linear, specific playbooks. Put them in `.agents/workflows/[filename].md`. Use `description: [text]` frontmatter.

## 5. Execution
When asked to create a new skill, ALWAYS use this template and structure. Use `write_to_file` to scaffold the directory and `SKILL.md`.
