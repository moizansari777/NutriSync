import { KeyboardType, ReturnKeyType, ViewStyle } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/routes";
import React from "react";

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type ThemeMode = "light" | "dark" | "system";

export type SettingStates = {
  themeMode: ThemeMode;
  textScaleValue: number;
  appreview: {
    lastShownAt: number | null;
    hasReviewed: boolean;
  };
};

export interface UserDataProps {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | any;
  goal_tdee: string;
  query_count: number;
  stripe_customer_id: string;
  referral_code?: string;
  age_range: string;
  country: string;
  gender: string;
  timezone: string;
  isCoach?: boolean;
  provider?: string | null;
  weight_unit?: string | null;
  weight?: string | Number | null;
  push_notifications_enabled?: boolean;
  custom_macros_mode?: string;
  chat_response_style?: string;
  subscription: {
    id: number;
    user_id: number;
    stripe_subscription_id: string;
    plan: string;
    status: string;
    billing_source: string;
    current_period_start: string;
    current_period_end: string;
    canceled_at: string | null;
    created_at: string;
    updated_at: string;
    cancel_at_period_end?: boolean;
  };
  pending_referral_rewards?: {
    benefits_summary: string;
    campaign_name: string;
    discount_cycles: number;
    discount_percentage: string;
    free_months: number;
    indefinite_discount_percentage: string;
    referrer_name: string;
    reward_type: string;
  };
}

export interface UserAuthData {
  user: UserDataProps;
  login?: boolean;
  isAffiliate?: boolean;
  token: string;
}

export interface LogState {
  hasMacros: null | any;
  hasActivityDataEnabled: boolean;
}

/**
 * A day's activity totals, named after the Apple rings.
 *
 * `null` marks a metric the platform's health store does not expose at all,
 * which is not the same as a recorded zero — the distinction matters once
 * these are sent to the API.
 */
export interface HealthActivityData {
  /** Steps taken. */
  steps: number;
  /** Active energy burned, in kcal ("Move"). */
  move: number;
  /** Workout minutes ("Exercise"). */
  exercise: number;
  /** Hours containing at least a minute of standing ("Stand"). */
  stand: number | null;
}

export interface LiveScanState {
  isLiveScanActive: boolean;
  isScreenFromLogHistory: string;
}

export interface FiltersState {
  logTDEEFilter: string;
  quickAddFilter: string;
  historyTDEEFilter: string;
  coachDashboardFilter: string;
  coachClientFilter: string;
  coachClientDetailsFilter: string;
  sharedFilter: string;
  chatHistoryFilter: string;
}

export type CoachFilterKeyProps =
  | "coachDashboardFilter"
  | "coachClientFilter"
  | "coachClientDetailsFilter";

export type CoachFilterProps = {
  coachDashboardFilter: string;
  coachClientFilter: string;
  coachClientDetailsFilter: string;
};

export enum NetworkStatus {
  OFFLINE = "OFFLINE",
  NO_INTERNET = "NO_INTERNET",
  SLOW = "SLOW",
  ONLINE = "ONLINE",
}

export interface NetworkState {
  status: NetworkStatus;
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
  cellularGeneration: any;
}

export interface LocationStates {
  lastLatLng: {
    lat: null;
    lng: null;
  };
  dismissedTimezone: string | null;
}

export interface SelectedCountryProps {
  code: string;
  name: string;
  phoneCode: string;
}

export interface AuthState {
  userData: UserAuthData | null;
  isUserLoggedIn: boolean;
  selectedCountry?: SelectedCountryProps | null;
  isOnboarding: boolean;
  fcm_token?: string[];
  isPushNotificationEnabled: boolean;
  isSoundOff: boolean;
  countrySelection: SelectedCountryProps | null;
  isBiometricsEnabled: boolean;
  isRememberMeEnabled: boolean;
  rememberMeInfo: {
    email: string;
  };
  canUseAI: boolean;
  isAffiliateRememberMeEnabled: boolean;
  rememberMeAffiliateInfo: {
    email: string;
  };
}

export interface SelectedImageProps {
  uri: string;
  type: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  images?: string[];
  createdAt: number;
  isError?: boolean;
  loading?: boolean;
  starred?: boolean;
}

