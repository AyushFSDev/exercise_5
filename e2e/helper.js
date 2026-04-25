import { device, waitFor, element, by } from 'detox';

// ─── Launch Helpers ──────────────────────────────────────────────────────────

export const freshLaunch = async () => {
  await device.launchApp({ newInstance: true, delete: true });
};

export const relaunch = async () => {
  await device.launchApp({ newInstance: true });
};

// ─── Wait / Interaction Helpers ──────────────────────────────────────────────

export const waitVisible = (id, timeout = 8000) =>
  waitFor(element(by.id(id))).toBeVisible().withTimeout(timeout);

export const waitVisibleText = (text, timeout = 8000) =>
  waitFor(element(by.text(text))).toBeVisible().withTimeout(timeout);

export const tapById = async id => {
  await waitVisible(id);
  await element(by.id(id)).tap();
};

export const typeInto = async (id, text) => {
  await waitVisible(id);
  await element(by.id(id)).clearText();
  await element(by.id(id)).typeText(text);
};

// ─── Navigation Helpers ──────────────────────────────────────────────────────

export const goToLogin = async () => {
  await waitVisible('emailInput', 12000);
};

export const loginWithPassword = async (
  email = 'michael.ross@scos.com',
  password = '1234',
) => {
  await goToLogin();
  await typeInto('emailInput', email);
  await tapById('usePasswordButton'); // add testID in PublicLoginScreen
  await waitVisible('passwordInput');
  await typeInto('passwordInput', password);
  await tapById('continue');
};

export const goToInstituteScreen = async () => {
  await loginWithPassword();
  await waitVisible('instituteScreen', 10000);
};