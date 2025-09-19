import React from "react";
import styles from './NavbarComponent.module.css'
export const NavbarComponent = (props) => {
    return(
        <div className={styles.navbar}>
            <h1>Benvenuto, {props.nomeOperaio}</h1>
        </div>
    )
}