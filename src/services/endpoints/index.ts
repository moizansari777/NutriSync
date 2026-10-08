export const API_METHODS = {
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE",
  PUT: "PUT",
  PATCH: "PATCH",
};

export type ApiMethod = (typeof API_METHODS)[keyof typeof API_METHODS];

export const API_ENDPOINTS = {
  signup: "auth/sign_up",
  signin: "auth/sign_in",
  forgot_password: "password_resets",
  verify_otp: "password_resets/verify_otp",
  reset_password: "password_resets/reset",
  resend_otp: "password_resets/resend_otp",

  // Chats
  messages: "messages",
  conversations_list: "conversations",
  messages_list: "conversations",
  search: "conversations",
  library_search: "library",
  payments_plans_url: "payments/plans_url",
  save_history: "star",
  unsave_history: "unstar",
  library_list: "library",
  query_counts: "query_status",
  message_voice: "tts/message_voice",
  billing_clicked: "query_status/billing_clicked",
  can_use_ai: "can_use_ai",

  // Setting
  account: "account",
  update_password: "account/reset_password",
  delete_account: "account",
  update_goal: "account/goal",
  get_account: "account",
  update_personal_details: "account/personal_details",
  verify_by_password: "account/verify_password",
  timezone: "account/timezone",
  devices: "devices",
  push_notifications: "account/push_notifications",
  feedbacks: "feedbacks",
  chat_response_style: "account/chat_response_style",

  // Referrals
  get_referral_link: "referral_link",
  get_referral_stats: "referral_stats",
  get_my_referrals: "my_referrals",

  // Affiliate
  affiliate_login: "auth/affiliate_login",
  affiliate_referral_link: "referrals/referral_link",
  affiliate_referral_stats: "referrals/stats",
  affiliate_my_referrals: "referrals/my_referrals",
  update_affiliate_partner: "settings/affiliate_partner",

  // Coach
  coach_dashboard: "coach/dashboard",
  coach_clients: "coach/clients",

  // Log
  fitness_details: "account/fitness_details",
  target_kcal: "account/target_kcal",
  get_logs: "logs",
  get_logs_by_id: "logs",
  add_logs: "logs",
  update_logs: "logs",
  delete_logs: "logs",
  diet_suggestions: "account/diet_suggestions",
  add_logs_quickly: "logs/quick_add_log",
  quick_logs: "logs/quick_add",
  statistics: "statistics",
  statistics_graph: "statistics/graph",
  food_scan_analyze: "food_scan/analyze",
  adjust_portion: "adjust_portion",
  custom_targets: "account/custom_targets",
  current_tdee_records: "account/current_tdee_records",
  custom_macros_mode: "account/custom_macros_mode",
  suggested_meal_macros: "logs/suggested_meal_macros",
  water_target: "account/water_target",

  // Friend Access
  create_friend_request: "friends/requests",
  get_sent_request: "friends/requests/sent",
  get_incoming_friend_requests: "friends/requests/incoming",
  get_friends_approved_list: "friends/approved",
  get_friend_request_statuses: "friends/requests/sent",

  validate_invite_token: "friends/invites/:token",
  get_friend_progress: "friends/:id/progress",
  get_friend_dashboard: "friends/:id/dashboard",
  resolve_contacts: "friends/contacts/resolve",

  // External
  get_time_zone: "get-time-zone",
};

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
