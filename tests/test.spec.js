require('dotenv').config();
const {test} = require('@playwright/test');

test.describe('Auth test', () => {
  test('Login test', async ({page}) => {
    await authenticate(page);
  });
});

async function authenticate(page){
  await page.goto('https://bitheap.tech');
  const isLoggedIn = page.locator('css=#menu-item-2330 > a').count() > 0;
  if(isLoggedIn){
    const text = await page.locator('css=#menu-item-2330 > a').textContent();
    if(text === "Hello, Marlon"){
      console.log("Already authenticated");
      return;
    }
  }
  await page.click('#menu-item-2330');
  await page.locator("[name='xoo-el-username']").fill(process.env.USERNAME);
  await page.locator("[name='xoo-el-password']").fill(process.env.PASSWORD);
  await page.locator("xpath=/html/body/div[8]/div[2]/div/div/div[2]/div/div/div[2]/div/form/button").click();

  await page.waitForURL('https://bitheap.tech/?login=success');

  const textAfter = await page.locator('css=#menu-item-2333 > a').textContent();
  if(textAfter != "Hello, Marlon"){
    console.error("Authentication failed");
  }

  await page.screenshot({path: 'auth-screenshot.png'});
}