import { ParamListBase } from "@react-navigation/native";

/**
 * Root navigation param list
 */
export interface RootParamList extends ParamListBase {
  "(auth)": undefined;
  "(tabs)": undefined;
  SubscriptionDetailsScreen: { id?: string };
  AccessDetailsScreen: { id?: string };
  PurchaseDetailsScreen: { id?: string };
  EditProfileScreen: undefined;
  ChangePasswordScreen: undefined;
  AllPurchasesScreen: undefined;
}

/**
 * Auth navigation param list
 */
export interface AuthParamList extends ParamListBase {
  LoginScreen: undefined;
  ForgotPasswordScreen: undefined;
  OtpVerification: { email: string };
  SetNewPasswordScreen: { token: string };
}

/**
 * Tab navigation param list
 */
export interface TabParamList extends ParamListBase {
  DashBoardScreen: undefined;
  AccessScreen: undefined;
  WalletScreen: undefined;
  ProfileScreen: undefined;
}

/**
 * Screen props helper type
 */
export type ScreenProps<T extends keyof RootParamList> = {
  navigation: any;
  route: {
    params: RootParamList[T];
  };
};
