import Image from "next/image";
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <main className={styles.page} aria-label="Nathaly y Luis">
      <Image
        src="/images/invitation/redesign/logo-boda.svg"
        alt="Nathaly y Luis"
        width={520}
        height={320}
        className={styles.logo}
        priority
      />
    </main>
  );
}
