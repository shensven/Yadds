import Store, { Schema } from 'electron-store';
import { Appearance, LocaleName } from 'renderer/atoms/atomUI';

export type YaddsPreferences = {
  appearance: Appearance;
  locale: LocaleName;
  isAutoLaunch: boolean;
  isAutoUpdate: boolean;
};

const schema: Schema<YaddsPreferences> = {
  appearance: {
    type: 'string',
  },
  locale: {
    type: 'string',
  },
  isAutoLaunch: {
    type: 'boolean',
  },
  isAutoUpdate: {
    type: 'boolean',
  },
};

const preferences = new Store<YaddsPreferences>({ schema, clearInvalidConfig: true });

export default preferences;
