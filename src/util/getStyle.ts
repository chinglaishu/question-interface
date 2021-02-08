
const GetStyle = {
  formDiv(theme: any) {
    return {backgroundColor: theme.surface, padding: 20,
      borderRadius: 5, border: `1px solid ${theme.divider}`};
  },
  formInput(theme: any, disable: boolean) {
    const color = (disable)
      ? theme.subText : theme.value;
    return {color, backgroundColor: theme.inputBackground,
      border: `2px solid ${theme.divider}`};
  },
  selectOption(theme: any) {
    return {
      backgroundColor: theme.optionBackground, color: theme.title,
      border: "0px",
    };
  },
}

export default GetStyle;
