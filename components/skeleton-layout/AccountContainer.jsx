import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/account/AccountContainer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SubmitButton from "../inputs/SubmitButton";
import Alert from "../inputs/Alert";
import Link from "next/link";
import { domainName } from "../links/AwesomeLink.type";
import {
  faContactCard,
  faEnvelope,
  faGear,
  faSignInAlt,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

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
            {
              "En créant un compte, vous avez la possibilité d'interagir avec d'autre utilisateurs de la communauté."
            }
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
          {props.otherLinks && (
            <div className={styles.options}>
              {props.otherLinks.includes("login") && (
                <Link href={`${domainName}/account/login`}>
                  <a>
                    <FontAwesomeIcon icon={faSignInAlt} />
                    Se connecter
                  </a>
                </Link>
              )}
              {props.otherLinks.includes("register") && (
                <Link href={`${domainName}/account/register`}>
                  <a>
                    <FontAwesomeIcon icon={faUserPlus} />
                    Créer un compte
                  </a>
                </Link>
              )}
              {props.otherLinks.includes("with-email") && (
                <Link href={`${domainName}/account/login-with-email-link`}>
                  <a>
                    <FontAwesomeIcon icon={faEnvelope} />
                    Utiliser mon email
                  </a>
                </Link>
              )}
              {props.otherLinks.includes("forgot-password") && (
                <Link href={`${domainName}/account/forgotPassword`}>
                  <a>
                    <FontAwesomeIcon icon={faGear} />
                    Mot de passe oublié
                  </a>
                </Link>
              )}
              {props.otherLinks.includes("account-activation") && (
                <Link href={`${domainName}/account/account-activation`}>
                  <a>
                    <FontAwesomeIcon icon={faContactCard} />
                    Activer mon compte
                  </a>
                </Link>
              )}
            </div>
          )}
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
  handleSubmit: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
  success: PropTypes.string,
  otherLinks: PropTypes.array,
};

export default AccountContainer;
