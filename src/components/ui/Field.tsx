import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import styles from "./field.module.css";

type BaseProps = {
  label: string;
  name: string;
};

export function TextField({ label, ...props }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}

export function TextArea({ label, ...props }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <textarea {...props} />
    </label>
  );
}

export function SelectField({ label, children, ...props }: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <select {...props}>{children}</select>
    </label>
  );
}
