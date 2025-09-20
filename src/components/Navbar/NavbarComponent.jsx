import React from "react";
import styles from './NavbarComponent.module.css'
export const NavbarComponent = (props) => {
    return(
        <div className={styles.navbar}>
            <div className={styles.title}>Timbrature App</div>
            <div className={styles.userInfo}>
                <span>Benvenuto, {props.nomeOperaio}</span>
            </div>
        </div>
    )
}