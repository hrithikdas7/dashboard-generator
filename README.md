# Dashboard Generator

A CLI-based code generator that produces complete Vite + React + TypeScript dashboard projects from module configurations.

## Features

- **Module-based generation**: Select Auth, Dashboard, and CRUD modules
- **Entity configuration**: Define entities with fields, types, and validation
- **Complete project scaffolding**: Generates a ready-to-run Vite + React project
- **Production-ready patterns**: Includes auth, routing, state management, data fetching
- **API contracts**: Generates TypeScript types and documentation for backend teams
- **Mock data**: Includes sample data for development without a backend

## Tech Stack (Generated Projects)

- **Build**: Vite + React + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: SWR with Axios
- **Routing**: React Router v6
- **Auth**: JWT-based authentication

## Installation

```bash
# Clone or copy the generator
cd dashboard-generator

# Install dependencies
npm install
```

## Usage

### Create a new project

```bash
# Using npm script
npm run create

# Or using plop directly
npx plop create
```

The CLI will prompt you for:
1. Project name
2. Display name
3. Description
4. API base URL
5. Modules to include (Auth, Dashboard, CRUD)

### Add an entity to existing project

```bash
npm run generate entity
```

## Generated Project Structure

```
my-dashboard/
├── package.json
├── vite.config.ts
├── tailwind.config.cjs
├── tsconfig.json
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── router.tsx
│   ├── api/
│   │   ├── client.ts           # Axios with JWT interceptors
│   │   ├── endpoints.ts        # API endpoint constants
│   │   └── contracts/          # API documentation
│   ├── stores/
│   │   ├── authStore.ts        # Zustand auth store
│   │   └── uiStore.ts          # UI state (sidebar, modals)
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── use[Entity].ts      # SWR hooks per entity
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── api.ts
│   │   └── [entity].ts         # Entity types
│   ├── components/
│   │   ├── ui/                 # Button, Input, Card, etc.
│   │   ├── layout/             # AppLayout, Sidebar, Header
│   │   ├── forms/              # FormField, FormSection
│   │   ├── tables/             # DataTable, Pagination
│   │   └── dashboard/          # StatCard, RecentList
│   ├── pages/
│   │   ├── auth/               # Login
│   │   ├── dashboard/          # Dashboard
│   │   └── [entity]/           # List, Detail, Create, Edit
│   ├── mocks/                  # Mock data for development
│   └── utils/                  # Helpers (cn, format, validation)
```

## Customizing Templates

Templates are located in `templates/vite-react/`. They use [Handlebars](https://handlebarsjs.com/) syntax.

### Key files:

- `plopfile.js` - Generator configuration and prompts
- `src/helpers/handlebars.js` - Custom Handlebars helpers
- `src/config/types.ts` - TypeScript interfaces for configuration
- `src/config/defaults.ts` - Default values

### Adding a new template:

1. Create the template file in `templates/vite-react/`
2. Add the action to `plopfile.js`
3. Use Handlebars helpers for dynamic content

### Available Handlebars helpers:

- **Case conversion**: `camelCase`, `pascalCase`, `kebabCase`, `snakeCase`, `constantCase`
- **Comparison**: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `and`, `or`, `not`
- **Arrays**: `join`, `first`, `last`, `length`, `includes`
- **Types**: `tsType`, `inputType`
- **Code**: `validationRules`, `mockValue`

## Configuration Schema

See `src/config/types.ts` for the full schema. Key interfaces:

### EntityConfig

```typescript
interface EntityConfig {
  name: string;           // "Product"
  pluralName: string;     // "Products"
  slug: string;           // "products"
  fields: FieldConfig[];
  features: EntityFeatures;
  listConfig: ListConfig;
}
```

### FieldConfig

```typescript
interface FieldConfig {
  name: string;           // "productName"
  label: string;          // "Product Name"
  type: FieldType;        // "string" | "number" | "enum" | etc.
  required: boolean;
  showInList: boolean;
  showInDetail: boolean;
  showInForm: boolean;
  // ... validation options
}
```

## Development

```bash
# Run generator in development
npm run generate

# Test with a sample project
npm run create
cd test-project
npm install
npm run dev
```

## Roadmap

### Phase 1 (Current)
- [x] Basic project generation
- [x] Auth module
- [x] CRUD module
- [x] Dashboard module
- [x] Mock data generation

### Phase 2 (Planned)
- [ ] Web UI for configuration
- [ ] Interactive entity field builder
- [ ] Live preview
- [ ] Import from existing TypeScript types

### Phase 3 (Future)
- [ ] AI-powered field suggestions
- [ ] SRS document parsing
- [ ] Custom template packs

## License

MIT
