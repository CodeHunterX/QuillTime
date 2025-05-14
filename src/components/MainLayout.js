import React, { useState } from 'react';
import WriteTab from './WriteTab';
import TimerTab from './TimerTab';
import WordCountDisplay from './WordCountDisplay';
import SocialTab from './SocialTab';
import './MainLayout.css';

const MainLayout = () => {
  const [fileId, setFileId] = useState(null);

  return (
    <div className="main-layout">
      <div className="left-panel">
        <WriteTab onSelectFile={setFileId} />
      </div>
      <div className="right-panel">
        <div className="top-right">
          <TimerTab />
          <WordCountDisplay fileId={fileId} />
        </div>
        <div className="bottom-right">
          <SocialTab />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
