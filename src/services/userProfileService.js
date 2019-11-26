import { createStub } from "./WireMockService";
import { WMurl } from "../constant";
export function saveSetting(settings) {
  saveUserSetting(settings);
}
const userSettingURL = "/_administrator/userSetting";
const userSettingId = "cbe04d58-7419-41e0-be49-0d32f86715a0";
export function getUserSetting(callback) {
  fetch(WMurl + userSettingURL, { method: "GET" }).then(response => {
    response.json().then(json=>callback(json));
  });
}
export function saveUserSetting(setting) {
  const requestSetting = {
    id: userSettingId,
    uuid: userSettingId,
    name: "setting",
    metadata: {},
    request: { urlPattern: userSettingURL, method: "GET" },
    response: {
      status: 200,
      body: JSON.stringify(setting),
      headers: { "content-type": "application/json" }
    },
    persistent: true
  };
  createStub(requestSetting, () => {
    console.log("success");
  });
}
