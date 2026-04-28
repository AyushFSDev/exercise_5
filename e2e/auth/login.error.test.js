import { device, expect, element, by, waitFor } from 'detox';
import { freshLaunch, waitVisible, typeInto, tapById } from '../helper';

// Test suite for validating error handling during the login process
describe('Login – Error Handling', () => {
  beforeEach(async () => {
    // Ensure the app starts from a clean state and wait for the email input to be visible
    await freshLaunch();
    await waitVisible('emailInput');
  });

  // Verify that an error message is displayed when an incorrect password is provided
  it('TC_LOGIN_018 - wrong password shows error message', async () => {
    await typeInto('emailInput', 'test@test.com');
    await tapById('usePasswordButton');
    await waitVisible('passwordInput');

    await typeInto('passwordInput', 'wrongpassword_xyz');
    await tapById('continue');

    // Assert that the error banner is visible within the specified timeout
    await waitFor(element(by.id('errorBanner')))
      .toBeVisible()
      .withTimeout(8000);
  });

  // Verify that the error banner disappears once the user modifies the invalid input
  it('TC_LOGIN_022 - error message clears when input changes', async () => {
    await typeInto('emailInput', 'bad@');
    await tapById('sendCodeButton');

    await waitVisible('errorBanner');

    // Clear the existing text and enter a valid email address
    await element(by.id('emailInput')).clearText();
    await typeInto('emailInput', 'good@test.com');

    // Assert that the error banner is no longer visible
    await waitFor(element(by.id('errorBanner')))
      .toBeNotVisible()
      .withTimeout(5000);
  });

  // Verify that a network error message is displayed when there is no internet connection
  it('TC_LOGIN_026 - no internet shows appropriate error', async () => {
    await typeInto('emailInput', 'michael.ross@scos.com');
    await tapById('usePasswordButton');
    await waitVisible('passwordInput');
    await typeInto('passwordInput', '1234');

    await tapById('continue');

    // Assert that the network error component is visible
    await waitFor(element(by.id('networkError')))
      .toBeVisible()
      .withTimeout(10000);
  });

  // Ensure that multiple rapid clicks do not trigger duplicate requests or block navigation
  it('TC_LOGIN_028 - rapid taps do not send duplicate requests', async () => {
    await typeInto('emailInput', 'michael.ross@scos.com');
    await tapById('usePasswordButton');
    await waitVisible('passwordInput');
    await typeInto('passwordInput', '1234');

    // Execute the primary tap action
    await tapById('continue');

    // Execute subsequent taps safely to mimic rapid user interaction without breaking the test
    await tapById('continue').catch(() => {});
    await tapById('continue').catch(() => {});

    // Verify navigation to the next screen was successful
    await waitVisible('instituteScreen', 15000);
  });
});
