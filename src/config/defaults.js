/**
 * Default configurations for the dashboard generator
 */

export const defaultEntityFeatures = {
  list: true,
  detail: true,
  create: true,
  edit: true,
  delete: true,
};

export const defaultListConfig = {
  searchableFields: [],
  defaultSort: {
    field: 'createdAt',
    direction: 'desc',
  },
  pageSize: 20,
};

export const defaultDashboardConfig = {
  title: 'Dashboard',
  layout: 'grid-3',
  widgets: [
    {
      id: 'welcome',
      type: 'stat-card',
      title: 'Welcome',
      size: 'lg',
      statConfig: {
        label: 'Get started by exploring your data',
        mockValue: '',
      },
    },
  ],
};

/**
 * Field type to TypeScript type mapping
 */
export const fieldTypeToTsType = {
  string: 'string',
  text: 'string',
  number: 'number',
  boolean: 'boolean',
  date: 'string',
  datetime: 'string',
  email: 'string',
  url: 'string',
  enum: 'string',
  relation: 'string',
};

/**
 * Field type to HTML input type mapping
 */
export const fieldTypeToInputType = {
  string: 'text',
  text: 'textarea',
  number: 'number',
  boolean: 'checkbox',
  date: 'date',
  datetime: 'datetime-local',
  email: 'email',
  url: 'url',
  enum: 'select',
  relation: 'select',
};

/**
 * Default field configurations by type
 */
export const defaultFieldsByType = {
  string: {
    maxLength: 255,
  },
  text: {
    maxLength: 2000,
  },
  number: {
    min: 0,
  },
};

/**
 * Common fields that can be auto-added to entities
 */
export const commonFields = {
  id: {
    name: 'id',
    label: 'ID',
    type: 'string',
    required: true,
    showInList: false,
    showInDetail: true,
    showInForm: false,
  },
  createdAt: {
    name: 'createdAt',
    label: 'Created At',
    type: 'datetime',
    required: true,
    showInList: false,
    showInDetail: true,
    showInForm: false,
  },
  updatedAt: {
    name: 'updatedAt',
    label: 'Updated At',
    type: 'datetime',
    required: true,
    showInList: false,
    showInDetail: true,
    showInForm: false,
  },
};
