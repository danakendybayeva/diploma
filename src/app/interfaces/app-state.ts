import { IPageData } from './page-data';
import { IAppSettings } from './settings';

export interface IAppState {
  pageData: IPageData;
  appSettings: IAppSettings;
}
