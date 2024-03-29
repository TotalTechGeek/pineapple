import React from 'react'
import clsx from 'clsx'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import styles from './index.module.css'
import HomepageFeatures from '@site/src/components/HomepageFeatures'
import Head from '@docusaurus/Head'

function LogoHeader () {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <img src='./img/pineapple.png' />
        <div className={styles.buttons}>
          <h3>Make your tests sweet!</h3>
        </div>
      </div>
    </header>
  )
}

function OtherHeader () {
  const { siteConfig } = useDocusaurusContext()
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
  )
}

export default function Home () {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Make your tests sweet!">
        <Head>
          <meta property='og:image' content='./img/pineapple.png'/>
        </Head>
      <LogoHeader />
      <OtherHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  )
}
