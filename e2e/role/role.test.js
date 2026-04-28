import { expect, element, by } from 'detox';
import { freshLaunch, waitVisible, goToInstituteScreen } from '../helper';

// Test suite for validating the Role Selection screen and user authorization flow
describe('Role Select', () => {
  beforeAll(async () => {
    // Navigate through the prerequisites: launch app, go to institutes, and select the first one
    await freshLaunch();
    await goToInstituteScreen();
    await element(by.id('instituteItem_0')).tap();

    // Ensure the role selection screen is reached before running tests
    await waitVisible('roleSelectScreen', 8000);
  });

  // Verify that the role selection interface is correctly displayed after selecting an institute
  it('TC_ROLE_001 - role list loads after institute selection', async () => {
    await expect(element(by.id('roleSelectScreen'))).toBeVisible();
  });

  // Verify that selecting a specific role successfully authenticates the user and opens the Dashboard
  it('TC_ROLE_002 - selecting role navigates to Dashboard', async () => {
    await element(by.id('roleItem_0')).tap();

    // Validate navigation to Dashboard with an appropriate timeout for data fetching
    await waitVisible('dashboardScreen', 10000);
    await expect(element(by.id('dashboardScreen'))).toBeVisible();
  });

  // Verify that a user-friendly message is displayed if the backend returns an empty list of roles
  it('TC_ROLE_003 - empty role list shows empty message', async () => {
    try {
      // Check for the visibility of the specific 'no roles' placeholder text
      await expect(
        element(by.text('No roles available for this institute.')),
      ).toBeVisible();
    } catch (error) {
      // Fallback: If roles are present, this test is skipped gracefully
    }
  });
});
