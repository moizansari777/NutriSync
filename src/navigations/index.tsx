import React from "react";
import { Platform } from "react-native";
import { useSelector } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList, screens } from "./routes";
import { RootState } from "../states/store/store";
import Splash from "../screens/splash";
import Login from "../screens/auth/login";
import SignUp from "../screens/auth/signup";
import ForgotPassword from "../screens/auth/forgotPassword";
import Setting from "../screens/setting";
import ResetPassword from "../screens/resetPassword";
import Chat from "../screens/chat";
import CreatePassword from "../screens/auth/createPassword";
import Verification from "../screens/auth/verification";
import BottomTab from "./bottomTabs/BottomTab";
import Accounts from "../screens/accounts";
import WebViewURL from "../screens/webViewURL";
import VisionCamera from "../screens/visionCamera";
import SelectCountry from "../screens/selectCountry";
import PreviewFullImage from "../screens/previewFullImage";
import Referrals from "../screens/referrals";
import MyReferrals from "../screens/myReferrals";
import QuickStats from "../screens/quickStats";
import InfoSteps from "../screens/infoSteps";
import AffiliateLogin from "../screens/affiliateModule/affiliateLogin";
import AffiliateAccounts from "../screens/affiliateModule/affiliateAccounts";
import AffiliateSetting from "../screens/affiliateModule/affiliateSetting";
import AffiliateReferrals from "../screens/affiliateModule/affiliateReferrals";
import AffiliateReferralsList from "../screens/affiliateModule/affiliateReferralsList";
import AffiliateStats from "../screens/affiliateModule/affiliateStats";
import QuickAddTDEE from "../screens/logModule/quickAddTDEE";
import HistoryTDEE from "../screens/logModule/historyTDEE";
import MacroTargets from "../screens/logModule/macroTargets";
import VerifyByPassword from "../screens/verifyByPassword";
import HomeCoach from "../screens/affiliateModule/coachesModule/homeCoach";
import ClientsCoach from "../screens/affiliateModule/coachesModule/clientsCoach";
import ClientDetails from "../screens/affiliateModule/coachesModule/clientDetails";
import CoachFoodLogged from "../screens/affiliateModule/coachesModule/coachFoodLogged";
import CoachEmail from "../screens/affiliateModule/coachesModule/coachEmail";
import CoachNotesLogged from "../screens/affiliateModule/coachesModule/coachNotesLogged";
import ManageTextSize from "../screens/manageTextSize";
import { useBackExit } from "../hooks/useBackExit";
import AccountSetting from "../screens/accountSetting";
import SendFeedback from "../screens/sendFeedback";
import History from "../screens/history";
import QuickAddNewItem from "../screens/logModule/quickAddNewItem";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={screens.LOGIN_SCREEN} component={Login} />
    <Stack.Screen name={screens.SIGNUP_SCREEN} component={SignUp} />
    <Stack.Screen
      name={screens.FORGOT_PASSWORD_SCREEN}
      component={ForgotPassword}
    />
    <Stack.Screen name={screens.VERIFICATION_SCREEN} component={Verification} />
    <Stack.Screen
      name={screens.CREATE_PASSWORD_SCREEN}
      component={CreatePassword}
    />
    <Stack.Screen
      name={screens.AFFILIATE_LOGIN_SCREEN}
      component={AffiliateLogin}
    />
  </Stack.Navigator>
);

