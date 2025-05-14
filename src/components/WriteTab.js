import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../services/AuthContext';
import './WriteTab.css';

const WriteTab = () => {
  const { accessToken } = useAuth();
  const pickerInitialized = useRef(false);
  const [iframeUrl, setIframeUrl] = useState('');
  const [fileMetadata, setFileMetadata] = useState(null);

  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
  const APP_ID = process.env.REACT_APP_GOOGLE_APP_ID;

  // Load GAPI and Picker on mount
  useEffect(() => {
    if (!accessToken) return;

    const initializeGapi = () => {
      window.gapi.load('client:picker', async () => {
        await window.gapi.client.init({ apiKey: API_KEY });
        await window.gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest');
        pickerInitialized.current = true;
      });
    };

    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.onload = initializeGapi;
    document.body.appendChild(gapiScript);
  }, [accessToken]);

  const createPicker = () => {
    if (!pickerInitialized.current || !accessToken) return;

    const view = new window.google.picker.View(window.google.picker.ViewId.DOCS);
    view.setMimeTypes('application/vnd.google-apps.document');

    const picker = new window.google.picker.PickerBuilder()
      .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
      .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
      .setDeveloperKey(API_KEY)
      .setAppId(APP_ID)
      .setOAuthToken(accessToken)
      .addView(view)
      .addView(new window.google.picker.DocsUploadView())
      .setCallback(pickerCallback)
      .build();

    picker.setVisible(true);
  };

  const pickerCallback = async (data) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const pickedDoc = data[window.google.picker.Response.DOCUMENTS][0];
      const fileId = pickedDoc[window.google.picker.Document.ID];
      const previewUrl = `https://docs.google.com/document/d/${fileId}/edit`;

      try {
        const res = await window.gapi.client.drive.files.get({
          fileId,
          fields: '*',
        });

        setFileMetadata(res.result);
        setIframeUrl(previewUrl);
      } catch (err) {
        console.error('Failed to fetch file metadata:', err);
      }
    }
  };

  const handleOpenInNewTab = () => {
    if (iframeUrl) {
      const fileId = iframeUrl.split('/')[5];
      const editUrl = `https://docs.google.com/document/d/${fileId}/edit`;
      window.open(editUrl, '_blank');
    }
  };

  return (
    <div className="write-tab">
      <div className="controls">
        {accessToken ? (
          <>
            <button onClick={createPicker}>Choose Document</button>
            {iframeUrl && (
              <button onClick={handleOpenInNewTab}>Open in Google Docs</button>
            )}
          </>
        ) : (
          <p>Please log in to access Google Docs.</p>
        )}
      </div>

      <div className="iframe-container">
        {iframeUrl ? (
          <iframe
            title="Google Doc"
            src={iframeUrl}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        ) : (
          <div className="placeholder">
            <p>Select a document to begin writing.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteTab;
