import { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = "294097585508-vsf28nf74e9kgcha354e6a5fpcosvmtl.apps.googleusercontent.com";
const API_KEY = "AIzaSyDjcLP1x9Z3xvLYjha-jgih3jEX1p7V77Q";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

export const useGoogleDrive = () => {
  const [gapiReady, setGapiReady] = useState(false);

  useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      }).then(() => {
        setGapiReady(true);
      });
    });
  }, []);

  const signIn = async () => {
    if (!gapiReady) throw new Error("GAPI not ready");
    const auth = gapi.auth2.getAuthInstance();
    if (!auth) throw new Error("Auth not initialized");
    await auth.signIn();
  };

  const loadJSONFromDrive = async (fileId) => {
    if (!gapiReady) throw new Error("GAPI not ready");
    const res = await gapi.client.drive.files.get({
      fileId,
      alt: 'media',
    });
    return JSON.parse(res.body);
  };

  return { signIn, loadJSONFromDrive, gapiReady };
};