require('dotenv').config();
const {test} = require('@playwright/test');

test.describe('Shop test', () => {
  test('Add to cart test', async ({page}) => {

    await authenticate(page);
    await shop(page);
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

async function shop(page){
  await page.locator('css=#menu-item-1310 > a').click();
  // verificar se carrinho tem item

  const cartCount = await page.locator('css=body > nav > div.wb4wp-wrapper > div.wb4wp-right > div > a > span').textContent();
  if(cartCount != "0"){
    await page.goto('https://bitheap.tech/cart/');
    await page.locator('xpath=//*[@id="post-206"]/content/div/div[1]/form/table/tbody/tr[1]/td[1]/a').click();
    await page.locator('xpath=//*[@id="post-206"]/content/div/div[1]/p/a').click();
  }

  await page.locator('xpath=//*[@id="main"]/nav/ul/li[2]/a').click();
  await page.locator('xpath=//*[@id="main"]/ul/li[15]/a[2]').click();
  await page.locator('xpath=/html/body/nav/div[1]/div[3]/div/a').click();

  const pageCartUrl = await page.url();
  if(pageCartUrl != "https://bitheap.tech/cart/"){
    console.error("Shop test failed");
  }
  await page.screenshot({path: 'shop-cart-screenshot.png'});

  await page.locator('xpath=//*[@id="post-206"]/content/div/div[1]/div[2]/div/div/a').click();

  // página de checkout
  const pageCheckoutUrl = await page.url();
  if(pageCheckoutUrl != "https://bitheap.tech/checkout/"){
    console.error("Shop test failed");
  }

  await page.locator('xpath=//*[@id="billing_first_name"]').click();
  await page.locator('xpath=//*[@id="billing_first_name"]').fill("Marlon");
  await page.locator('xpath=//*[@id="billing_last_name"]').click();
  await page.locator('xpath=//*[@id="billing_last_name"]').fill("Menezes");
  await page.locator('css=#select2-billing_country-container').click();
  await page.locator('css=body > span > span > span.select2-search.select2-search--dropdown > input').click();
  await page.locator('css=body > span > span > span.select2-search.select2-search--dropdown > input').fill("Brazil");
  await page.locator('css=#select2-billing_country-results').click();
  await page.locator('xpath=//*[@id="billing_address_1"]').click();
  await page.locator('xpath=//*[@id="billing_address_1"]').fill("Rodovia Anel Rodoviário Celso Mello Azevedo");
  await page.locator('xpath=//*[@id="billing_city"]').click();
  await page.locator('xpath=//*[@id="billing_city"]').fill("Belo Horizonte");
  await page.locator('xpath=//*[@id="select2-billing_state-container"]').click();
  await page.locator('xpath=/html/body/span/span/span[1]/input').click();
  await page.locator('xpath=/html/body/span/span/span[1]/input').fill("Minas Gerais");
  await page.locator('css=#select2-billing_state-results').click();
  await page.locator('xpath=//*[@id="billing_postcode"]').click();
  await page.locator('xpath=//*[@id="billing_postcode"]').fill("31990-055");
  await page.locator('xpath=//*[@id="billing_email"]').click();
  await page.locator('xpath=//*[@id="billing_email"]').fill("marlusher@gmail.com");
  await page.screenshot({path: 'shop-checkout-screenshot.png'});
  await page.locator('xpath=//*[@id="place_order"]').click();
  await page.waitForURL('https://bitheap.tech/checkout/order-received/**');
  await page.screenshot({path: 'shop-checkout-confirmation-screenshot.png'});
}