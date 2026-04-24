module.exports = {
  apps: [
    {
      name: 'qrv-registry',
      cwd: '/var/www/qrv',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4101,
        SERVICE_NAME: 'qrv-registry'
      }
    },
    {
      name: 'qrv-api',
      cwd: '/var/www/qrv',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4102,
        SERVICE_NAME: 'qrv-api'
      }
    },
    {
      name: 'issuer-qrv',
      cwd: '/var/www/qrv/onegodian-identity-engine',
      script: 'npm',
      args: 'run start -- --port 4103',
      env: {
        NODE_ENV: 'production',
        PORT: 4103,
        SERVICE_NAME: 'issuer-qrv'
      }
    },
    {
      name: 'verify-qrv',
      cwd: '/var/www/qrv',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4104,
        SERVICE_NAME: 'verify-qrv'
      }
    },
    {
      name: 'api-quantumohi',
      cwd: '/var/www/qrv',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4105,
        SERVICE_NAME: 'api-quantumohi'
      }
    }
  ]
};
