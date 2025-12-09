import { camelCase, pascalCase } from 'change-case';
import { registerHelpers } from './src/helpers/handlebars.js';
import { defaultEntityFeatures, defaultListConfig } from './src/config/defaults.js';

export default function (plop) {
  // Register custom Handlebars helpers
  registerHelpers(plop);

  // Main generator command
  plop.setGenerator('create', {
    description: 'Create a new dashboard project',
    prompts: [
      // Project basics
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name (kebab-case):',
        default: 'my-dashboard',
        validate: (input) => {
          if (!/^[a-z][a-z0-9-]*$/.test(input)) {
            return 'Project name must be lowercase with hyphens only';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'displayName',
        message: 'Display name:',
        default: (answers) => pascalCase(answers.projectName).replace(/([A-Z])/g, ' $1').trim(),
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description:',
        default: 'Internal admin dashboard',
      },
      {
        type: 'input',
        name: 'apiBaseUrl',
        message: 'API base URL:',
        default: 'http://localhost:3001/api',
      },
      // Module selection
      {
        type: 'checkbox',
        name: 'modules',
        message: 'Select modules to include:',
        choices: [
          { name: 'Authentication (Login, JWT, Protected Routes)', value: 'auth', checked: true },
          { name: 'Dashboard (Stats, Widgets, Overview)', value: 'dashboard', checked: true },
          { name: 'CRUD Entities (Data Management Pages)', value: 'crud', checked: true },
        ],
      },
    ],
    actions: function (data) {
      const actions = [];

      // Transform data for templates
      data.hasAuth = data.modules.includes('auth');
      data.hasDashboard = data.modules.includes('dashboard');
      data.hasCrud = data.modules.includes('crud');
      data.projectNamePascal = pascalCase(data.projectName);
      data.projectNameCamel = camelCase(data.projectName);

      // For MVP, create a default Product entity
      data.entities = [
        {
          name: 'Product',
          pluralName: 'Products',
          slug: 'products',
          fields: [
            { name: 'name', label: 'Product Name', type: 'string', required: true, showInList: true, showInDetail: true, showInForm: true, maxLength: 100 },
            { name: 'sku', label: 'SKU', type: 'string', required: true, showInList: true, showInDetail: true, showInForm: true },
            { name: 'description', label: 'Description', type: 'text', required: false, showInList: false, showInDetail: true, showInForm: true },
            { name: 'price', label: 'Price', type: 'number', required: true, showInList: true, showInDetail: true, showInForm: true, min: 0 },
            { name: 'quantity', label: 'Quantity', type: 'number', required: true, showInList: true, showInDetail: true, showInForm: true, min: 0 },
            { name: 'status', label: 'Status', type: 'enum', required: true, showInList: true, showInDetail: true, showInForm: true, enumValues: ['active', 'inactive', 'discontinued'] },
            { name: 'categoryId', label: 'Category', type: 'relation', required: false, showInList: true, showInDetail: true, showInForm: true, relationEntity: 'Category', relationDisplayField: 'name' },
          ],
          features: defaultEntityFeatures,
          listConfig: {
            ...defaultListConfig,
            searchableFields: ['name', 'sku'],
          },
        },
        {
          name: 'Category',
          pluralName: 'Categories',
          slug: 'categories',
          fields: [
            { name: 'name', label: 'Category Name', type: 'string', required: true, showInList: true, showInDetail: true, showInForm: true, maxLength: 50 },
            { name: 'description', label: 'Description', type: 'text', required: false, showInList: false, showInDetail: true, showInForm: true },
            { name: 'isActive', label: 'Active', type: 'boolean', required: true, showInList: true, showInDetail: true, showInForm: true },
          ],
          features: defaultEntityFeatures,
          listConfig: {
            ...defaultListConfig,
            searchableFields: ['name'],
          },
        },
      ];

      // Dashboard config
      data.dashboard = {
        title: 'Dashboard',
        layout: 'grid-3',
        widgets: [
          { id: 'total-products', type: 'stat-card', title: 'Total Products', size: 'sm', statConfig: { label: 'Products', mockValue: 1247, icon: 'package', trend: 'up' } },
          { id: 'total-categories', type: 'stat-card', title: 'Categories', size: 'sm', statConfig: { label: 'Categories', mockValue: 24, icon: 'folder', trend: 'neutral' } },
          { id: 'low-stock', type: 'stat-card', title: 'Low Stock', size: 'sm', statConfig: { label: 'Items', mockValue: 12, icon: 'alert', trend: 'down' } },
          { id: 'recent-products', type: 'recent-list', title: 'Recent Products', size: 'lg', listConfig: { entity: 'Product', displayFields: ['name', 'sku', 'status'], limit: 5 } },
        ],
      };

      // ============================================
      // BASE PROJECT FILES
      // ============================================
      actions.push(
        { type: 'add', path: '{{projectName}}/package.json', templateFile: 'templates/vite-react/base/package.json.hbs' },
        { type: 'add', path: '{{projectName}}/vite.config.ts', templateFile: 'templates/vite-react/base/vite.config.ts.hbs' },
        { type: 'add', path: '{{projectName}}/tsconfig.json', templateFile: 'templates/vite-react/base/tsconfig.json.hbs' },
        { type: 'add', path: '{{projectName}}/tsconfig.node.json', templateFile: 'templates/vite-react/base/tsconfig.node.json.hbs' },
        { type: 'add', path: '{{projectName}}/tailwind.config.cjs', templateFile: 'templates/vite-react/base/tailwind.config.cjs.hbs' },
        { type: 'add', path: '{{projectName}}/postcss.config.cjs', templateFile: 'templates/vite-react/base/postcss.config.cjs.hbs' },
        { type: 'add', path: '{{projectName}}/index.html', templateFile: 'templates/vite-react/base/index.html.hbs' },
        { type: 'add', path: '{{projectName}}/.env.example', templateFile: 'templates/vite-react/base/.env.example.hbs' },
        { type: 'add', path: '{{projectName}}/.gitignore', templateFile: 'templates/vite-react/base/.gitignore.hbs' },
        { type: 'add', path: '{{projectName}}/README.md', templateFile: 'templates/vite-react/base/README.md.hbs' },
      );

      // ============================================
      // SOURCE FILES - MAIN ENTRY
      // ============================================
      actions.push(
        { type: 'add', path: '{{projectName}}/src/main.tsx', templateFile: 'templates/vite-react/src/main.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/App.tsx', templateFile: 'templates/vite-react/src/App.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/router.tsx', templateFile: 'templates/vite-react/src/router.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/index.css', templateFile: 'templates/vite-react/src/index.css.hbs' },
        { type: 'add', path: '{{projectName}}/src/vite-env.d.ts', templateFile: 'templates/vite-react/src/vite-env.d.ts.hbs' },
      );

      // ============================================
      // API LAYER
      // ============================================
      actions.push(
        { type: 'add', path: '{{projectName}}/src/api/client.ts', templateFile: 'templates/vite-react/src/api/client.ts.hbs' },
        { type: 'add', path: '{{projectName}}/src/api/hooks.ts', templateFile: 'templates/vite-react/src/api/hooks.ts.hbs' },
        { type: 'add', path: '{{projectName}}/src/api/endpoints.ts', templateFile: 'templates/vite-react/src/api/endpoints.ts.hbs' },
      );

      // ============================================
      // STORES
      // ============================================
      actions.push(
        { type: 'add', path: '{{projectName}}/src/stores/authStore.ts', templateFile: 'templates/vite-react/src/stores/authStore.ts.hbs' },
        { type: 'add', path: '{{projectName}}/src/stores/uiStore.ts', templateFile: 'templates/vite-react/src/stores/uiStore.ts.hbs' },
      );

      // ============================================
      // GLOBAL TYPES (src/types/)
      // ============================================
      actions.push(
        { type: 'add', path: '{{projectName}}/src/types/auth.ts', templateFile: 'templates/vite-react/src/types/auth.ts.hbs' },
        { type: 'add', path: '{{projectName}}/src/types/api.ts', templateFile: 'templates/vite-react/src/types/api.ts.hbs' },
      );

      // ============================================
      // SHARED UTILITIES (src/utils/)
      // ============================================
      actions.push(
        { type: 'add', path: '{{projectName}}/src/utils/cn.ts', templateFile: 'templates/vite-react/src/utils/cn.ts.hbs' },
        { type: 'add', path: '{{projectName}}/src/utils/format.ts', templateFile: 'templates/vite-react/src/utils/format.ts.hbs' },
        { type: 'add', path: '{{projectName}}/src/utils/validation.ts', templateFile: 'templates/vite-react/src/utils/validation.ts.hbs' },
      );

      // ============================================
      // COMMON COMPONENTS (src/components/common/)
      // Shared reusable UI components - no barrel files
      // ============================================
      actions.push(
        { type: 'add', path: '{{projectName}}/src/components/common/Button.tsx', templateFile: 'templates/vite-react/src/components/ui/Button.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/components/common/Input.tsx', templateFile: 'templates/vite-react/src/components/ui/Input.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/components/common/Select.tsx', templateFile: 'templates/vite-react/src/components/ui/Select.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/components/common/Checkbox.tsx', templateFile: 'templates/vite-react/src/components/ui/Checkbox.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/components/common/Badge.tsx', templateFile: 'templates/vite-react/src/components/ui/Badge.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/components/common/Card.tsx', templateFile: 'templates/vite-react/src/components/ui/Card.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/components/common/Modal.tsx', templateFile: 'templates/vite-react/src/components/ui/Modal.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/components/common/Spinner.tsx', templateFile: 'templates/vite-react/src/components/ui/Spinner.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/components/common/LoadingState.tsx', templateFile: 'templates/vite-react/src/components/common/LoadingState.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/components/common/DataTable.tsx', templateFile: 'templates/vite-react/src/components/tables/DataTable.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/components/common/TablePagination.tsx', templateFile: 'templates/vite-react/src/components/tables/TablePagination.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/components/common/TableSearch.tsx', templateFile: 'templates/vite-react/src/components/tables/TableSearch.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/components/common/FormField.tsx', templateFile: 'templates/vite-react/src/components/forms/FormField.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/components/common/FormSection.tsx', templateFile: 'templates/vite-react/src/components/forms/FormSection.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/components/common/FormActions.tsx', templateFile: 'templates/vite-react/src/components/forms/FormActions.tsx.hbs' },
      );

      // ============================================
      // LAYOUT COMPONENTS (src/components/layout/)
      // App shell components - no barrel files
      // ============================================
      actions.push(
        { type: 'add', path: '{{projectName}}/src/components/layout/AppLayout.tsx', templateFile: 'templates/vite-react/src/components/layout/AppLayout.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/components/layout/Sidebar.tsx', templateFile: 'templates/vite-react/src/components/layout/Sidebar.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/components/layout/Header.tsx', templateFile: 'templates/vite-react/src/components/layout/Header.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/components/layout/PageHeader.tsx', templateFile: 'templates/vite-react/src/components/layout/PageHeader.tsx.hbs' },
        { type: 'add', path: '{{projectName}}/src/components/layout/ProtectedRoute.tsx', templateFile: 'templates/vite-react/src/components/layout/ProtectedRoute.tsx.hbs' },
      );

      // ============================================
      // AUTH FEATURE MODULE (src/features/auth/)
      // ============================================
      if (data.hasAuth) {
        actions.push(
          // Pages - no index.ts barrel files
          { type: 'add', path: '{{projectName}}/src/features/auth/pages/LoginPage/LoginPage.tsx', templateFile: 'templates/vite-react/src/features/auth/pages/LoginPage/LoginPage.tsx.hbs' },
          { type: 'add', path: '{{projectName}}/src/features/auth/pages/LoginPage/useLoginPage.ts', templateFile: 'templates/vite-react/src/features/auth/pages/LoginPage/useLoginPage.ts.hbs' },
          { type: 'add', path: '{{projectName}}/src/features/auth/pages/LoginPage/LoginPage.types.ts', templateFile: 'templates/vite-react/src/features/auth/pages/LoginPage/LoginPage.types.ts.hbs' },
          // Module hooks
          { type: 'add', path: '{{projectName}}/src/features/auth/hooks/useAuth.ts', templateFile: 'templates/vite-react/src/hooks/useAuth.ts.hbs' },
        );
      }

      // ============================================
      // DASHBOARD FEATURE MODULE (src/features/dashboard/)
      // ============================================
      if (data.hasDashboard) {
        actions.push(
          // Pages - no index.ts barrel files
          { type: 'add', path: '{{projectName}}/src/features/dashboard/pages/DashboardPage/DashboardPage.tsx', templateFile: 'templates/vite-react/src/features/dashboard/pages/DashboardPage/DashboardPage.tsx.hbs' },
          { type: 'add', path: '{{projectName}}/src/features/dashboard/pages/DashboardPage/useDashboardPage.ts', templateFile: 'templates/vite-react/src/features/dashboard/pages/DashboardPage/useDashboardPage.ts.hbs' },
          { type: 'add', path: '{{projectName}}/src/features/dashboard/pages/DashboardPage/DashboardPage.types.ts', templateFile: 'templates/vite-react/src/features/dashboard/pages/DashboardPage/DashboardPage.types.ts.hbs' },
          // Components - StatCard (no index.ts)
          { type: 'add', path: '{{projectName}}/src/features/dashboard/components/StatCard/StatCard.tsx', templateFile: 'templates/vite-react/src/features/dashboard/components/StatCard/StatCard.tsx.hbs' },
          { type: 'add', path: '{{projectName}}/src/features/dashboard/components/StatCard/StatCard.types.ts', templateFile: 'templates/vite-react/src/features/dashboard/components/StatCard/StatCard.types.ts.hbs' },
          // Components - RecentList (no index.ts)
          { type: 'add', path: '{{projectName}}/src/features/dashboard/components/RecentList/RecentList.tsx', templateFile: 'templates/vite-react/src/features/dashboard/components/RecentList/RecentList.tsx.hbs' },
          { type: 'add', path: '{{projectName}}/src/features/dashboard/components/RecentList/RecentList.types.ts', templateFile: 'templates/vite-react/src/features/dashboard/components/RecentList/RecentList.types.ts.hbs' },
          // Components - QuickActions (no index.ts)
          { type: 'add', path: '{{projectName}}/src/features/dashboard/components/QuickActions/QuickActions.tsx', templateFile: 'templates/vite-react/src/features/dashboard/components/QuickActions/QuickActions.tsx.hbs' },
          { type: 'add', path: '{{projectName}}/src/features/dashboard/components/QuickActions/QuickActions.types.ts', templateFile: 'templates/vite-react/src/features/dashboard/components/QuickActions/QuickActions.types.ts.hbs' },
        );
      }

      // ============================================
      // NOT FOUND PAGE
      // ============================================
      actions.push(
        { type: 'add', path: '{{projectName}}/src/pages/NotFoundPage.tsx', templateFile: 'templates/vite-react/src/pages/NotFoundPage.tsx.hbs' },
      );

      // ============================================
      // ENTITY FEATURE MODULES (src/features/<entity>/)
      // ============================================
      if (data.hasCrud && data.entities) {
        data.entities.forEach((entity) => {
          const entityData = { ...data, entity };

          // Entity types (global)
          actions.push({
            type: 'add',
            path: `{{projectName}}/src/types/${entity.slug}.ts`,
            templateFile: 'templates/vite-react/src/types/entity.ts.hbs',
            data: entityData,
          });

          // Entity feature module - ListPage (no index.ts)
          actions.push({
            type: 'add',
            path: `{{projectName}}/src/features/${entity.slug}/pages/${entity.name}ListPage/${entity.name}ListPage.tsx`,
            templateFile: 'templates/vite-react/src/features/entity/pages/EntityListPage/EntityListPage.tsx.hbs',
            data: entityData,
          });
          actions.push({
            type: 'add',
            path: `{{projectName}}/src/features/${entity.slug}/pages/${entity.name}ListPage/use${entity.name}ListPage.ts`,
            templateFile: 'templates/vite-react/src/features/entity/pages/EntityListPage/useEntityListPage.ts.hbs',
            data: entityData,
          });
          actions.push({
            type: 'add',
            path: `{{projectName}}/src/features/${entity.slug}/pages/${entity.name}ListPage/${entity.name}ListPage.types.ts`,
            templateFile: 'templates/vite-react/src/features/entity/pages/EntityListPage/EntityListPage.types.ts.hbs',
            data: entityData,
          });

          // Entity feature module - DetailPage (no index.ts)
          actions.push({
            type: 'add',
            path: `{{projectName}}/src/features/${entity.slug}/pages/${entity.name}DetailPage/${entity.name}DetailPage.tsx`,
            templateFile: 'templates/vite-react/src/features/entity/pages/EntityDetailPage/EntityDetailPage.tsx.hbs',
            data: entityData,
          });
          actions.push({
            type: 'add',
            path: `{{projectName}}/src/features/${entity.slug}/pages/${entity.name}DetailPage/use${entity.name}DetailPage.ts`,
            templateFile: 'templates/vite-react/src/features/entity/pages/EntityDetailPage/useEntityDetailPage.ts.hbs',
            data: entityData,
          });
          actions.push({
            type: 'add',
            path: `{{projectName}}/src/features/${entity.slug}/pages/${entity.name}DetailPage/${entity.name}DetailPage.types.ts`,
            templateFile: 'templates/vite-react/src/features/entity/pages/EntityDetailPage/EntityDetailPage.types.ts.hbs',
            data: entityData,
          });

          // Entity feature module - CreatePage (no index.ts)
          actions.push({
            type: 'add',
            path: `{{projectName}}/src/features/${entity.slug}/pages/${entity.name}CreatePage/${entity.name}CreatePage.tsx`,
            templateFile: 'templates/vite-react/src/features/entity/pages/EntityCreatePage/EntityCreatePage.tsx.hbs',
            data: entityData,
          });
          actions.push({
            type: 'add',
            path: `{{projectName}}/src/features/${entity.slug}/pages/${entity.name}CreatePage/use${entity.name}CreatePage.ts`,
            templateFile: 'templates/vite-react/src/features/entity/pages/EntityCreatePage/useEntityCreatePage.ts.hbs',
            data: entityData,
          });
          actions.push({
            type: 'add',
            path: `{{projectName}}/src/features/${entity.slug}/pages/${entity.name}CreatePage/${entity.name}CreatePage.types.ts`,
            templateFile: 'templates/vite-react/src/features/entity/pages/EntityCreatePage/EntityCreatePage.types.ts.hbs',
            data: entityData,
          });

          // Entity feature module - EditPage (no index.ts)
          actions.push({
            type: 'add',
            path: `{{projectName}}/src/features/${entity.slug}/pages/${entity.name}EditPage/${entity.name}EditPage.tsx`,
            templateFile: 'templates/vite-react/src/features/entity/pages/EntityEditPage/EntityEditPage.tsx.hbs',
            data: entityData,
          });
          actions.push({
            type: 'add',
            path: `{{projectName}}/src/features/${entity.slug}/pages/${entity.name}EditPage/use${entity.name}EditPage.ts`,
            templateFile: 'templates/vite-react/src/features/entity/pages/EntityEditPage/useEntityEditPage.ts.hbs',
            data: entityData,
          });
          actions.push({
            type: 'add',
            path: `{{projectName}}/src/features/${entity.slug}/pages/${entity.name}EditPage/${entity.name}EditPage.types.ts`,
            templateFile: 'templates/vite-react/src/features/entity/pages/EntityEditPage/EntityEditPage.types.ts.hbs',
            data: entityData,
          });

          // Entity hooks (no index.ts)
          actions.push({
            type: 'add',
            path: `{{projectName}}/src/features/${entity.slug}/hooks/use${entity.pluralName}.ts`,
            templateFile: 'templates/vite-react/src/features/entity/hooks/useEntity.ts.hbs',
            data: entityData,
          });

          // Entity API contract
          actions.push({
            type: 'add',
            path: `{{projectName}}/src/api/contracts/${entity.slug}.contract.ts`,
            templateFile: 'templates/vite-react/src/api/contracts/entity.contract.ts.hbs',
            data: entityData,
          });

          // Entity mock data
          actions.push({
            type: 'add',
            path: `{{projectName}}/src/mocks/${entity.slug}.json`,
            templateFile: 'templates/vite-react/src/mocks/entity.json.hbs',
            data: entityData,
          });
        });
      }

      // Mock handlers
      actions.push(
        { type: 'add', path: '{{projectName}}/src/mocks/handlers.ts', templateFile: 'templates/vite-react/src/mocks/handlers.ts.hbs' },
      );

      return actions;
    },
  });

  // Single entity generator (for adding entities to existing projects)
  plop.setGenerator('entity', {
    description: 'Add a new entity to an existing project',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Entity name (singular, PascalCase):',
        validate: (input) => {
          if (!/^[A-Z][a-zA-Z]*$/.test(input)) {
            return 'Entity name must be PascalCase (e.g., Product, UserProfile)';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'pluralName',
        message: 'Plural name:',
        default: (answers) => answers.name + 's',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/types/{{kebabCase name}}.ts',
        templateFile: 'templates/vite-react/src/types/entity.ts.hbs',
      },
    ],
  });
}
