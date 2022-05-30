import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Great for Coverage Testing',
    Svg: require('@site/static/img/feature-01.svg').default,
    description: (
      <>
        Pineapple makes it ergonomic to work within your code files &amp; generates source maps for the transpilation modes.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    Svg: require('@site/static/img/feature-02.svg').default,
    description: (
      <>
        Pineapple tries to make it simple to get to the point with your tests, so that you can focus on writing code.
      </>
    ),
  },
  {
    title: 'Empower your Users',
    Svg: require('@site/static/img/feature-03.svg').default,
    description: (
      <>
        Providing Pineapple test cases can make it simpler for your users &amp; developers to find examples on how to call your APIs.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
