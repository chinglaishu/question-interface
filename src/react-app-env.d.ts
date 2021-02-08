/// <reference types="react-scripts" />

declare type UtilObj = {
  sizeObj: SizeObj,
  theme: any,
  userObj: UserObj,
  getUserData: () => void,
}

declare type SizeObj = {
  headerHeight: number,
  headerDiffHeight: number,
};

declare type UserObj = any;
