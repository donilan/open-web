let host = 'api.ii2d.com';

if(process.env.API_HOST) {
  host = process.env.API_HOST
}
export default {
  api_server: `http://${host}/api/v1`,
  is_server: !!process.env.HOME,
};
