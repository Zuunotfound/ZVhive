import { createApp } from './app';

const app = createApp();
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('API listening on :' + port);
});
