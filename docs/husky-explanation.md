# Husky: Git Hooks Manager

## What is Husky?

Husky is a tool that enhances your Git workflow by making it easy to configure and manage Git hooks. Git hooks are scripts that run automatically when specific events occur in a Git repository, such as committing code or pushing to a remote repository.

## Why Use Husky in Portfolio Manager?

For the Portfolio Manager project, Husky provides several significant benefits:

### 1. Automated Quality Control

Husky helps maintain code quality by automatically running checks before code is committed or pushed. This ensures that no code enters the repository unless it meets the established quality standards.

### 2. Consistent Development Standards

By enforcing checks at the Git hook level, Husky ensures that all developers (or your future self) follow the same quality standards, regardless of their IDE settings or personal workflows.

### 3. Prevention of Problematic Commits

Rather than finding issues after code is committed or deployed, Husky helps catch problems at the earliest possible stage—before the code even enters the repository.

### 4. Seamless Integration with Other Tools

Husky works well with the rest of our tool chain, particularly:

- ESLint for code quality checks
- Prettier for code formatting
- TypeScript for type checking
- Jest for unit tests

## How Husky Works in Portfolio Manager

### Pre-commit Hook

The pre-commit hook runs before code is committed. In our project, it will:

1. Run ESLint to check for code quality issues
2. Run Prettier to ensure consistent formatting
3. Check TypeScript compilation to catch type errors

Example `.husky/pre-commit` configuration:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check TypeScript
npm run type-check

# Lint and format files
npx lint-staged
```

With a corresponding `lint-staged` configuration in `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

### Pre-push Hook

The pre-push hook runs before code is pushed to a remote repository. In our project, it will:

1. Run unit tests to ensure no broken functionality is pushed
2. Perform a more comprehensive linting check
3. Verify build process works correctly

Example `.husky/pre-push` configuration:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run tests
npm test

# Ensure build completes successfully
npm run build
```

## Setup and Configuration

Setting up Husky for the Portfolio Manager is straightforward:

1. Install Husky as a development dependency:

   ```bash
   npm install --save-dev husky lint-staged
   ```

2. Enable Git hooks:

   ```bash
   npx husky install
   ```

3. Add a prepare script to `package.json` to ensure Husky is set up on npm install:

   ```json
   {
     "scripts": {
       "prepare": "husky install"
     }
   }
   ```

4. Add hooks:
   ```bash
   npx husky add .husky/pre-commit "npx lint-staged"
   npx husky add .husky/pre-push "npm test && npm run build"
   ```

## Benefits for Solo Development

Even though you're developing this project primarily for yourself, Husky provides significant benefits:

1. **Consistency Over Time**: Enforces the same standards as your project evolves, even if you take breaks between development sessions

2. **Prevents Shortcuts**: During crunch times or when making quick fixes, Husky ensures you don't inadvertently skip quality steps

3. **Open Source Readiness**: If you decide to open-source the project later, the quality standards are already in place

4. **Learning Best Practices**: Helps you maintain professional development practices even in personal projects

5. **Reduced Technical Debt**: Prevents accumulation of small issues that could become significant problems later

## Customization Options

Husky is highly customizable to meet the specific needs of the Portfolio Manager project:

1. **Selective Running**: Using lint-staged, you can configure different actions for different file types

2. **Environment-Aware**: You can configure hooks to behave differently in development vs. production environments

3. **Performance Optimization**: Hooks can be set to only run on files that have changed, saving time during commits

4. **Custom Scripts**: You can add project-specific checks tailored to your workflow

## Conclusion

Husky is an essential tool for the Portfolio Manager project that:

- Enforces code quality standards
- Prevents problematic code from entering the repository
- Maintains consistency over time
- Integrates seamlessly with other development tools
- Prepares the project for potential open-source contributors

By implementing Husky from the start, you're establishing good practices that will benefit the project throughout its lifecycle, whether it remains a personal tool or evolves into something used by others.

---

_Last updated: May 19, 2025_
