---
sidebar_position: 3
---

# Generating High Quality Input

## Faker.js Support in Pineapple

Starting in `v0.18.0`, Pineapple now has first-class support for [Faker.js](https://fakerjs.dev/), a library that generates high-quality mock data for testing.

 With this new feature, Pineapple users can now apply the `@faker` annotation to create high quality mocks in conjunction with our existing fuzz technology.

```typescript
/* in a `.test.ts` file somewhere */

/**
 * @faker
 */
export function User (faker: Faker): User {
    return {
        userId: faker.datatype.uuid(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        password: faker.internet.password(),
        birthdate: faker.date.birthdate(),
    }
}
```

This function takes in the Faker instance and returns an object that represents a user.

Once you have imported your `User` function (via `@faker`), you can refer to it using `#User` in a `@test` case:

```typescript
/**
 * @test #User
 */
export function register(user: User) {
    return {
        success: true,
        message: `Welcome ${user.username}!`
    }
}
```

Producing output much like the following:
<img alt="An example of the snapshot functionality where the code is modified and the snapshot fails due to a renamed attribute" src="/img/faker.png" width="50%" />
