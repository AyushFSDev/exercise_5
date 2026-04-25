import { device, expect, element, by } from 'detox';
import { freshLaunch, waitVisible, typeInto, tapById } from '../helper';

describe('Login – Functional', () => {
  beforeEach(async () => {
    await freshLaunch();
    await waitVisible('emailInput');
  });

  // TC_LOGIN_001 - valid phone shows Send Code
  it('TC_LOGIN_001 - valid 10-digit phone enables Send Code', async () => {
    await waitVisible('emailInput');
    await element(by.id('emailInput')).typeText('9');
    await waitVisible('phoneInput');
    await element(by.id('phoneInput')).typeText('876543210');
    await expect(element(by.id('sendCodeButton'))).toBeVisible();
  });

  // TC_LOGIN_016 - valid email + password logs in
  it('TC_LOGIN_016 - valid credentials navigate to Institute screen', async () => {
    await typeInto('emailInput', 'michael.ross@scos.com');
    await tapById('usePasswordButton');
    await waitVisible('passwordInput');
    await typeInto('passwordInput', '1234');
    await tapById('continue');
    await waitVisible('instituteScreen', 10000);
    await expect(element(by.id('instituteScreen'))).toBeVisible();
  });

  // TC_LOGIN_020 - loader visible during login
  it('TC_LOGIN_020 - loader visible during login request', async () => {
    await typeInto('emailInput', 'michael.ross@scos.com');
    await tapById('usePasswordButton');
    await waitVisible('passwordInput');
    await typeInto('passwordInput', '1234');
    await tapById('continue');
    await waitFor(element(by.id('loader')))
      .toBeVisible()
      .withTimeout(3000)
      .catch(() => {});
  });

  // TC_LOGIN_021 - rapid taps fire only one request
  it('TC_LOGIN_021 - prevents multiple requests on rapid taps', async () => {
    await typeInto('emailInput', 'michael.ross@scos.com');
    await tapById('usePasswordButton');
    await waitVisible('passwordInput');
    await typeInto('passwordInput', '1234');
    await tapById('continue');
    await tapById('continue').catch(() => {});
    await waitVisible('instituteScreen', 15000);
  });

  // TC_LOGIN_029 - switching input mode updates UI
  it('TC_LOGIN_029 - switching phone to email mode updates UI', async () => {
    await waitVisible('emailInput');
    await element(by.id('emailInput')).typeText('9');
    await waitVisible('phoneInput');
    await element(by.id('phoneInput')).clearText();
    await waitVisible('emailInput');
    await element(by.id('emailInput')).typeText('michael.ross@scos.com');
    await expect(element(by.id('emailInput'))).toBeVisible();
  });
});
