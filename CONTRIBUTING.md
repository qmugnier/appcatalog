# Contributing to Application Catalog

Thank you for your interest in contributing to the Application Catalog project! We appreciate your help and welcome contributions of all types.

## Code of Conduct

This project adheres to a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs if possible**
- **Include your environment details (OS, Node version, npm version)**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and the expected behavior**
- **Explain why this enhancement would be useful**

### Pull Requests

- Fill in the required template
- Follow the TypeScript styleguides
- Include appropriate test cases
- End all files with a newline
- Avoid platform-dependent code

## Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork locally**:
   ```bash
   git clone https://github.com/your-username/appcatalog.git
   cd appcatalog
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/appcatalog.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Linting and Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint -- --fix
```

### Type Checking

The project uses TypeScript for type safety. Ensure your code passes type checking before submitting a PR.

## Styleguides

### TypeScript/JavaScript

- Use TypeScript for all new code
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Use `const` by default, `let` when needed, avoid `var`
- Use arrow functions for callbacks

Example:
```typescript
/**
 * Fetches applications from the database
 * @param filters - Optional filter criteria
 * @returns Promise<Application[]>
 */
const fetchApplications = async (filters?: FilterCriteria): Promise<Application[]> => {
  // Implementation
};
```

### React Components

- Use functional components with hooks
- Use TypeScript interfaces for props
- Place components in the `src/components` directory
- Name components with PascalCase
- Export components as default exports

Example:
```typescript
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export default function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Action</button>
    </div>
  );
}
```

### CSS/Tailwind

- Use Tailwind CSS utility classes
- Avoid inline styles
- Follow the existing design system
- Use dark mode classes (`dark:`) for dark theme support

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

Example:
```
Add stakeholder management UI

- Implement stakeholder form modal
- Add stakeholder detail view
- Update application detail to show stakeholders

Fixes #123
```

### Branch Naming

Use descriptive branch names with a prefix:
- `feature/` for new features
- `bugfix/` for bug fixes
- `docs/` for documentation updates
- `refactor/` for refactoring

Example: `feature/stakeholder-management`

## Testing

While the project doesn't currently have automated tests, please:

- Test your changes locally before submitting
- Test on different browsers (Chrome, Firefox, Safari, Edge)
- Test responsive design on mobile devices
- Test dark mode functionality if applicable

## Documentation

- Update the README.md if you add new features or change functionality
- Update inline comments for complex logic
- Document new environment variables in `.env.example`
- Update type definitions in `src/types/` as needed

## Database Migrations

If you modify the database schema:

1. Create a new migration file in `supabase/migrations/`
2. Use the format: `YYYYMMDDHHMISS_description_of_migration.sql`
3. Include both UP and DOWN statements for migration reversibility
4. Test the migration locally
5. Document the changes in the PR

## Pull Request Process

1. Update the README.md and other documentation with details of changes
2. Update version numbers in package.json following [Semantic Versioning](https://semver.org/)
3. Ensure all tests pass and code is properly formatted
4. Fill out the pull request template completely
5. Request review from maintainers

## Additional Notes

### Issue and Pull Request Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `in progress` - Being worked on
- `blocked` - Blocked by another issue/PR

### Project Governance

This project is maintained by the core team. Decisions about the project direction are made collectively with input from contributors.

## Questions?

Feel free to open an issue with the label `question` or reach out to the maintainers directly.

Thank you for contributing to Application Catalog! 🎉
