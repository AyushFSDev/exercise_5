import { device, expect, element, by } from 'detox';
import {
  freshLaunch,
  relaunch,
  waitVisible,
  typeInto,
  tapById,
} from '../helper';

// Test suite to verify user session persistence and authentication redirection
describe('Session Handling', () => {
  // Verify that an active user session is maintained even after the app process is restarted
  it('TC_SESSION_001 - session persists after app restart', async () => {
    // Initial login and navigation setup
    await freshLaunch();
    await waitVisible('emailInput', 12000);
    await typeInto('emailInput', 'michael.ross@scos.com');
    await tapById('usePasswordButton');
    await waitVisible('passwordInput');
    await typeInto('passwordInput', '1234');
    await tapById('continue');

    // Navigate through institute selection
    await waitVisible('instituteScreen', 10000);
    await element(by.id('instituteItem_0')).tap();

    // Handle optional Role Selection if applicable
    try {
      await waitVisible('roleSelectScreen', 5000);
      await element(by.id('roleItem_0')).tap();
    } catch (error) {
      // Logic skips if only one role exists
    }
    await waitVisible('dashboardScreen', 10000);

    // Restart the application without clearing local storage/tokens
    await relaunch();

    /**
     * Assertion Logic:
     * After relaunch, the user should be automatically redirected to the last state
     * (Dashboard, Role, or Institute) and should NOT be sent back to the Login screen.
     */
    try {
      await waitVisible('dashboardScreen', 10000);
      await expect(element(by.id('dashboardScreen'))).toBeVisible();
    } catch (error) {
      try {
        await waitVisible('roleSelectScreen', 5000);
        await expect(element(by.id('roleSelectScreen'))).toBeVisible();
      } catch (err) {
        await waitVisible('instituteScreen', 5000);
        await expect(element(by.id('instituteScreen'))).toBeVisible();
      }
    }
  });

  // Verify that a "Fresh Launch" (which clears local data) correctly redirects to the Login screen
  it('TC_SESSION_002 - fresh launch without token redirects to Login', async () => {
    // freshLaunch helper resets the app sandbox
    await freshLaunch();
    await waitVisible('emailInput', 12000);
    await expect(element(by.id('emailInput'))).toBeVisible();
  });
});
