process.env.PORT = process.env.PORT || 7000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
process.env.URLDB =
  'mongodb+srv://bryan-developer:Slayerhollow1@bryan-developer-cluster-1-l8do3.mongodb.net/sistema-tienda?retryWrites=true&w=majority';
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
process.env.CLIENTID =
  process.env.CLIENTID ||
  '532526220833-47suh0vch9l0bkekk5fto6658kl1hqkn.apps.googleusercontent.com';
