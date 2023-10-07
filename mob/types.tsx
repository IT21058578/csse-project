import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  children: undefined;
  BottomTab: undefined;
  CTasks: undefined;
  PersonalRoomSchedule: undefined;
};

//schedule types
export type scheduleTypes = {
  id: number;
  title: String;
  startTime: String;
  endTime: String;
  date: String;
  room: String;
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;



  //Bottom nav types 

  export enum TabElementDisplayOptions {
    ICON_ONLY = "icon-only",
    LABEL_ONLY = 'label-only',
    BOTH = 'both'
}

export enum DotSize {
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
    DEFAULT = 'default' // not in docs
}

export enum TabButtonLayout {
    VERTICAL = 'vertical',
    HORIZONTAL = 'horizontal'
}


export interface IAppearanceOptions {
    topPadding: number;
    bottomPadding: number;
    horizontalPadding: number;
    tabBarBackground: string;
    activeTabBackgrounds?: string | string[];
    activeColors?: string | string[];
    floating: boolean;
    dotCornerRadius: number;
    whenActiveShow: TabElementDisplayOptions;
    whenInactiveShow: TabElementDisplayOptions;
    dotSize: DotSize;
    shadow: boolean;
    tabButtonLayout: TabButtonLayout
}

//Soft Tab Two
export interface TabTwoAppearanceOptions {
  topPadding: number;
  bottomPadding: number;
  horizontalPadding: number;
  tabBarBackground: string;
  activeTabBackgrounds?: string | string[];
  activeColors?: string | string[];
  activeTabColors?: string | string[];
  dotSize?: DotSize;
  tabButtonLayout: TabButtonLayout
}