import { expect, element, by } from 'detox';
import { freshLaunch, waitVisible, goToInstituteScreen } from '../helper';

// Test suite for validating the Institute selection screen and navigation logic
describe('Institute – List', () => {
  beforeAll(async () => {
    // Perform initial setup and navigate to the institute selection screen once
    await freshLaunch();
    await goToInstituteScreen();
  });

  // Verify that the institute selection screen and the list of institutes render correctly
  it('TC_INST_001 - institute list is visible after login', async () => {
    await expect(element(by.id('instituteScreen'))).toBeVisible();
    await expect(element(by.id('instituteList'))).toBeVisible();
  });

  // Verify that selecting an institute navigates the user to the next logical step in the flow
  it('TC_INST_004 - selecting institute navigates to next screen', async () => {
    // Select the first institute from the list
    await element(by.id('instituteItem_0')).tap();

    /**
     * Navigation Logic:
     * If the user has multiple roles, they should see the 'roleSelectScreen'.
     * If the user has only one role, the app should navigate directly to the 'dashboardScreen'.
     */
    try {
      await waitVisible('roleSelectScreen', 6000);
      await expect(element(by.id('roleSelectScreen'))).toBeVisible();
    } catch (error) {
      // Fallback: Check if the app navigated directly to the dashboard
      await waitVisible('dashboardScreen', 6000);
      await expect(element(by.id('dashboardScreen'))).toBeVisible();
    }
  });
});
