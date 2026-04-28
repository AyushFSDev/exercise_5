import { device, expect, element, by, waitFor } from 'detox';
import { freshLaunch, waitVisible, goToInstituteScreen } from '../helper';

/**
 * Implementation Notes for UI Components:
 * 1. DashboardScreen: Add testID="dashboardScreen" to the root SafeAreaView.
 * 2. Stat Card: Add testID={`statCard_${stat.id}`} to the individual card Views.
 * 3. User Identity: Add testID="userInitial" to the Avatar/Initials View.
 * 4. Theme Management: Add testID="themeToggle" to the toggle TouchableOpacity.
 */

describe('Dashboard', () => {
  beforeAll(async () => {
    // Initialize the app and navigate through the login/selection flow
    await freshLaunch();
    await goToInstituteScreen();

    // Select the first available institute
    await element(by.id('instituteItem_0')).tap();

    // Handle optional Role Selection screen if it appears
    try {
      await waitVisible('roleSelectScreen', 5000);
      await element(by.id('roleItem_0')).tap();
    } catch (error) {
      // Logic skips if a single role is auto-selected by the backend
    }

    // Ensure the Dashboard is fully loaded before proceeding with tests
    await waitFor(element(by.id('dashboardScreen')))
      .toBeVisible()
      .withTimeout(15000);
    await expect(element(by.id('dashboardScreen'))).toBeVisible();
  });

  // Verify that the main dashboard container renders correctly after login
  it('TC_DASH_001 - dashboard screen loads successfully', async () => {
    await expect(element(by.id('dashboardScreen'))).toBeVisible();
  });

  // Verify that the user identity (avatar or initials) is visible in the header
  it('TC_DASH_002 - user avatar or initial is displayed', async () => {
    await expect(element(by.id('userInitial'))).toBeVisible();
  });

  // Verify that the hardware/software back button does not exit the dashboard to prevent accidental logout
  it('TC_FLOW_002 - back press does not leave dashboard', async () => {
    await device.pressBack();
    // Dashboard should remain the active screen
    await expect(element(by.id('dashboardScreen'))).toBeVisible();
  });
});
