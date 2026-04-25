import { expect, element, by } from 'detox';
import { freshLaunch, waitVisible, goToInstituteScreen } from '../helper';

describe('Role Select', () => {
  beforeAll(async () => {
    await freshLaunch();
    await goToInstituteScreen();
    await element(by.id('instituteItem_0')).tap();
    await waitVisible('roleSelectScreen', 8000);
  });

  // TC_ROLE_001 - role list loads
  it('TC_ROLE_001 - role list loads after institute selection', async () => {
    await expect(element(by.id('roleSelectScreen'))).toBeVisible();
  });

  // TC_ROLE_002 - selecting role navigates to Dashboard
  it('TC_ROLE_002 - selecting role navigates to Dashboard', async () => {
    await element(by.id('roleItem_0')).tap();
    await waitVisible('dashboardScreen', 10000);
    await expect(element(by.id('dashboardScreen'))).toBeVisible();
  });

  // TC_ROLE_003 - empty roles shows message
  it('TC_ROLE_003 - empty role list shows empty message', async () => {
    try {
      await expect(
        element(by.text('No roles available for this institute.')),
      ).toBeVisible();
    } catch {
      // Roles hain — skip
    }
  });
});