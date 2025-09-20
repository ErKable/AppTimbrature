import React from "react";
import styles from './GlassCardComponent.module.css';
import MapComponent from "../Map/MapComponent";

export const GlassCardComponent = ({children, location, customClassName}) => {
        return(
            <div className={`${styles.card} ${customClassName || ''}`}>
                {children}
                {location && <MapComponent lat={location.lat} lng={location.lng} />}
            </div>
        )

}