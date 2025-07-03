import { useStore } from "effector-react";
import React, { FC, RefObject } from "react";
import { Drawer } from "antd";

import CloseIcon from "../../../assets/icons/close.svg";
import {
  $config,
  deleteConfigRequest,
  getConfigRequest,
} from "../../../store/Config";
import {
  $aliases,
  aliasesEvents,
  getAliasesRequest,
} from "../../../store/Alias";
import { $isValidAdminPassword, $password } from "../../../store/Password";

import { ApprovalSection } from "../../ApprovalSection";
import { UserSettings } from "../../UserSettings";
import { Modal, ModalRef } from "../../Modal";

import { b } from "../index";

interface Props {
  selectedLevel: number | string | null;
  search: string;
}

export const AliasesSectionList: FC<Props> = ({ selectedLevel, search }) => {
  const settingsModalRef = React.useRef<ModalRef>(null);
  const [selectedAlias, setSelectedAlias] = React.useState<string>("");
  const deleteModalRef = React.useRef<ModalRef>(null);
  const handleModalOpen = (ref: RefObject<ModalRef>) => ref.current?.open();
  const handleModalClose = (ref: RefObject<ModalRef>) => {
    ref.current?.close();
  };

  const isAdminPage = useStore($isValidAdminPassword);
  const selectedConfig = useStore($config);
  const password = useStore($password);
  const aliases =
    useStore($aliases)?.filter((alias) => {
      return alias.toLocaleLowerCase().includes(search.toLocaleLowerCase());
    }) ?? [];

  const aliasesLoading = useStore(getAliasesRequest.pending);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  if (selectedLevel === null) {
    return null;
  }

  if (aliasesLoading) {
    return <span>Loading</span>;
  }

  const handleAliasClick = (alias: string) => async () => {
    await getConfigRequest({ alias, password });
    setDrawerOpen(true);
  };

  const handleAliasDelete = (alias: string) => async () => {
    await aliasesEvents.deleteAlias(alias);
    await deleteConfigRequest({ alias, password });
    await handleModalClose(deleteModalRef);
  };

  return (
    <div className={b("alias-list")}>
      {aliases.length ? (
        aliases.map((alias) => (
          <div className={b("alias-item")} key={alias}>
            <div
              className={b("alias-item-text")}
              onClick={handleAliasClick(alias)}
            >
              {alias}
            </div>
            <div
              className={b("alias-item-delete-wrapper")}
              onClick={async () => {
                handleModalOpen(deleteModalRef);
                await setSelectedAlias(alias);
              }}
            >
              <img src={CloseIcon} alt="close" />
            </div>
          </div>
        ))
      ) : (
        <div>Nothing found</div>
      )}
      <Drawer
        title={selectedConfig ? `Alias: ${selectedConfig.alias}` : "Настройки"}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={600}
        bodyStyle={{ padding: 24 }}
        destroyOnClose
      >
        {selectedConfig ? (
          <UserSettings
            config={selectedConfig}
            isAdminPage={isAdminPage}
            onClose={() => setDrawerOpen(false)}
          />
        ) : (
          <div style={{ padding: 50 }}>Loading config</div>
        )}
      </Drawer>
      <Modal ref={deleteModalRef}>
        <ApprovalSection
          title="Do you really want to delete this alias?"
          onApprove={handleAliasDelete(selectedAlias)}
          onClose={() => handleModalClose(deleteModalRef)}
        />
      </Modal>
    </div>
  );
};
