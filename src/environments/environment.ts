// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urlApi: "https://devapivisorplanos.azurewebsites.net/api/",
  key: "pk.eyJ1IjoiY2xhdWRpYW1vbnRhbHZvIiwiYSI6ImNrbW1xbTV1OTEwemMzMXBsdXV1c3YxYncifQ.1YGZi-p9IVmg7RCwntwHRw",
  clientId: '86ae93f0-7a49-4e92-a322-49e50491c741',
  authority: 'https://login.microsoftonline.com/dd79dbef-790f-4316-b7ef-d2624083bfc4/',
  redirectUrl: 'http://localhost:4200/',
  //redirectUrl: 'http://localhost:4200/dashboard-totem',
  postLogoutUrl: 'http://localhost:4200',
  urlApiBackend_Token: "https://login.microsoftonline.com/losportalesbtc.onmicrosoft.com/oauth2/v2.0/token",
  urlBack: "https://devapimlp.azure-api.net/viviendahu.msinventario"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
