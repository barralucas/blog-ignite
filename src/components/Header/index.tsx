import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import styles from './header.module.scss';

export default function Header() {
  return (
    <Link href="/">
      <a className={styles.link}>
        <header className={styles.container}>
          <Image width={40} height={23} src="/images/logo.svg" alt="logo" />
          <div className={styles.content}>
            <h2>spacetraveling</h2>
            <p>.</p>
          </div>
        </header>
      </a>
    </Link>
  );
}