import { expect, element, by } from 'detox';
import { freshLaunch, waitVisible, goToInstituteScreen } from '../helper';

describe('Institute – List', () => {
  beforeAll(async () => {
    await freshLaunch();
    await goToInstituteScreen();
  });

  // TC_INST_001 - list loads after login
  it('TC_INST_001 - institute list is visible after login', async () => {
    await expect(element(by.id('instituteScreen'))).toBeVisible();
    await expect(element(by.id('instituteList'))).toBeVisible();
  });

  // TC_INST_004 - selecting institute navigates forward
  it('TC_INST_004 - selecting institute navigates to next screen', async () => {
    await element(by.id('instituteItem_0')).tap();
    // roleSelectScreen or dashboardScreen depending on roles count
    try {
      await waitVisible('roleSelectScreen', 6000);
      await expect(element(by.id('roleSelectScreen'))).toBeVisible();
    } catch {
      await waitVisible('dashboardScreen', 6000);
      await expect(element(by.id('dashboardScreen'))).toBeVisible();
    }
  });
});