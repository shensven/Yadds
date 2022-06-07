import { Rectangle } from 'electron';
import Store, { Schema } from 'electron-store';
import { QueueIterater, SidebarCategory } from '../../renderer/atoms/atomUI';

export type YaddsCache = {
  windowBounds: Rectangle;
  isMaximized: boolean;
  isFullScreened: boolean;
  hasSidebar: boolean;
  sidebarCategory: SidebarCategory;
  queueIterater: QueueIterater;
  queueIsAscend: boolean;
};

const schema: Schema<YaddsCache> = {
  windowBounds: {
    type: 'object',
    properties: {
      x: { type: 'number' },
      y: { type: 'number' },
      width: { type: 'number' },
      height: { type: 'number' },
    },
  },
  isMaximized: {
    type: 'boolean',
  },
  isFullScreened: {
    type: 'boolean',
  },
  hasSidebar: {
    type: 'boolean',
  },
  sidebarCategory: {
    type: 'string',
  },
  queueIterater: {
    type: 'string',
  },
  queueIsAscend: {
    type: 'boolean',
  },
};

const cache = new Store<YaddsCache>({ schema, clearInvalidConfig: true });

export default cache;
