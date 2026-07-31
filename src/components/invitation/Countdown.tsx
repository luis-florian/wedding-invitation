"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import styles from "./invitation.module.css";

type CountdownProps = {
  targetDate: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const labels: Array<{ key: keyof TimeLeft; label: string }> = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" }
];

export function Countdown({ targetDate }: CountdownProps) {
  const targetTime = useMemo(() => new Date(targetDate).getTime(), [targetDate]);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetTime));

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft(targetTime));
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [targetTime]);

  return (
    <section className={styles.countdown} aria-label="Cuenta regresiva">
      <p>Nos vemos en...</p>
      <div className={styles.countdownGrid}>
        {labels.map(({ key, label }, index) => (
          <Fragment key={key}>
            <div className={`${styles.countdownItem} ${key === "seconds" ? styles.countdownSeconds : ""}`}>
              <strong>{String(timeLeft[key]).padStart(2, "0")}</strong>
              <span>{label}</span>
            </div>
            {index < labels.length - 1 ? <i className={styles.countdownSeparator} aria-hidden="true">:</i> : null}
          </Fragment>
        ))}
      </div>
    </section>
  );
}

function getTimeLeft(targetTime: number): TimeLeft {
  const difference = Math.max(0, targetTime - Date.now());

  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  };
}
