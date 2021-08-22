import Image from 'next/image';
import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.container}>
      <Image width={40} height={23} src="/images/logo.svg" alt="logo" />
      <div className={styles.content}>
      <h2>spacetraveling</h2>
      <p>.</p>
      </div>
    </header>
  );
}
