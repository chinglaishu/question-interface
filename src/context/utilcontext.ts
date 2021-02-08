import React from "react";

const utilObj: any = {};

const UtilContext = React.createContext(utilObj);

const UtilProvider = UtilContext.Provider;
const UtilConsumer = UtilContext.Consumer;

export default {UtilProvider, UtilConsumer};
