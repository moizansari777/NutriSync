import { TDEEHistoryProps } from "../schemas/types";

export enum screens {
  // Main Stack
  MAIN_SCREEN_STACK = "main_screen_stack",
  AUTH_SCREEN_STACK = "auth_screen_stack",
  BOTTOM_TAB_STACK = "bottom_tab_stack",

  // Auth Stack
  SPLASH_SCREEN = "splash_screen",
  ONBOARDING_SCREEN = "onboarding_screen",
  INFO_STEPS_SCREEN = "info_steps_screen",
  LOGIN_SCREEN = "login_screen",
  SIGNUP_SCREEN = "signup_screen",
  FORGOT_PASSWORD_SCREEN = "forgot_password_screen",
  VERIFICATION_SCREEN = "verification_screen",
  CREATE_PASSWORD_SCREEN = "create_password_screen",
  VERIFY_BY_PASSWORD_SCREEN = "verify_by_password_screen",

  // Dashboard Stack
  CHAT_SCREEN = "chat_screen",
  HISTORY_SCREEN = "history_screen",
  ACCOUNTS_SCREEN = "accounts_screen",
  SETTING_SCREEN = "setting_screen",
  LIBRARY_SCREEN = "library_screen",
  VISION_CAMERA_SCREEN = "vision_camera_screen",
  RESET_PASSWORD_SCREEN = "reset_password_screen",
  GOALS_SCREEN = "goals_screen",
  SELECT_COUNTRY_SCREEN = "select_country_screen",
  PERSONAL_DETAILS_SCREEN = "personal_details_screen",
  WEB_VIEW_URL_SCREEN = "web_view_url_screen",
  PREVIEW_FULL_IMAGE_SCREEN = "preview_full_image_screen",
  REFERRALS_SCREEN = "referrals_screen",
  QUICK_STATS_SCREEN = "quick_stats_screen",
  MY_REFERRALS_SCREEN = "my_referrals_screen",
  MANAGE_TEXT_SIZE_SCREEN = "manage_text_size_screen",
  ACCOUNT_SETTING_SCREEN = "account_setting_screen",
  SEND_FEEDBACK_SCREEN = "send_feedback_screen",

  // Affiliate
  AFFILIATE_LOGIN_SCREEN = "affiliate_login_screen",
  AFFILIATE_REFERRALS_SCREEN = "affiliate_referrals_screen",
  AFFILIATE_STATS_SCREEN = "affiliate_stats_screen",
  AFFILIATE_REFERRALS_LIST_SCREEN = "affiliate_referrals_list_screen",
  AFFILIATE_ACCOUNTS_SCREEN = "affiliate_accounts_screen",
  AFFILIATE_SETTING_SCREEN = "affiliate_setting_screen",
  HOME_COACH_SCREEN = "home_coach_screen",
  CLIENT_COACH_SCREEN = "client_coach_screen",
  CLIENT_DETAILS_SCREEN = "client_details_screen",
  CLIENT_NOTES_SCREEN = "client_notes_screen",
  CLIENT_FOOD_LOGGED_SCREEN = "client_food_logged_screen",
  CLIENT_EMAIL_SCREEN = "client_email_screen",

  // Log
  LOG_TDEE_ROOT_SCREEN = "log_tdee_root_screen",
  SAVED_MEALS_TAB = "saved_meals_tab",
  HISTORY_TAB = "history_tab",
  LOG_TDEE_SCREEN = "log_tdee_screen",
  QUICK_ADD_TDEE_SCREEN = "quick_add_tdee_screen",
  HISTORY_TDEE_SCREEN = "history_tdee_screen",
  TDEE_CALCULATION_SCREEN = "tdee_calculation_screen",
  ADD_CUSTOM_MACROS_SCREEN = "add_custom_macros_screen",
  QUICK_ADD_SCREEN = "quick_add_screen",

  // Shared Access with Friends
  CONTACTS_LIST_SCREEN = "contacts_list_screen",
  PENDING_REQUESTS_LIST_SCREEN = "pending_requests_list_screen",
  SHARED_DASHBOARD_SCREEN = "shared_dashboard_screen",
  SHARED_FOOD_LOGGED_SCREEN = "shared_food_logged_screen",
}

