import React from "react"
import styles from './GlassCardComponent.module.css'
export const GlassCardComponent = ({children, displayInfo, isMobile}) => {
        console.log("Card componet isMobile: "+isMobile)
        return(
            <div className = {`${displayInfo ? styles.upperLayerColumn : styles.upperLayer}
                                ${isMobile ? styles.mobile : styles.desktop}`}>
                {children}
            </div>
        )

}