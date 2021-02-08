
// High-emphasis text should have an opacity of 87%
// Medium emphasis text is applied at 60%
// Disabled text uses an opacity of 38%.

const lightTheme = {
  themeName: "light",
  background: "#F0F2F5", // F0F2F550
  primary: "#6200EE",
  secondary: "#03DAC6",
  headerBackground: "#FFFFFF",
  sideBarBackground: "#FFFFFF",
  logoBackground: "#00000005",
  border: "#FFFFFFF",
  questionBorder: "#D7D7D7",
  surface: "#FFFFFF90",
  highLightSurface: "#FFFFFF",
  title: "#53565A",
  value: "#53565A",
  subText: "#85898E",
  onPrimary: "#FFFFFF",
  onSecondary: "#000000",
  error: "#B00020",
  success: "#52C41A",
  warning: "#FAAD14",
  info: "#E7BF3F",
  select: "#01B2D975",
  selectText: "#000000",
  mouseOver: "#01B2D9",
  mouseOverText: "#00000090",
  divider: "#00000010",
  subDivider: "#00000005",
  onWhiteText: "#000000",
  inputBackground: "#FFFFFF",
  buttonBorder: "#949596",
  modalBorder: "#00000010",
  optionBackground: "#979797",
  commonList: ["#D65F5F", "#D6A45F", "#A1D65F", "#5FD6A3", "#5F99D6", "#C057BA"],
};

const darkTheme = {
  themeName: "dark",
  background: "#1D2125",
  primary: "#BB86FC",
  secondary: "#03DAC6",
  headerBackground: "#323C41",
  sideBarBackground: "#181C1F",
  logoBackground: "#000000",
  border: "#FFFFFF30",
  questionBorder: "#FFFFFF30",
  surface: "#E4F9FB10",
  highLightSurface: "#E4F9FB40",
  title: "#B7B7B7",
  value: "#D8D8D8",
  subText: "#C1C1C180",
  onPrimary: "#000000",
  onSecondary: "#000000",
  error: "#CF6679",
  success: "#52C41A",
  warning: "#FAAD14",
  info: "#E7BF3F",
  select: "#01B2D975",
  selectText: "#FFFFFF",
  mouseOver: "#01B2D9",
  mouseOverText: "#FFFFFF90",
  divider: "#FFFFFF10",
  subDivider: "#FFFFFF05",
  onWhiteText: "#000000",
  inputBackground: "#333B3E",
  buttonBorder: "#777777",
  modalBorder: "#FFFFFF20",
  optionBackground: "#3F3F3F",
  commonList: ["#D65F5F", "#D6A45F", "#A1D65F", "#5FD6A3", "#5F99D6", "#C057BA"],
};













const blueTheme = {
  themeName: "blue",
  background: "#2C2C2C",
  primary: "#3E88FA",
  secondary: "#3EEBFA",
  headerBackground: "#343c41",
  sideBarBackground: "#212222",
  logoBackground: "#000000",
  surface: "#E4F9FB10",
  title: "#B7B7B7",
  value: "#D8D8D8",
  subText: "#C1C1C180",
  onPrimary: "#000000",
  onSecondary: "#000000",
  error: "#CF6679",
  success: "#52C41A",
  warning: "#FAAD14",
}

export default {lightTheme, darkTheme, blueTheme};