import { Faker } from '@faker-js/faker'

type User = {
    userId: string,
    username: string,
    email: string,
    avatar: string,
    password: string,
    birthdate: Date,
}

/**
 * @faker
 */
export function User (faker: Faker): User {
    return {
        userId: faker.string.uuid(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        password: faker.internet.password(),
        birthdate: faker.date.birthdate(),
    }
}

/**
 * @faker
 */
export function InvalidUser (faker: Faker): User {
    return {
        userId: faker.string.uuid(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        password: '',
        birthdate: faker.date.birthdate(),
    }
}

/**
 * @test #User returns @.message === cat('Welcome ', args.0.username, '!')
 * @test #InvalidUser throws 'Password is required'
 * @test #User()
 */
/**
 * Registers a user
 */
export function register(user: User) {
    if (!user.password) throw new Error('Password is required')
    return {
        success: true,
        message: `Welcome ${user.username}!`
    }
}

/**
 * Making use of faker's helpers.
 * @test #person.fullName returns cat('Hi ', args.0, '!')
 * @test #airline.airline().name returns cat("Hi ", args.0, "!")
 */
export function sayHi(name: string) {
    return `Hi ${name}!`
}