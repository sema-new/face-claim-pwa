import { useEffect } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = "294097585508-vsf28nf74e9kgcha354e6a5fpcosvmtl.apps.googleusercontent.com";
const API_KEY = "AIzaSyDjcLP1x9Z3xvLYjha-jgih3jEX1p7V77Q";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/drive.file";

export const useGoogleDrive = () => {
  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  const signIn = () => gapi.auth2.getAuthInstance().signIn();

  const loadJSONFromDrive = async (fileId) => {
    const res = await gapi.client.drive.files.get({
      fileId,
      alt: "media",
    });
    return JSON.parse(res.body);
  };

  const uploadJSONToDrive = async (fileId, jsonData) => {
    const boundary = "boundary123";
    const body =
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
      JSON.stringify({ name: "face_claims.json", mimeType: "application/json" }) +
      `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n` +
      JSON.stringify(jsonData) +
      `\r\n--${boundary}--`;

    await gapi.client.request({
      path: `/upload/drive/v3/files/${fileId}`,
      method: "PATCH",
      params: { uploadType: "multipart" },
      headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
      body,
    });
  };

  return { signIn, loadJSONFromDrive, uploadJSONToDrive };
};