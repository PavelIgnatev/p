import classes from "./BaseFooter.module.scss";

export const BaseFooter = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.content}>
        Developed in{" "}
        <a
          href="https://webgrow.dev"
          target="_blank"
          rel="noreferrer"
          className={classes.a}
        >
          webgrow.dev
        </a>
      </div>
    </footer>
  );
};
