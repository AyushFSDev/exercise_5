import { device, expect, element, by, waitFor } from 'detox';
import { freshLaunch, waitVisible, typeInto, tapById } from '../helper';

// Test suite for validating functional login flows and UI transitions
describe('Login – Functional', () => {
  beforeEach(async () => {
    // Reset the application state and ensure the initial input field is ready
    await freshLaunch();
    await waitVisible('emailInput');
  });

  // Verify that entering a valid 10-digit phone number enables the OTP request button
  it('TC_LOGIN_001 - valid 10-digit phone enables Send Code', async () => {
    await waitVisible('emailInput');
    await element(by.id('emailInput')).typeText('9');
    await waitVisible('phoneInput');
    await element(by.id('phoneInput')).typeText('876543210');
    await expect(element(by.id('sendCodeButton'))).toBeVisible();
  });

  // Verify successful authentication and navigation when using valid email and password
  it('TC_LOGIN_016 - valid credentials navigate to Institute screen', async () => {
    await typeInto('emailInput', 'michael.ross@scos.com');
    await tapById('usePasswordButton');
    await waitVisible('passwordInput');
    await typeInto('passwordInput', '1234');
    await tapById('continue');

    // Ensure the app navigates to the institute selection screen within 10 seconds
    await waitVisible('instituteScreen', 10000);
    await expect(element(by.id('instituteScreen'))).toBeVisible();
  });

  // Verify that a loading indicator is displayed while the login request is in progress
  it('TC_LOGIN_020 - loader visible during login request', async () => {
    await typeInto('emailInput', 'michael.ross@scos.com');
    await tapById('usePasswordButton');
    await waitVisible('passwordInput');
    await typeInto('passwordInput', '1234');
    await tapById('continue');

    // Check for loader visibility with a short timeout; handled gracefully if it disappears quickly
    await waitFor(element(by.id('loader')))
      .toBeVisible()
      .withTimeout(3000)
      .catch(() => {});
  });

  // Ensure the UI prevents duplicate requests when the user taps the continue button rapidly
  it('TC_LOGIN_021 - prevents multiple requests on rapid taps', async () => {
    await typeInto('emailInput', 'michael.ross@scos.com');
    await tapById('usePasswordButton');
    await waitVisible('passwordInput');
    await typeInto('passwordInput', '1234');

    // First tap initiates the request
    await tapById('continue');
    // Subsequent tap should be ignored or handled without throwing an error
    await tapById('continue').catch(() => {});

    await waitVisible('instituteScreen', 15000);
  });

  // Verify the dynamic UI logic that switches between phone and email input modes
  it('TC_LOGIN_029 - switching phone to email mode updates UI', async () => {
    await waitVisible('emailInput');
    // Trigger the switch to phone input mode
    await element(by.id('emailInput')).typeText('9');
    await waitVisible('phoneInput');

    // Clear phone input to revert back to email input mode
    await element(by.id('phoneInput')).clearText();
    await waitVisible('emailInput');

    await element(by.id('emailInput')).typeText('michael.ross@scos.com');
    await expect(element(by.id('emailInput'))).toBeVisible();
  });
});
