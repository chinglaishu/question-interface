import axios from "axios";

const createUrl = (extendUrl: string) => {
  const baseUrl =  `http://ec2-13-212-102-3.ap-southeast-1.compute.amazonaws.com:3000/api`;
  return baseUrl + extendUrl;
}

axios.interceptors.response.use(response => {
  return response;
}, error => {
  if (!error.response) {return {data: {success: false}}; }
  const errorStatusList = [401, 404, 500];
  if (errorStatusList.includes(error.response.status)) {
    return {data: {success: false}};
  }
  return error;
});

const makeRequest = async (token: string, url: string, requestMethod: any = "get", data: any = {}, extendHeader: any = {}) => {
  const headers: any = {token};
  const keyList = Object.keys(extendHeader);
  for (let i = 0 ; i < keyList.length ; i++) {
    headers[keyList[i]] = extendHeader[keyList[i]];
  }
  if (requestMethod === "get") {
    const request = await axios({
      method: requestMethod,
      url,
      headers,
    });
    return request;
  } else {
    const request = await axios({
      method: requestMethod,
      url,
      headers,
      data,
    });
    return request;
  }
};

export default {createUrl, makeRequest};
