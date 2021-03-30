/* eslint-env node, jasmine */

const { Builder, By } = require('selenium-webdriver');
const fs = require('fs');

let driver;

const args = process.argv.slice(2);
const version = args[1].slice(10);
const playerPath = `dist/abi_player_${version}-dev.html`;
const playerURL = `file:${__dirname}/../../${playerPath}`;

async function loadTestScriptFromFile(filePath) {
  const script = fs.readFileSync(filePath, 'utf8')
    .toString();

  const loadScriptButton = await driver.findElement(By.css('body > div:nth-child(4) > button:nth-child(1)'));
  await loadScriptButton.click();

  const scriptTextArea = await driver.findElement(By.css('body > textarea:nth-child(6)'));
  scriptTextArea.sendKeys(script);

  const okayButton = await driver.findElement(By.css('#loadScriptButtonGroupDiv > button:nth-child(1)'));
  await okayButton.click();
}

describe('abi player', () => {
  console.log('Running tests with player: ', playerPath);

  beforeAll(async done => {
    driver = await new Builder()
      .forBrowser('chrome')
      .build();
    await driver.get(playerURL);
    done();
  });

  // beforeEach(async done => {
  //   await driver.get(playerURL);
  //   done();
  // });

  afterAll(async done => {
    await driver.quit();
    done();
  });

  it('should have player-component element', async done => {
    const playerComponent = await driver.findElement(By.css('player-component'));
    expect(playerComponent).toBeTruthy();
    done();
  });

  it('should load script and render title', async done => {
    await loadTestScriptFromFile('example-units/example-script.voud');

    const titleText = await driver.findElement(By.css(
      'body > player-component > form > div:nth-child(1) > player-sub-form > player-text > h1'
    )).getText();
    expect(titleText).toMatch('Testscript Title');
    done();
  });
});
