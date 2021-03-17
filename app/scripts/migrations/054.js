import { cloneDeep } from 'lodash';

const version = 54;

/**
 * Migrates preference tokens with 0 decimals typed as 'string' to 'number'
 */
export default {
  version,
  async migrate(originalVersionedData) {
    const versionedData = cloneDeep(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    const newState = transformState(state);
    versionedData.data = newState;
    return versionedData;
  },
};

function transformState(state) {
  const newState = state;

  if (newState.PreferencesController) {
    const { tokens } = newState.PreferencesController;
    if (Array.isArray(tokens)) {
      for (const token of tokens) {
        if (token.decimals === '0') {
          token.decimals = Number('0');
        }
      }
    }
    newState.PreferencesController.tokens = tokens;
  }

  return newState;
}