export interface ChatState {
  currentSelectedImage: SelectedImageProps | null;
  imageState: SelectedImageProps | null;
  allMessagesList: any[];
  isMessageProcessing: boolean;
  isCurrentChatScreenActive: boolean;
  activeStream?: {
    conversationId: string | undefined;
    assistantMessageId: string;
  };
  queryCountData: any;
  isFromCropEdit: boolean;
}

type MediaType = "photo" | "video" | "any";

export interface PickerProps {
  width?: number;
  height?: number;
  multiple?: boolean;
  includeBase64?: boolean;
  mediaType?: MediaType;
  cropping?: boolean;
}

export interface PickedFile {
  uri: string;
  name: string;
  type: string;
  size: number;
}

export interface PickedResult {
  files: PickedFile[]; // Files for FormData upload
  base64?: string[]; // Optional base64 array
}

export interface InputProps {
  name?: string;
  label?: string;
  testID?: string;
  control: any;
  rules: any;
  isLoading?: boolean;
  type?: "text" | "textarea"; // Added type prop
  placeholder?: string;
  customStyle?: any;
  customIconStyle?: any;
  iconName?: any;
  keyboardType?: KeyboardType;
  inputRef?: any;
  onSubmitEditing?: any;
  returnKeyType?: ReturnKeyType;
  requiredLabel?: boolean;
  inputFocused?: boolean;
  handleInPutFocus?: () => void;
  onBlur?: () => void;
  /** Rendered on the label row, opposite the label. */
  renderRightUI?: React.ReactNode;
  /** Rendered inside the field itself, right-aligned (same slot as the
   * show/hide password eye). The field reserves padding for it automatically. */
  renderInsideRightUI?: React.ReactNode;
  mainStyle?: ViewStyle;
  borderColor?: string;
  /** Hard cap on how many characters can be typed or pasted into the field. */
  maxLength?: number;
  /** Shows a live `typed/maxLength` counter under the field. Needs `maxLength`. */
  showCharCount?: boolean;
}

export type ActivityLevelProps = {
  value: string;
  title: string;
  tagLine: string;
};

export type GoalDropdownSheetProps = {
  value: string;
  kcal: string;
  title: string;
};

export type GoalsProps = {
  id: number;
  title: string;
  value: string;
  image: any;
};

export type HistoryProps = {
  id: number;
  title: string;
  updated_at: string;
  starred?: boolean;
};

export type MessageProps = {
  content?: string;
  text?: string;
  created_at?: string;
  createdAt?: string;
  images: string[];
  role: string;
  id: number;
  isError?: boolean;
  loading?: boolean;
  retryPayload?: any;
};

export interface SubscriptionProps {
  id: string;
  name: string;
  price: string | number;
  currency: string;
  interval: string;
  description: string;
  original_price: string | null;
  savings: string | null;
}

export type CameraZoomProps = { key: number; value: number };

export type AgeProps = {
  id: number;
  age: string;
};

export type CountryProps = {
  id: number;
  name: string;
};

export type FilterProps = {
  id: string;
  name: string;
};

export type UnitProps = {
  id: string;
  name: string;
};

export type TDEEHistoryProps = {
  id: string;
  log_id?: string;
  name: string;
  calories: string | number;
  water: string | number | null;
  carbs: string | number;
  fat: string | number;
  created_at: string;
  protein: string | number;
  updated_at: string;
};

export const ENVIRONMENTS = {
  STAGING: "Staging",
  PRODUCTION: "Production",
  LOCAL: "Local",
} as const;

export type AppEnvironment = (typeof ENVIRONMENTS)[keyof typeof ENVIRONMENTS];

export type Macro = {
  title: string;
  tracked: string;
  total: string;
  color: any;
};

export type MacrosProps = {
  macrosData: Macro[];
  /** Theme is passed in as a prop — the widget view cannot call hooks. */
  scheme?: "light" | "dark";
};

export type PhaseProps = "idle" | "capturing" | "processing" | "result";

export type AnalyseResultProps = {
  name?: string;
  calories: number;
  proteins: number;
  carbs: number;
  fat: number;
};

export type ClientProps = {
  name: string;
  id: number;
  email: string;
  active: boolean;
  created_at: string;
  first_name: string;
  has_active_subscription: boolean;
  last_name: string;
};

export type CoachProps = {
  calories: number;
  protein: number;
  sleep: number;
  water: number;
  client: ClientProps;
};

export type ContactProps = {
  recordID: string;
  givenName: string;
  phoneNumbers: { label: string; number: string }[];
  emailAddresses: { label: string; email: string }[];
};
