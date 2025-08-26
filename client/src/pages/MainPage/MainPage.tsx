import { useStore } from "effector-react";

import { BaseTable } from "../../components/BaseTable";
import { BaseHeader } from "../../components/BaseHeader";
import { $filtredTableState, fetchUserReposFx } from "../../store/Table";
import { $config, getConfigRequest } from "../../store/Config";
import {
  OnPasswordSubmit,
  PasswordSection,
} from "../../components/PasswordSection";
import { BaseFooter } from "../../components/BaseFooter";
import { useEffect, useRef, useState } from "react";
import { Drawer } from "antd";
import { UserSettings, UserSettingsRef } from "../../components/UserSettings";
import { BaseButton } from "../../components/BaseButton";
import { ProcessingIndicator } from "../../components/ProcessingIndicator";

export const MainPage = () => {
  const loading = useStore(fetchUserReposFx.pending);
  const tournament = useStore($filtredTableState);
  const config = useStore($config);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const userSettingsRef = useRef<UserSettingsRef>(null);
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Автоматически открываем настройки при загрузке страницы
    if (config?.alias && config?.password && !drawerOpen) {
      handleSettingsModalOpen();
    }
  }, [config?.alias, config?.password]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.position = 'relative';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const handleSettingsModalOpen = async () => {
    if (config?.alias && config?.password && !isSettingsLoading) {
      setIsSettingsLoading(true);
      try {
        await getConfigRequest({
          alias: config.alias,
          password: config.password,
        });
        setDrawerOpen(true);
      } finally {
        setIsSettingsLoading(false);
      }
    }
  };

  const handlePasswordSubmit = ({
    password,
    login,
  }: {
    password: string;
    login: string;
  }) => {
    return getConfigRequest({ alias: login, password });
  };

  if (!config?.alias || !config?.password) {
    return <PasswordSection onSubmit={handlePasswordSubmit} />;
  }

  return (
    <>
      <BaseHeader onSettingsClick={handleSettingsModalOpen} />
      <BaseTable loading={loading} data={tournament} />
      <ProcessingIndicator />
      <Drawer
        title={`Settings: ${config?.alias || ""}`}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={windowWidth < 800 ? windowWidth : 800}
        bodyStyle={{
          padding: "16px 32px",
        }}
        extra={
          <BaseButton
            onClick={async () => {
              const ref = userSettingsRef.current;
              if (ref) {
                await ref.handleSubmit();
              }
            }}
            style={{
              height: "38px",
            }}
            className="drawer-save-button"
          >
            Save changes
          </BaseButton>
        }
      >
        {config && (
          <UserSettings
            ref={userSettingsRef}
            config={config}
            isAdminPage={false}
            onClose={() => setDrawerOpen(false)}
            onSave={() => setDrawerOpen(false)}
          />
        )}
      </Drawer>
    </>
  );
};
