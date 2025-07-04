import { toast } from "react-toastify";
import { Check } from "../Icon/Check";
import { Error } from "../Icon/Error";
import "react-toastify/dist/ReactToastify.css";
import classes from "./NotificationService.module.scss";

//Уведомление о успехе
export function SucNot(content: string) {
  toast.success(
    <div className={classes.NotificationContent}>
      <Check className={classes.NotificationIcon} /> {content}
    </div>,
    {
      className: classes.NotificationSuccess,
    },
  );
}

//Уведомление о ошибке
export function ErrNot(content: string) {
  toast.error(
    <div className={classes.NotificationContent}>
      <Error className={classes.NotificationIcon} /> {content}
    </div>,
    {
      className: classes.NotificationError,
    },
  );
}

//Уведомление для обучения
export function TutorialNot(content: string) {
  toast.info(
    <div className={classes.NotificationContent}>
      <span role="img" aria-label="tutorial" className={classes.NotificationIcon}>💡</span> 
      {content}
    </div>,
    {
      className: classes.NotificationTutorial,
      autoClose: 10000, // 10 секунд
      position: "bottom-right",
    },
  );
}
