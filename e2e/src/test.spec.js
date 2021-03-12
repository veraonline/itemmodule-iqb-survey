require('selenium-webdriver');
const { Builder, By } = require("selenium-webdriver");

let driver;


const playerPath = 'file:' + __dirname + '/../../dist/abi_player_3.1.2-dev.html';

describe('abi player', () => {

  beforeAll(async done => {
    driver = await new Builder()
      .forBrowser('chrome')
      .build();
    done();
  });

  beforeEach(async done => {
    await driver.get(playerPath);
    done();
  });

  afterAll(async done => {
    await driver.quit();
    done();
  });

  it('should render title', async done => {
    const playerComponent = await driver.findElement(By.css('player-component'));
    expect(playerComponent).toBeTruthy();
    done();
  });
});
