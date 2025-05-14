import TimerTab from './TimerTab';
import SocialTab from './SocialTab';
import WriteTab from './WriteTab';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <div className="left-panel">
        <WriteTab />
      </div>
      <div className="right-panel">
        <div className="top-right">
          <TimerTab />
        </div>
        <div className="bottom-right">
          <SocialTab />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
