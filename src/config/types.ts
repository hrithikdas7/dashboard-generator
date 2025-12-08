/**
 * Dashboard Generator Configuration Types
 * These types define the structure of project, entity, and module configurations
 */

// ============================================================================
// Project Configuration
// ============================================================================

export interface ProjectConfig {
  name: string;                    // "inventory-admin" (kebab-case)
  displayName: string;             // "Inventory Admin"
  description: string;
  modules: {
    auth: boolean;
    dashboard: boolean;
    crud: EntityConfig[];
  };
  api: {
    baseUrl: string;               // "https://api.example.com"
  };
  dashboard?: DashboardConfig;
}

// ============================================================================
// Entity Configuration
// ============================================================================

export interface EntityConfig {
  name: string;                    // "Product" (PascalCase)
  pluralName: string;              // "Products"
  slug: string;                    // "products" (URL-friendly, kebab-case)

  fields: FieldConfig[];

  features: EntityFeatures;

  listConfig: ListConfig;
}

export interface EntityFeatures {
  list: boolean;                   // Generate list page
  detail: boolean;                 // Generate detail page
  create: boolean;                 // Generate create form
  edit: boolean;                   // Generate edit form
  delete: boolean;                 // Enable delete action
}

export interface ListConfig {
  searchableFields: string[];      // Fields to include in search
  defaultSort: {
    field: string;
    direction: 'asc' | 'desc';
  };
  pageSize: number;
}

// ============================================================================
// Field Configuration
// ============================================================================

export interface FieldConfig {
  name: string;                    // "productName" (camelCase)
  label: string;                   // "Product Name"
  type: FieldType;

  // Validation
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;

  // Display
  showInList: boolean;             // Show in table
  showInDetail: boolean;           // Show in detail view
  showInForm: boolean;             // Show in create/edit forms

  // Type-specific config
  enumValues?: string[];           // For 'enum' type
  relationEntity?: string;         // For 'relation' type
  relationDisplayField?: string;   // Field to show for relations
}

export type FieldType =
  | 'string'
  | 'text'        // Multiline textarea
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'email'
  | 'url'
  | 'enum'
  | 'relation';   // Foreign key reference

// ============================================================================
// Screen Configuration
// ============================================================================

export interface ScreenConfig {
  type: 'list' | 'detail' | 'form' | 'dashboard';
  entity?: string;                 // For CRUD screens
  route: string;                   // "/products"
  title: string;

  // For list screens
  listConfig?: {
    columns: ColumnConfig[];
    actions: ('view' | 'edit' | 'delete')[];
    bulkActions?: ('delete')[];
    filters?: FilterConfig[];
  };

  // For form screens
  formConfig?: {
    sections: FormSectionConfig[];
    submitLabel: string;
    cancelRoute: string;
  };
}

export interface ColumnConfig {
  field: string;
  header: string;
  sortable: boolean;
  width?: string;
  render?: 'text' | 'badge' | 'date' | 'boolean' | 'link' | 'currency';
}

export interface FilterConfig {
  field: string;
  type: 'text' | 'select' | 'date-range' | 'boolean';
  label: string;
  options?: { label: string; value: string }[];
}

export interface FormSectionConfig {
  title?: string;
  fields: string[];                // Field names from entity
  columns: 1 | 2;                  // Layout columns
}

// ============================================================================
// API Contract
// ============================================================================

export interface ApiContract {
  entity: string;
  baseEndpoint: string;            // "/api/products"

  endpoints: {
    list: EndpointConfig;
    detail: EndpointConfig;
    create: EndpointConfig;
    update: EndpointConfig;
    delete: EndpointConfig;
  };

  types: {
    entity: string;                // TypeScript interface code
    createDto: string;
    updateDto: string;
  };
}

export interface EndpointConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  queryParams?: Record<string, string>;
  body?: string;
  response: string;
}

// ============================================================================
// Dashboard Configuration
// ============================================================================

export interface DashboardConfig {
  title: string;
  widgets: WidgetConfig[];
  layout: 'grid-2' | 'grid-3' | 'grid-4';
}

export interface WidgetConfig {
  id: string;
  type: 'stat-card' | 'chart-placeholder' | 'recent-list' | 'quick-actions';
  title: string;
  size: 'sm' | 'md' | 'lg';        // Grid span

  // For stat-card
  statConfig?: {
    label: string;
    valueEndpoint?: string;        // API to fetch value
    mockValue: string | number;
    icon?: string;
    trend?: 'up' | 'down' | 'neutral';
  };

  // For recent-list
  listConfig?: {
    entity: string;
    displayFields: string[];
    limit: number;
  };

  // For quick-actions
  actionsConfig?: {
    actions: {
      label: string;
      route: string;
      icon?: string;
    }[];
  };
}

// ============================================================================
// Generator Context (passed to templates)
// ============================================================================

export interface GeneratorContext extends ProjectConfig {
  projectNamePascal: string;
  projectNameCamel: string;
  hasAuth: boolean;
  hasDashboard: boolean;
  hasCrud: boolean;
  entities: EntityConfig[];
}
