import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/account/AccountContainer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SubmitButton from "../inputs/SubmitButton";
import Alert from "../inputs/Alert";
export function Input(props) {
  return (
    <div className={styles.input}>
      {props.LeftIcon}
      <input
        type={props.type}
        required={props.isRequired}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.handleChange}
        disabled={props.disabled}
        style={{ color: props.disabled ? "grey" : "initial" }}
      />
      {props.RightIcon}
    </div>
  );
}
Input.propTypes = {
  type: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  LeftIcon: PropTypes.element,
  RightIcon: PropTypes.element,
};

function AccountContainer(props) {
  return (
    <div className={styles.container}>
      <div className={styles.wapper}>
        <div className={styles.right}>
          <h1 className={styles.right_title}>ANDMAG GROUND</h1>
          <p className={styles.msg}>
            En créant un compte, vous avez la possibilité d'interagir avec
            d'autre utilisateurs de la communauté.
          </p>
        </div>
        <div className={styles.left}>
          <h1 className={styles.left_title}>{props.title}</h1>
          {props.message ? <p>{props.message}</p> : null}
          {props.error && <Alert type="danger" message={props.error} />}
          {props.success && <Alert type="success" message={props.success} />}
          <form className={styles.form} onSubmit={props.handleSubmit}>
            {props.Form}
            {props.btnMsg ? (
              <SubmitButton
                text={props.btnMsg}
                loading={props.loading}
                progress={25}
              />
            ) : null}
          </form>
          <div className={styles.options}>{props.LinkOptions}</div>
        </div>
      </div>
    </div>
  );
}
AccountContainer.propTypes = {
  Form: PropTypes.element,
  title: PropTypes.string,
  message: PropTypes.string,
  btnMsg: PropTypes.string,
  LinkOptions: PropTypes.element,
  handleSubmit: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
  success: PropTypes.string,
};

export default AccountContainer;
