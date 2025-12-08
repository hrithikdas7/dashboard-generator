/**
 * Default configurations for the dashboard generator
 */

import type { EntityFeatures, ListConfig, DashboardConfig } from './types.js';

export const defaultEntityFeatures: EntityFeatures = {
  list: true,
  detail: true,
  create: true,
  edit: true,
  delete: true,
};

export const defaultListConfig: ListConfig = {
  searchableFields: [],
  defaultSort: {
    field: 'createdAt',
    direction: 'desc',
  },
  pageSize: 20,
};

export const defaultDashboardConfig: DashboardConfig = {
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
export const fieldTypeToTsType: Record<string, string> = {
  string: 'string',
  text: 'string',
  number: 'number',
  boolean: 'boolean',
  date: 'string',
  datetime: 'string',
  email: 'string',
  url: 'string',
  enum: 'string', // Will be overridden by enum values
  relation: 'string', // Foreign key ID
};

/**
 * Field type to HTML input type mapping
 */
export const fieldTypeToInputType: Record<string, string> = {
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
    type: 'string' as const,
    required: true,
    showInList: false,
    showInDetail: true,
    showInForm: false,
  },
  createdAt: {
    name: 'createdAt',
    label: 'Created At',
    type: 'datetime' as const,
    required: true,
    showInList: false,
    showInDetail: true,
    showInForm: false,
  },
  updatedAt: {
    name: 'updatedAt',
    label: 'Updated At',
    type: 'datetime' as const,
    required: true,
    showInList: false,
    showInDetail: true,
    showInForm: false,
  },
};
