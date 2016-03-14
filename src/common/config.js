let host = 'api.ii2d.com';

if(process.env.API_SERVER) {
  host = process.env.API_SERVER
}
export default {
  api_server: `http://${host}/api/v1`,
  is_server: !!process.env.HOME,
};
