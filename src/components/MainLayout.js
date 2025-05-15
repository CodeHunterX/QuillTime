import React, { useState } from 'react';
import EditorTab from './EditorTab';
import TimerTab from './TimerTab';
import SocialTab from './SocialTab';
import NavBar from './NavBar';
import WordCountDisplay from './WordCountDisplay';

const MainLayout = ({ accessToken, onPrivacyClick }) => {
  const [fileId, setFileId] = useState(null);

  const handleChooseDoc = () => {
    if (!window.google?.picker) {
      console.error('[MainLayout] Picker API not loaded');
      return;
    }

    const view = new window.google.picker.View(window.google.picker.ViewId.DOCS);
    view.setMimeTypes('application/vnd.google-apps.document');

    const picker = new window.google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(accessToken)
      .setDeveloperKey(process.env.REACT_APP_GOOGLE_API_KEY)
      .setAppId(process.env.REACT_APP_GOOGLE_APP_ID)
      .setCallback((data) => {
        if (data.action === window.google.picker.Action.PICKED) {
          const doc = data.docs[0];
          setFileId(doc.id);
        }
      })
      .build();

    picker.setVisible(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top Nav */}
      <NavBar onPrivacyClick={onPrivacyClick} />

      {/* Main Panels */}
      <div style={{ display: 'flex', height: '92.5%' }}>
        {/* Left: Editor */}
        <div style={{ width: '75%', padding: '1rem', overflow: 'auto' }}>
        <button onClick={handleChooseDoc}>Choose Google Doc</button>
          {fileId ? (
            <EditorTab fileId={fileId} />
          ) : (
            <p>Select a Google Doc to begin writing.</p>
          )}
        </div>

        {/* Right: Sidebar */}
        <div style={{ width: '25%', borderLeft: '1px solid #ccc', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
          <TimerTab />
          <SocialTab />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
