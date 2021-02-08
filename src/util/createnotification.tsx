import {notification} from "antd";
import React from "react";

const getDescription = (descriptionList: string[]): any => {
  return (
    <span style={{color: "#00000090"}}>
      {descriptionList.map((text: string, index: number) => {
        return (
          <span>
            {index > 0 && <br />}
            <span>{text}</span>
          </span>
        );
      })}
    </span>
  );
};

const TypeNotification = (type: "success" | "error" | "info", message: string,
  descriptionList: string[] = [], duration: number = 3) => {
  notification[type]({
    message,
    description: getDescription(descriptionList),
    duration,
  });
};

export default TypeNotification;
