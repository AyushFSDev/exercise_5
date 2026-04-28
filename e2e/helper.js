import { device, waitFor, element, by } from 'detox';

// ─── Launch Helpers ──────────────────────────────────────────────────────────

// Performs a complete fresh install by deleting the app and clearing all local data
export const freshLaunch = async () => {
  await device.launchApp({ newInstance: true, delete: true });
};

// Restarts the application while preserving the existing local storage and session tokens
export const relaunch = async () => {
  await device.launchApp({ newInstance: true });
};

// ─── Wait / Interaction Helpers ──────────────────────────────────────────────

// Polls for an element with a specific testID until it becomes visible or the timeout is reached
export const waitVisible = (id, timeout = 8000) =>
  waitFor(element(by.id(id)))
    .toBeVisible()
    .withTimeout(timeout);

// Polls for an element containing specific text until it becomes visible
export const waitVisibleText = (text, timeout = 8000) =>
  waitFor(element(by.text(text)))
    .toBeVisible()
    .withTimeout(timeout);

// Ensures an element is visible before performing a tap action
export const tapById = async id => {
  await waitVisible(id);
  await element(by.id(id)).tap();
};

// Clears existing input and types new text into a field identified by testID
export const typeInto = async (id, text) => {
  await waitVisible(id);
  await element(by.id(id)).clearText();
  await element(by.id(id)).typeText(text);
};

// ─── Navigation Helpers ──────────────────────────────────────────────────────

// Navigates the app to the initial Login state and waits for the email field
export const goToLogin = async () => {
  await waitVisible('emailInput', 12000);
};

// Automated workflow to handle the full email/password authentication process
export const loginWithPassword = async (
  email = 'michael.ross@scos.com',
  password = '1234',
) => {
  await goToLogin();
  await typeInto('emailInput', email);

  // Requirement: Ensure testID="usePasswordButton" is applied to the button in PublicLoginScreen
  await tapById('usePasswordButton');

  await waitVisible('passwordInput');
  await typeInto('passwordInput', password);
  await tapById('continue');
};

// High-level helper to bypass authentication and arrive at the Institute selection screen
export const goToInstituteScreen = async () => {
  await loginWithPassword();
  await waitVisible('instituteScreen', 10000);
};
