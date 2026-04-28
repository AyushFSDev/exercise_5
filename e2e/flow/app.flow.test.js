import { device, expect, element, by, waitFor } from 'detox';
import { freshLaunch, waitVisible, typeInto, tapById } from '../helper';

// Test suite for end-to-end user navigation flows
describe('Full App Flow', () => {
  // Verify the complete happy path from authentication to the main dashboard
  it('TC_FLOW_001 - Login → Institute → Role → Dashboard', async () => {
    // Initial app launch and setup
    await freshLaunch();
    await waitVisible('emailInput', 12000);

    // Perform authentication using email and password
    await typeInto('emailInput', 'michael.ross@scos.com');
    await tapById('usePasswordButton');
    await waitVisible('passwordInput');
    await typeInto('passwordInput', '1234');
    await tapById('continue');

    // Handle Institute Selection: Logic may skip this screen if only one institute is available
    try {
      await waitVisible('instituteScreen', 10000);
      await element(by.id('instituteItem_0')).tap();
    } catch (error) {
      // Single institute auto-selected by the backend; continue to next step
    }

    // Handle Role Selection: Logic may skip this screen if the user has only one assigned role
    try {
      await waitVisible('roleSelectScreen', 5000);
      await element(by.id('roleItem_0')).tap();
    } catch (error) {
      // Single role auto-selected; proceed to Dashboard
    }

    // Final Assertion: Verify the user has successfully reached the Dashboard
    await waitFor(element(by.id('dashboardScreen')))
      .toBeVisible()
      .withTimeout(15000);
    await expect(element(by.id('dashboardScreen'))).toBeVisible();
  });

  // Verify that navigation stack prevents the user from accidentally returning to Login from Dashboard
  it('TC_FLOW_002 - back press on Dashboard does not go to Login', async () => {
    // Ensure the Dashboard is the current active screen
    await waitFor(element(by.id('dashboardScreen')))
      .toBeVisible()
      .withTimeout(10000);

    // Simulate a hardware or system back button press
    await device.pressBack();

    // Assert that the user remains on the Dashboard (back navigation should be blocked)
    await expect(element(by.id('dashboardScreen'))).toBeVisible();
  });
});
