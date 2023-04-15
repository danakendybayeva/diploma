// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of ell replacements can be found in `angular.json`.
import { SETTINGS } from './settings';
import * as npm from '../../package.json';

const firebaseConfig = {
  apiKey: 'AIzaSyBlZDXcI8HHi3Ru9r1Ov8JXBRt8xhNNMrU',
  authDomain: 'innlab-mobile-app.firebaseapp.com',
  projectId: 'innlab-mobile-app',
  storageBucket: 'innlab-mobile-app.appspot.com',
  messagingSenderId: '59188235869',
  appId: '1:59188235869:web:5a714cb0e1a6a5e64fc7b4',
  measurementId: 'G-LE9YD9YBYJ'
};

export const environment = {
  production: false,
  appSettings: SETTINGS,
  apiUrl: 'http://localhost:9227',
  defaultLanguage: 'kz',
  appMenu: 'assets/data/menu.json',
  // logo: 'assets/img/mdsg.png',
  // logoSign: 'assets/img/mdsg-n.svg',
  logo: 'assets/img/talaptan-logo.svg',
  logoSign: 'assets/img/talaptan-logo.png',
  version: npm.version,
  firebaseConfig: firebaseConfig,
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
