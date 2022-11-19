---
sidebar_position: 2
---

# Continuous Testing

Starting in v0.11.0, Pineapple is capable of running tests continuously while you make changes to your project.

If you start Pineapple with the `-w` or `--watch-mode` flags, Pineapple will watch for filesystem events to be emitted
and will run all relevant tests.

Pineapple will do its best to traverse (static) dependencies to determine which tests need to be run for a given modification, so if you modify file A, and it's either directly or indirectly imported by file B, it will run all of the tests in file B.

<img alt="An example of the snapshot functionality where the code is modified and the snapshot fails due to a renamed attribute" src="../img/continuous.png" width="50%" />
