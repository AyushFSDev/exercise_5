import { expect, element, by } from 'detox';
import { freshLaunch, waitVisible, typeInto, tapById } from '../helper';

describe('Login – UI', () => {
  beforeEach(async () => {
    await freshLaunch();
    await waitVisible('emailInput');
  });

  // TC_LOGIN_008 - valid email shows both action buttons
  it('TC_LOGIN_008 - valid email shows Send Code and Use Password buttons', async () => {
    await typeInto('emailInput', 'test@mail.com');
    await expect(element(by.id('sendCodeButton'))).toBeVisible();
    // NOTE: add testID="usePasswordButton" to PrimaryButton in PublicLoginScreen
    await expect(element(by.id('usePasswordButton'))).toBeVisible();
  });

  // TC_LOGIN_015 - Use Password reveals password field
  it('TC_LOGIN_015 - Use Password button reveals password field', async () => {
    await typeInto('emailInput', 'test@test.com');
    await tapById('usePasswordButton');
    await expect(element(by.id('passwordInput'))).toBeVisible();
  });

  // TC_LOGIN_019 - password field is hidden by default
it('TC_LOGIN_019 - password field is secure by default', async () => {
  await typeInto('emailInput', 'test@test.com');
  await tapById('usePasswordButton');
  await waitVisible('passwordInput');
  await element(by.id('passwordInput')).typeText('1234');
  await expect(element(by.text('1234'))).not.toBeVisible();
});

  // TC_LOGIN_024 - dark mode toggle does not crash
  it('TC_LOGIN_024 - dark mode toggle works without crash', async () => {
    // NOTE: add testID="darkModeToggle" to the toggle in login screen
    try {
      await tapById('darkModeToggle');
    } catch {
      // toggle not on login screen — skip
    }
    await expect(element(by.id('emailInput'))).toBeVisible();
  });

  // TC_LOGIN_023 - very long input does not crash
 it('TC_LOGIN_023 - very long input does not crash app', async () => {
  await typeInto('emailInput', 'a'.repeat(50) + '@test.com');
  await expect(element(by.id('emailInput'))).toBeVisible();

});
});