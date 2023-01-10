---
sidebar_position: 3
---

# Data Tables

Since data tables are common in scenario frameworks, Pineapple exposes a few utilities for importing data tables as arbitraries (which makes it easier to try a handful of possibilities).

The library tries to support both Cucumber-style tables and markdown-style tables.

## Header Table

If you'd like the entries to be read in as objects, use "Header Table" to indicate that the first row should be parsed as keys for the table.

```js
/**
 * @pineapple_define
 */
export const Books = HeaderTable('Books', `
| title                                | author      |
| ------------------------------------ | ----------- |
| The Devil in the White City          | Erik Larson |
| The Lion, the Witch and the Wardrobe | C.S. Lewis  |
| In the Garden of Beasts              | Erik Larson |
`)
```

This will pull each of the entries into `#Books`, the name given in the method.

## Array Table

If there is no header, and you'd prefer for each row to be split into an array, use `ArrayTable`.

```js
/**
 * @pineapple_define
 */
export const ArrayBooks = HeaderTable('ArrayBooks', `
| The Devil in the White City          | Erik Larson |
| The Lion, the Witch and the Wardrobe | C.S. Lewis  |
| In the Garden of Beasts              | Erik Larson |
`)
```

## Example Usage

```ts
import { Steps, HeaderTable } from 'pineapple'
import assert from 'assert'

type Book = { title: string, author: string }
const { Given, When, Then, Scenario } = Steps<{ book: Book, inStock: number }>()

Given("a book titled {title} written by {author}", function ({ title, author }) {
    this.book = { title, author }
    this.inStock = library.getCountInStock(this.book)
})

When("I return the book to the library", function () {
    library.return(this.book)
})

Then("there should be one more of this book available in the library", function () {
    assert.equal(this.inStock + 1, library.getCountInStock(this.book))
})

/**
 * @pineapple_define
 */
 export const Books = HeaderTable('Books', `
 | title                                | author      |
 | ------------------------------------ | ----------- |
 | The Devil in the White City          | Erik Larson |
 | The Lion, the Witch and the Wardrobe | C.S. Lewis  |
 | In the Garden of Beasts              | Erik Larson |
 `)


/**
 * The following will run the scenario with each of the books
 * in the table.
 * @test #Books resolves
 */
export const ReturnBooks = Scenario`
Given a book titled {title} written by {author}
When I return the book to the library
Then there should be one more of this book available in the library`
```
