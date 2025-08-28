import { FC, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AdminPage } from "./AdminPage";
import { InfoPage } from "./InfoPage";
import { MainPage } from "./MainPage";
import { AccessDeniedPage } from "./AccessDeniedPage";

export const Pages: FC = () => {
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || "";
    const isFirefox = /Firefox|FxiOS/i.test(ua);
    const isOpera = /OPR|Opera|OPiOS/i.test(ua);
    const isSupported = isFirefox || isOpera;
    if (!isSupported && window.location.pathname !== "/access-denied") {
      window.location.replace("/access-denied");
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path="/admin" component={() => <AdminPage />} />
          <Route path="/info" component={() => <InfoPage />} />
          <Route path="/access-denied" component={() => <AccessDeniedPage />} />
          <Route path="/*" component={() => <MainPage />} />
        </Switch>
        <ToastContainer hideProgressBar={true} />
      </BrowserRouter>
      <div id="modal-root" />
    </>
  );
};
