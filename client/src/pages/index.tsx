import { FC, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AdminPage } from "./AdminPage";
import { InfoPage } from "./InfoPage";
import { MainPage } from "./MainPage";
import { AccessDeniedPage } from "./AccessDeniedPage";

export const Pages: FC = () => {
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const vendor = navigator.vendor || "";
    const appName = navigator.appName || "";
    const product = navigator.product || "";
    const appVersion = navigator.appVersion || "";
    
    const isFirefox = /Firefox|FxiOS|Firefox\/\d+|Mozilla.*Firefox|Iceweasel|Seamonkey|Waterfox|Pale Moon|Basilisk|LibreWolf|Floorp|Borealis|Mozilla\/5\.0.*Firefox|Mozilla\/5\.0.*Gecko.*Firefox|Mozilla\/5\.0.*rv:\d+\.\d+.*Gecko.*Firefox/i.test(ua) ||
                     /Firefox|FxiOS|Firefox\/\d+|Mozilla.*Firefox|Iceweasel|Seamonkey|Waterfox|Pale Moon|Basilisk|LibreWolf|Floorp|Borealis|Mozilla\/5\.0.*Firefox|Mozilla\/5\.0.*Gecko.*Firefox|Mozilla\/5\.0.*rv:\d+\.\d+.*Gecko.*Firefox/i.test(vendor) ||
                     /Firefox|FxiOS|Firefox\/\d+|Mozilla.*Firefox|Iceweasel|Seamonkey|Waterfox|Pale Moon|Basilisk|LibreWolf|Floorp|Borealis|Mozilla\/5\.0.*Firefox|Mozilla\/5\.0.*Gecko.*Firefox|Mozilla\/5\.0.*rv:\d+\.\d+.*Gecko.*Firefox/i.test(appName) ||
                     /Firefox|FxiOS|Firefox\/\d+|Mozilla.*Firefox|Iceweasel|Seamonkey|Waterfox|Pale Moon|Basilisk|LibreWolf|Floorp|Borealis|Mozilla\/5\.0.*Firefox|Mozilla\/5\.0.*Gecko.*Firefox|Mozilla\/5\.0.*rv:\d+\.\d+.*Gecko.*Firefox/i.test(product) ||
                     /Firefox|FxiOS|Firefox\/\d+|Mozilla.*Firefox|Iceweasel|Seamonkey|Waterfox|Pale Moon|Basilisk|LibreWolf|Floorp|Borealis|Mozilla\/5\.0.*Firefox|Mozilla\/5\.0.*Gecko.*Firefox|Mozilla\/5\.0.*rv:\d+\.\d+.*Gecko.*Firefox/i.test(appVersion);
    
    const isOpera = /OPR|Opera|OPiOS|Opera\/\d+|Mozilla.*Opera|Opera Mini|Opera Mobile|Opera Next|Opera Touch|Opera GX|Mozilla\/5\.0.*Opera|Mozilla\/5\.0.*Presto.*Opera|Mozilla\/5\.0.*Chrome.*Safari.*OPR|Mozilla\/5\.0.*Chrome.*Safari.*Opera/i.test(ua) ||
                   /OPR|Opera|OPiOS|Opera\/\d+|Mozilla.*Opera|Opera Mini|Opera Mobile|Opera Next|Opera Touch|Opera GX|Mozilla\/5\.0.*Opera|Mozilla\/5\.0.*Presto.*Opera|Mozilla\/5\.0.*Chrome.*Safari.*OPR|Mozilla\/5\.0.*Chrome.*Safari.*Opera/i.test(vendor) ||
                   /OPR|Opera|OPiOS|Opera\/\d+|Mozilla.*Opera|Opera Mini|Opera Mobile|Opera Next|Opera Touch|Opera GX|Mozilla\/5\.0.*Opera|Mozilla\/5\.0.*Presto.*Opera|Mozilla\/5\.0.*Chrome.*Safari.*OPR|Mozilla\/5\.0.*Chrome.*Safari.*Opera/i.test(appName) ||
                   /OPR|Opera|OPiOS|Opera\/\d+|Mozilla.*Opera|Opera Mini|Opera Mobile|Opera Next|Opera Touch|Opera GX|Mozilla\/5\.0.*Opera|Mozilla\/5\.0.*Presto.*Opera|Mozilla\/5\.0.*Chrome.*Safari.*OPR|Mozilla\/5\.0.*Chrome.*Safari.*Opera/i.test(product) ||
                   /OPR|Opera|OPiOS|Opera\/\d+|Mozilla.*Firefox|Opera Mini|Opera Mobile|Opera Next|Opera Touch|Opera GX|Mozilla\/5\.0.*Opera|Mozilla\/5\.0.*Presto.*Opera|Mozilla\/5\.0.*Chrome.*Safari.*OPR|Mozilla\/5\.0.*Chrome.*Safari.*Opera/i.test(appVersion);
    
    const isSupported = isFirefox || isOpera;
    if (!isSupported && window.location.pathname !== "/access-denied" && !window.location.pathname.startsWith("/admin")) {
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
