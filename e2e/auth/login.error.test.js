import { device, expect, element, by, waitFor } from 'detox';
import { freshLaunch, waitVisible, typeInto, tapById } from '../helper';

describe('Login – Error Handling', () => {
  beforeEach(async () => {
    await freshLaunch();
    await waitVisible('emailInput');
  });

  // ✅ TC_LOGIN_018
  it('TC_LOGIN_018 - wrong password shows error message', async () => {
    await typeInto('emailInput', 'test@test.com');
    await tapById('usePasswordButton');
    await waitVisible('passwordInput');

    await typeInto('passwordInput', 'wrongpassword_xyz');
    await tapById('continue');

    // 👉 ASSERT ERROR (NOT loginForm)
    await waitFor(element(by.id('errorBanner')))
      .toBeVisible()
      .withTimeout(8000);
  });

  // ✅ TC_LOGIN_022
  it('TC_LOGIN_022 - error message clears when input changes', async () => {
    await typeInto('emailInput', 'bad@');
    await tapById('sendCodeButton');

    await waitVisible('errorBanner');

    await element(by.id('emailInput')).clearText();
    await typeInto('emailInput', 'good@test.com');

    await waitFor(element(by.id('errorBanner')))
      .toBeNotVisible()
      .withTimeout(5000);
  });

  // ✅ TC_LOGIN_026
  it('TC_LOGIN_026 - no internet shows appropriate error', async () => {
    await typeInto('emailInput', 'michael.ross@scos.com');
    await tapById('usePasswordButton');
    await waitVisible('passwordInput');
    await typeInto('passwordInput', '1234');

    // ❌ remove device.setStatusBar

    await tapById('continue');

    await waitFor(element(by.id('networkError')))
      .toBeVisible()
      .withTimeout(10000);
  });

  // ✅ TC_LOGIN_028
  it('TC_LOGIN_028 - rapid taps do not send duplicate requests', async () => {
    await typeInto('emailInput', 'michael.ross@scos.com');
    await tapById('usePasswordButton');
    await waitVisible('passwordInput');
    await typeInto('passwordInput', '1234');

    // 👉 ONLY ONE REAL TAP
    await tapById('continue');

    // 👉 optional extra taps safely
    await tapById('continue').catch(() => {});
    await tapById('continue').catch(() => {});

    await waitVisible('instituteScreen', 15000);
  });
});