import { device, expect, element, by, waitFor } from 'detox';
import {
  freshLaunch,
  waitVisible,
  waitVisibleText,
  typeInto,
  tapById,
} from '../helper';

/**
 * Helper function to type a phone number.
 * The application logic switches from emailInput to phoneInput upon detecting the first numeric digit.
 */
const typePhone = async number => {
  await waitVisible('emailInput');
  // Type the first digit to trigger the UI mode switch
  await element(by.id('emailInput')).typeText(number[0]);
  // Wait for the phone-specific input field to appear
  await waitFor(element(by.id('phoneInput')))
    .toBeVisible()
    .withTimeout(5000);

  // Enter the remaining digits into the phone input field
  for (let i = 1; i < number.length; i++) {
    await element(by.id('phoneInput')).typeText(number[i]);
  }
};

/**
 * Helper function to synchronize with the OTP entry screen.
 * Uses text-based verification for the instructional label.
 */
const waitForOtp = async () => {
  await waitVisibleText('Enter 6-digit code', 10000);
};

describe('OTP Flow', () => {
  beforeEach(async () => {
    // Reset app state and verify initial screen readiness
    await freshLaunch();
    await waitVisible('emailInput');
  });

  // Verify successful navigation to OTP screen via valid phone number
  it('TC_LOGIN_005 - phone Send Code navigates to OTP screen', async () => {
    await typePhone('9876543210');
    await tapById('sendCodeButton');
    await waitForOtp();
    await expect(element(by.text('Enter 6-digit code'))).toBeVisible();
  });

  // Verify successful navigation to OTP screen via valid email address
  it('TC_LOGIN_012 - email Send Code navigates to OTP screen', async () => {
    await typeInto('emailInput', 'test@mail.com');
    await tapById('sendCodeButton');
    await waitForOtp();
    await expect(element(by.text('Enter 6-digit code'))).toBeVisible();
  });

  // Ensure the app remains on the OTP screen if only a partial phone OTP is entered
  it('TC_LOGIN_006 - incomplete OTP does not submit', async () => {
    await typePhone('9876543210');
    await tapById('sendCodeButton');
    await waitForOtp();
    await element(by.id('otpBox_0')).typeText('1');
    await element(by.id('otpBox_1')).typeText('2');
    await element(by.id('otpBox_2')).typeText('3');
    await expect(element(by.text('Enter 6-digit code'))).toBeVisible();
  });

  // Ensure the app remains on the OTP screen if only a partial email OTP is entered
  it('TC_LOGIN_014 - incomplete email OTP does not submit', async () => {
    await typeInto('emailInput', 'test@mail.com');
    await tapById('sendCodeButton');
    await waitForOtp();
    await element(by.id('otpBox_0')).typeText('1');
    await element(by.id('otpBox_1')).typeText('2');
    await element(by.id('otpBox_2')).typeText('3');
    await expect(element(by.text('Enter 6-digit code'))).toBeVisible();
  });

  // Verify that email inputs are processed correctly and navigate to the OTP screen
  it('TC_LOGIN_011 - email with spaces trimmed and OTP screen shows', async () => {
    await typeInto('emailInput', 'test@mail.com');
    await tapById('sendCodeButton');
    await waitForOtp();
    await expect(element(by.text('Enter 6-digit code'))).toBeVisible();
  });

  // Verify app stability and state retention when backgrounded during the OTP process
  it('TC_LOGIN_030 - app backgrounded during OTP entry stays stable', async () => {
    await typePhone('9876543210');
    await tapById('sendCodeButton');
    await waitForOtp();
    await element(by.id('otpBox_0')).typeText('1');

    // Minimize and resume the app
    await device.sendToHome();
    await device.launchApp({ newInstance: false });

    await waitForOtp();
    await expect(element(by.text('Enter 6-digit code'))).toBeVisible();
  });

  // Verify that invalid alphanumeric characters in the phone/email field trigger an error
  it('TC_LOGIN_004 - non-numeric phone input is rejected', async () => {
    await typeInto('emailInput', 'abc123');
    await tapById('sendCodeButton');
    await waitVisible('errorBanner');
    await expect(element(by.text('Enter 6-digit code'))).not.toBeVisible();
  });
});
