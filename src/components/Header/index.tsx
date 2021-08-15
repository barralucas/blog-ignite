import Image from 'next/image';


export default function Header() {
  return (
    <header>
      <Image width={40} height={23} src="/images/logo.svg" alt="logo" />
      <h2>spacetraveling</h2>
      <p>.</p>
    </header>
  );
}
