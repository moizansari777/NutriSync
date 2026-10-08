/* eslint-disable no-undef */
describe("Auth", () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: { camera: "YES", microphone: "YES" },
    });
  });

  it("should wait for splash screen and show login screen", async () => {
    await expect(element(by.id("splash_logo"))).toBeVisible();

    await waitFor(element(by.id("login_screen")))
      .toBeVisible()
      .withTimeout(4000);

    await element(by.id("go_to_signup_id")).tap();
    await expect(element(by.id("signup_screen"))).toBeVisible();
  });

  // it("should signup successfully", async () => {
  //   await element(by.id("signup_name_id")).tap();
  //   await element(by.id("signup_name_id")).typeText("abcd2");

  //   await element(by.id("signup_email_id")).tap();
  //   await element(by.id("signup_email_id")).typeText("abcd2@gmail.com");

  //   // Hide keyboard if needed (iOS sometimes)
  //   await device.pressBack(); // For Android

  //   // await element(by.id("signup_password_id")).tap();
  //   // await element(by.id("signup_password_id")).typeText("Adil@1234");

  //   await element(by.id("signup_button_id")).tap();
  // });

  // it("should goal saved successfully", async () => {
  //   await expect(element(by.id("goal_screen"))).toBeVisible();

  //   await element(by.id("lose_fat_id")).tap();

  //   await element(by.id("goal_button_id")).tap();
  // });

  it("should login successfully", async () => {
    await element(by.id("already_account_id")).tap();
    await element(by.id("email_id")).tap();
    await element(by.id("email_id")).typeText("abcd2@gmail.com");

    // Hide keyboard if needed (iOS sometimes)
    await device.pressBack(); // For Android

    await element(by.id("password_id")).tap();
    await element(by.id("password_id")).typeText("Adil@1234");

    await element(by.id("login_button_id")).tap();
  });

  it("should logout successfully", async () => {
    await element(by.text("Chat/Voice")).tap();
    await expect(element(by.id("chat_screen"))).toBeVisible();

    await waitFor(element(by.id("menu_button_id")))
      .toBeVisible()
      .whileElement(by.id("chat_screen"));
    await element(by.id("menu_button_id")).tap({ x: 5, y: 5 });

    await expect(element(by.id("setting_screen_id"))).toBeVisible();
    await element(by.text("Logout")).tap();
    await element(by.text("Yes")).tap();
  });

  afterAll(async () => {
    await device.terminateApp();
  });
});
