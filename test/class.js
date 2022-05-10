
/**
 * A basic bank account class; allows for withdrawing & depositing money.
 * 
 * @test 100 
 * ~> $.withdraw(10) 
 * ~> $.deposit(20) returns $.balance === 110
 * 
 * @test 0 
 * ~> $.withdraw(100) throws 'Insufficient funds'
 * 
 * @test 0 
 * ~> $.deposit(30) 
 * ~> $.deposit(10) returns $.balance === 40 
 * ~> $.withdraw(20) 
 * ~> $.withdraw(30) throws 'Insufficient funds'
 * 
 * @test 100 
 * ~> $.withdraw(-10) throws 
 * ~> $.deposit(-10) throws
 */
 export class Account {
    constructor(balance) {
        this.balance = balance
    }

    withdraw (amount) {
        if (amount < 0) throw new Error('Amount must be greater than zero')
        if (this.balance < amount) {
            throw new Error('Insufficient funds')
        }
        this.balance -= amount
    }

    deposit (amount) {
        if (amount < 0) throw new Error('Amount must be greater than zero')
        this.balance += amount
    }
}



/**
 * A basic bank account class; allows for withdrawing & depositing money.
 * 
 * @test 50 
 * ~> $.deposit(30) returns 80 
 * ~> $.withdraw(20) returns 60
 * 
 * @test 0 
 * ~> $.deposit(10) 
 * ~> $.deposit(30) returns 40 
 * ~> $.withdraw(5) returns @ === 35 and $.transactions === 3
 */
 export class Account2 {
    constructor(balance) {
        this.balance = balance
        this.transactions = 0
    }

    withdraw (amount) {
        if (amount < 0) throw new Error('Amount must be greater than zero')
        if (this.balance < amount) throw new Error('Insufficient funds')
        this.balance -= amount
        this.transactions++
        return this.balance
    }

    deposit (amount) {
        if (amount < 0) throw new Error('Amount must be greater than zero')
        this.balance += amount
        this.transactions++
        return this.balance
    }
}


/**
 * @test 10 ~> $.getAdd() ~> 5 returns 15
 */
export class Adder {
    constructor(value) {
        this.value = value
    }

    getAdd () {
        return num => num + this.value 
    }
}

/**
 * @test_static $.add(5, 3) returns 8
 * @test_static $.getPrevious() returns 8
 */
 export class Math {
    static previousResult = null
    static add(a, b) {
        return this.previousResult = a + b
    }

    static getPrevious() {
        return this.previousResult
    }
}


/**
 * @pineapple_import 
 */
export function setPersonCount (to = 0) {
    Person.count = to
}

/**
 * @test 'Jesse', 24 
 * ~> $.grow(3)
 * ~> $.grow(2) returns 29
 * 
 * @test 'Rick', 62 
 * ~> $.grow(1) returns 63
 * ~> $.grow(2) returns 65
 * ~> $.getName() returns 'Rick'
 * ~> $.grow() returns $.age === 66
 */
export class Person {
    constructor(name, age) {
        this.name = name
        this.age = age
    }

    grow(amount = 1) {
        return this.age += amount
    }

    getName() {
        return this.name
    }
}

