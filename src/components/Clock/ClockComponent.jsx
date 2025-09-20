import React, { useState, useEffect } from "react";
import styles from './ClockComponent.module.css'

export default function ClockComponent() {
  const [date, setDate] = useState(new Date());
  let interval;
  useEffect(() => {
    interval = setInterval(() => {
      tick();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const tick = () => {
    setDate(new Date());
  };

  const format = val => {
    if (val < 10) {
      val = "0" + val;
    }
    return val;
  };
  return (
    <div className={styles.date}>
      <p>{`${date.getHours()} : ${format(date.getMinutes())} : 
      ${format(date.getSeconds())}`}</p>
    </div>
  );
}