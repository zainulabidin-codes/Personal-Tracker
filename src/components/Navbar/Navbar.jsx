import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

const NAV_ITEMS = [
  { label: 'Dashboard', target: '#hero' },
  { label: 'Daily', target: '#daily' },
  { label: 'Weekly', target: '#weekly' },
  { label: 'Monthly', target: '#monthly' },
  { label: 'Stats', target: '#stats' },
];

export default function Navbar() {
  const [active, setActive] = useState('#hero');

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.querySelector(item.target)
    ).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function handleClick(e, target) {
    e.preventDefault();
    setActive(target);
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <nav className={styles.navbar}>
      <ul className={styles.links}>
        {NAV_ITEMS.map((item) => (
          <li key={item.target}>
            <a
              href={item.target}
              className={`${styles.link} ${
                active === item.target ? styles.active : ''
              }`}
              onClick={(e) => handleClick(e, item.target)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
