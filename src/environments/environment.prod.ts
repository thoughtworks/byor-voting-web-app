declare var __BACKEND_SERVICE_URL__: string;
declare var __RADAR_SERVICE_URL__: string;
export const environment = {
  production: true,
  serviceUrl: __BACKEND_SERVICE_URL__,
  radarURL: __RADAR_SERVICE_URL__,
  traceLevel: 'INFO',
  maxNumberOfVotes: 10
};
