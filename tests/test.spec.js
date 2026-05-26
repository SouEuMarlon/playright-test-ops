const {test} = require('@playwright/test');

test('My portfolio', async ({page}) => {
  await page.goto('https://marlonmenezes.dev');
  await page.screenshot({path: 'marlonmenezes-dev.png'});
});