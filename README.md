## About

This package is for retrieving posts/categories/tags directly from wordpress database.

Written in TypeScript and type declarations are provided.

## Usage

### Installation

```console
$ npm i wpdb-js mysql2
```

### Initialization

[knex.js](https://knexjs.org/) is used internally. knex-style config should be passed at initialization.

```js
const db = require('wpdb-js')({
  client: "mysql2",
  connection: {
    host: "...",
    user: "...",
    password: "...",
    database: "...",
  },
});
```

### Methods

#### listCategories

```js
db.listCategories()
  .then(categories => {
    // categories is like
    // [
    //   {
    //     id: 1,
    //     slug: 'category1',
    //     name: 'Category 1',
    //     parent: null,
    //   },
    //   {
    //     id: 2,
    //     slug: 'category2',
    //     name: 'Category 2',
    //     parent: {
    //       id: 1,
    //       slug: 'category1',
    //       name: 'Category 1',
    //     },
    //   },
    // ]
  });
```

#### listTags

```js
db.listTags()
  .then(tags => {
    // tags is like
    // [
    //   { id: 10, slug: 'tag1', name: 'Tag 1' },
    //   { id: 20, slug: 'tag2', name: 'Tag 2' },
    // ]
  });
```

#### listPosts

```js
db.listPosts()
  .then(posts => {
    // posts is like
    // [
    //   {
    //     id: 100,
    //     excerpt: 'excerpt1',
    //     modified: new Date(1),
    //     published: new Date(6),
    //     title: 'title1',
    //     status: 'publish',
    //     author: {
    //       id: 1,
    //       displayName: '',
    //     },
    //     thumbnail: {
    //       width: 100,
    //       height: 100,
    //       file: '',
    //     },
    //   },
    // ]
  });
```

```js
// sort posts (ascending order)
db.listPosts({ sortBy: 'id' })
db.listPosts({ sortBy: 'published' })
db.listPosts({ sortBy: 'modified' })
// sort posts (descending order)
db.listPosts({ sortBy: 'id', order: 'desc' })
// filter by status
db.listPosts({ status: 'publish' })
db.listPosts({ status: 'draft' })
// filter by category id
db.listPosts({ categoryId: 1 })
// filter by tag id
db.listPosts({ tagId: 10 })
// set limit/offset
db.listPosts({ limit: 100 })
db.listPosts({ limit: 100, offset: 100 })
```

#### findCategory

```js
db.findCategory({ id: 1 })
  .then(category => {
    // `category` is like
    // {
    //   id: 1,
    //   slug: 'category1',
    //   name: 'Category 1',
    //   parent: null,
    //   children: [
    //     { id: 3, slug: 'category3', name: 'Category 3' },
    //     { id: 4, slug: 'category4', name: 'Category 4' },
    //   ],
    // }
  });
```

#### findTag

```js
db.findTag({ id: 10 })
  .then(tag => {
    // `tag` is like
    // {
    //   id: 10,
    //   slug: 'tag1',
    //   name: 'Tag 1',
    // }
  });
```

#### findPost

```js
db.findPost({ id: 100 })
  .then(post => {
    // `post` is like
    // {
    //   id: 100,
    //   excerpt: 'excerpt1',
    //   modified: new Date(1),
    //   published: new Date(6),
    //   title: 'title1',
    //   content: 'content1',
    //   author: {
    //     id: 1,
    //     displayName: '',
    //   },
    //   tags: [
    //     {
    //       id: 10,
    //       slug: 'tag1',
    //       name: 'Tag 1',
    //     },
    //     {
    //       id: 20,
    //       slug: 'tag2',
    //       name: 'Tag 2',
    //     },
    //   ],
    //   categories: [
    //     {
    //       id: 1,
    //       slug: 'category1',
    //       parent: null,
    //     },
    //   ],
    //   thumbnail: {
    //     file: '',
    //     width: 100,
    //     height: 100,
    //   },
    // }
  });
```
