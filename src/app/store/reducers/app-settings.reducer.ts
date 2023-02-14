import { createSelector } from '@ngrx/store';

import * as SettingsActions from '../actions/app-settings.actions';
import { IAppSettings } from '../../interfaces/settings';
import { environment } from '../../../environments/environment';
import {IAppState} from '../../interfaces/app-state';

export type Action = SettingsActions.All;

// Default app state
const defaultSettings: IAppSettings = environment.appSettings;

// Selector for settings
export const selectSettings = (state: IAppState) => state.appSettings;

// Reducer function
export function appSettingsReducer(
    state: IAppSettings = defaultSettings,
    action: Action
): IAppSettings {
  switch (action.type) {
    case SettingsActions.SET: {
      return action.data;
    }
    case SettingsActions.UPDATE: {
      return { ...state, ...action.data };
    }
    case SettingsActions.RESET: {
      return defaultSettings;
    }
    case SettingsActions.SIDEBAR_STATE: {
      return { ...state, sidebarOpened: action.data };
    }
    default: {
      return state;
    }
  }
}
