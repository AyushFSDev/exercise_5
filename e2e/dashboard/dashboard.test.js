import { device, expect, element, by } from 'detox';
import { freshLaunch, waitVisible, goToInstituteScreen } from '../helper';

// NOTE: DashboardScreen SafeAreaView mein add karo:
//   testID="dashboardScreen"
// NOTE: Stat card View mein add karo:
//   testID={`statCard_${stat.id}`}
// NOTE: Avatar/initials View mein add karo:
//   testID="userAvatar"
// NOTE: Theme toggle TouchableOpacity mein add karo:
//   testID="themeToggle"

describe('Dashboard', () => {
  beforeAll(async () => {
    await freshLaunch();
    await goToInstituteScreen();
    await element(by.id('instituteItem_0')).tap();
    // role screen pe ja sakta hai ya seedha dashboard
    try {
          await waitVisible('roleSelectScreen', 5000);
          await element(by.id('roleItem_0')).tap();
        } catch {
          // Single role auto-selected — skip
        }
        await waitFor(element(by.id('dashboardScreen')))
          .toBeVisible()
          .withTimeout(15000);
        await expect(element(by.id('dashboardScreen'))).toBeVisible();
  });

  // TC_DASH_001 - dashboard loads
  it('TC_DASH_001 - dashboard screen loads successfully', async () => {
    await expect(element(by.id('dashboardScreen'))).toBeVisible();
  });

  // TC_DASH_002 - user avatar visible
  it('TC_DASH_002 - user avatar or initial is displayed', async () => {
    await expect(element(by.id('userInitial'))).toBeVisible();
  });

  // TC_DASH_001 extended - back press blocked on dashboard
  it('TC_FLOW_002 - back press does not leave dashboard', async () => {
    await device.pressBack();
    await expect(element(by.id('dashboardScreen'))).toBeVisible();
  });
});