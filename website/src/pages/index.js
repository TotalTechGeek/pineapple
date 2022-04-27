import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

function LogoHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <img src='./img/pineapple.png' />
        <div className={styles.buttons}>
          <h3>A testing framework for humans.</h3>
        </div>
      </div>
    </header>
  );
}

function OtherHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.buttons}>
           <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Pineapple Quickstart - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <LogoHeader />
      <OtherHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