const MainStack: React.FC<{
  isLoggedIn: boolean;
  isAffiliate: boolean;
}> = ({ isLoggedIn, isAffiliate = false }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <>
      {isAffiliate ? (
        <>
          <Stack.Screen
            name={screens.AFFILIATE_REFERRALS_SCREEN}
            component={AffiliateReferrals}
          />
          <Stack.Screen
            name={screens.AFFILIATE_REFERRALS_LIST_SCREEN}
            component={AffiliateReferralsList}
          />
          <Stack.Screen
            name={screens.AFFILIATE_STATS_SCREEN}
            component={AffiliateStats}
          />
          <Stack.Screen
            name={screens.AFFILIATE_ACCOUNTS_SCREEN}
            component={AffiliateAccounts}
          />
          <Stack.Screen
            name={screens.AFFILIATE_SETTING_SCREEN}
            component={AffiliateSetting}
          />
          <Stack.Screen
            name={screens.SELECT_COUNTRY_SCREEN}
            component={SelectCountry}
            options={{
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name={screens.WEB_VIEW_URL_SCREEN}
            component={WebViewURL}
          />
          <Stack.Screen
            name={screens.RESET_PASSWORD_SCREEN}
            component={ResetPassword}
          />

          {/* ===== Coach ===== */}
          <Stack.Screen
            name={screens.HOME_COACH_SCREEN}
            component={HomeCoach}
          />
          <Stack.Screen
            name={screens.CLIENT_COACH_SCREEN}
            component={ClientsCoach}
          />
          <Stack.Screen
            name={screens.CLIENT_DETAILS_SCREEN}
            component={ClientDetails}
          />
          <Stack.Screen
            name={screens.CLIENT_FOOD_LOGGED_SCREEN}
            component={CoachFoodLogged}
          />
          <Stack.Screen
            name={screens.CLIENT_EMAIL_SCREEN}
            component={CoachEmail}
          />
          <Stack.Screen
            name={screens.CLIENT_NOTES_SCREEN}
            component={CoachNotesLogged}
          />
        </>
      ) : (
        <>
          {isLoggedIn ? (
            <>
              <Stack.Screen
                name={screens.BOTTOM_TAB_STACK}
                component={BottomTab}
              />
              <Stack.Screen name={screens.CHAT_SCREEN} component={Chat} />
              <Stack.Screen
                name={screens.INFO_STEPS_SCREEN}
                component={InfoSteps}
                options={{
                  presentation: "modal",
                  animation:
                    Platform.OS === "android" ? "slide_from_bottom" : "default",
                }}
              />
              <Stack.Screen
                name={screens.PREVIEW_FULL_IMAGE_SCREEN}
                component={PreviewFullImage}
                options={{
                  animation: "fade",
                }}
              />
              <Stack.Screen name={screens.HISTORY_SCREEN} component={History} />
              <Stack.Screen
                name={screens.ACCOUNTS_SCREEN}
                component={Accounts}
              />
              <Stack.Screen
                name={screens.VERIFY_BY_PASSWORD_SCREEN}
                component={VerifyByPassword}
              />
              <Stack.Screen name={screens.SETTING_SCREEN} component={Setting} />
              <Stack.Screen
                name={screens.ACCOUNT_SETTING_SCREEN}
                component={AccountSetting}
              />
              <Stack.Screen
                name={screens.REFERRALS_SCREEN}
                component={Referrals}
              />
              <Stack.Screen
                name={screens.RESET_PASSWORD_SCREEN}
                component={ResetPassword}
              />
              <Stack.Screen
                name={screens.WEB_VIEW_URL_SCREEN}
                component={WebViewURL}
              />
              <Stack.Screen
                name={screens.SELECT_COUNTRY_SCREEN}
                component={SelectCountry}
                options={{
                  animation: "slide_from_bottom",
                }}
              />
              <Stack.Screen
                name={screens.VISION_CAMERA_SCREEN}
                component={VisionCamera}
              />
              <Stack.Screen
                name={screens.MY_REFERRALS_SCREEN}
                component={MyReferrals}
              />
              <Stack.Screen
                name={screens.QUICK_STATS_SCREEN}
                component={QuickStats}
              />
              <Stack.Screen
                name={screens.QUICK_ADD_TDEE_SCREEN}
                component={QuickAddTDEE}
              />
              <Stack.Screen
                name={screens.QUICK_ADD_SCREEN}
                component={QuickAddNewItem}
                options={{
                  animation: "slide_from_bottom",
                  animationDuration: 500,
                }}
              />
              <Stack.Screen
                name={screens.HISTORY_TDEE_SCREEN}
                component={HistoryTDEE}
              />
              {/* Both entry points open the same screen — the toggle inside
                  it switches between auto (TDEE) and manual (custom) targets. */}
              <Stack.Screen
                name={screens.TDEE_CALCULATION_SCREEN}
                component={MacroTargets}
              />
              <Stack.Screen
                name={screens.ADD_CUSTOM_MACROS_SCREEN}
                component={MacroTargets}
              />
              <Stack.Screen
                name={screens.MANAGE_TEXT_SIZE_SCREEN}
                component={ManageTextSize}
              />
              <Stack.Screen
                name={screens.SEND_FEEDBACK_SCREEN}
                component={SendFeedback}
              />

              {/* // Shared Access with Friends */}
              {/* <Stack.Screen
                name={screens.CONTACTS_LIST_SCREEN}
                component={ContactsList}
              />
              <Stack.Screen
                name={screens.PENDING_REQUESTS_LIST_SCREEN}
                component={PendingRequestsList}
              />
              <Stack.Screen
                name={screens.SHARED_DASHBOARD_SCREEN}
                component={SharedDashboard}
              />
              <Stack.Screen
                name={screens.SHARED_FOOD_LOGGED_SCREEN}
                component={SharedFoodLogged}
              /> */}
            </>
          ) : (
            <Stack.Screen
              name={screens.AUTH_SCREEN_STACK}
              component={AuthStack}
            />
          )}
        </>
      )}
    </>
  </Stack.Navigator>
);

const RootStack: React.FC = () => {
  useBackExit();

  const isLoggedIn = useSelector(
    (state: RootState) => state.authReducer?.isUserLoggedIn,
  );

  const isAffiliate = useSelector(
    (state: RootState) => state.authReducer?.userData?.isAffiliate,
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={screens.SPLASH_SCREEN} component={Splash} />
      <Stack.Screen name={screens.MAIN_SCREEN_STACK}>
        {() => (
          <MainStack
            isLoggedIn={isLoggedIn}
            isAffiliate={isAffiliate ?? false}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default RootStack;