export type RootStackParamList = {
  // Main Stack
  [screens.MAIN_SCREEN_STACK]: any;
  [screens.AUTH_SCREEN_STACK]: undefined;
  [screens.BOTTOM_TAB_STACK]: any;

  // Auth Stack
  [screens.SPLASH_SCREEN]: undefined;
  [screens.ONBOARDING_SCREEN]: undefined;
  [screens.INFO_STEPS_SCREEN]: undefined;
  [screens.LOGIN_SCREEN]: undefined;
  [screens.SIGNUP_SCREEN]: undefined;
  [screens.FORGOT_PASSWORD_SCREEN]: undefined;
  [screens.VERIFICATION_SCREEN]: {
    email: string;
    params?: any;
  };
  [screens.CREATE_PASSWORD_SCREEN]: {
    email: string;
    otp: string;
    params?: any;
  };
  [screens.VERIFY_BY_PASSWORD_SCREEN]: undefined;

  // Dashboard Stack
  [screens.CHAT_SCREEN]:
    | {
        conversationId?: string | undefined;
        isStarred?: string | undefined;
        params?: any;
      }
    | any;
  [screens.HISTORY_SCREEN]: undefined;
  [screens.ACCOUNTS_SCREEN]: undefined;
  [screens.LIBRARY_SCREEN]: any;
  [screens.VISION_CAMERA_SCREEN]:
    | {
        from?: string | undefined;
        params?: any;
      }
    | any;
  [screens.SETTING_SCREEN]: undefined;
  [screens.SEND_FEEDBACK_SCREEN]: undefined;
  [screens.SELECT_COUNTRY_SCREEN]: {
    isSelectionOutSide?: boolean;
    params?: any;
  };
  [screens.RESET_PASSWORD_SCREEN]: undefined;
  [screens.REFERRALS_SCREEN]: undefined;
  [screens.MY_REFERRALS_SCREEN]: undefined;
  [screens.MANAGE_TEXT_SIZE_SCREEN]: undefined;
  [screens.ACCOUNT_SETTING_SCREEN]: undefined;
  [screens.HOME_COACH_SCREEN]: undefined;
  [screens.CLIENT_COACH_SCREEN]: undefined;
  [screens.CLIENT_DETAILS_SCREEN]: {
    clientName: string;
    clientId: number;
    params?: any;
  };
  [screens.CLIENT_NOTES_SCREEN]: {
    clientId: number;
    params?: any;
  };
  [screens.CLIENT_FOOD_LOGGED_SCREEN]: {
    clientId: number;
    params?: any;
  };
  [screens.CLIENT_EMAIL_SCREEN]: {
    clientId: number;
    params?: any;
  };
  [screens.QUICK_STATS_SCREEN]: undefined;
  [screens.GOALS_SCREEN]: {
    hasBack?: boolean;
    params?: any;
  };
  [screens.PERSONAL_DETAILS_SCREEN]: {
    hasBack?: boolean;
    params?: any;
  };
  [screens.WEB_VIEW_URL_SCREEN]: {
    URL: string;
    title: string;
    params?: any;
  };
  [screens.PREVIEW_FULL_IMAGE_SCREEN]: {
    imageURL?: string;
    params?: any;
  };

  // Shared Access with Friends
  [screens.CONTACTS_LIST_SCREEN]: undefined;
  [screens.PENDING_REQUESTS_LIST_SCREEN]: undefined;
  [screens.SHARED_DASHBOARD_SCREEN]: {
    userId: string;
    params?: any;
  };
  [screens.SHARED_FOOD_LOGGED_SCREEN]: {
    userId: string;
    params?: any;
  };

  // ==================================================
  [screens.AFFILIATE_ACCOUNTS_SCREEN]: undefined;
  [screens.AFFILIATE_REFERRALS_SCREEN]: undefined;
  [screens.AFFILIATE_REFERRALS_LIST_SCREEN]: undefined;
  [screens.AFFILIATE_STATS_SCREEN]: undefined;
  [screens.AFFILIATE_LOGIN_SCREEN]: undefined;
  [screens.AFFILIATE_SETTING_SCREEN]: undefined;

  // Log
  [screens.LOG_TDEE_ROOT_SCREEN]: undefined;
  [screens.SAVED_MEALS_TAB]: undefined;
  [screens.HISTORY_TAB]: undefined;
  [screens.LOG_TDEE_SCREEN]: undefined;
  [screens.QUICK_ADD_TDEE_SCREEN]: undefined;
  [screens.HISTORY_TDEE_SCREEN]: undefined;
  [screens.QUICK_ADD_SCREEN]: {
    currentLogData: TDEEHistoryProps | null;
    type: string;
    params?: any;
  };
  [screens.TDEE_CALCULATION_SCREEN]: {
    hasBack?: boolean;
    showLogin?: string;
    from?: string; // setting, logs, auth
    params?: any;
  };
  [screens.ADD_CUSTOM_MACROS_SCREEN]: undefined;
};
