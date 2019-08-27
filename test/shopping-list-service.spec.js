require('dotenv').config()
const knex = require('knex')
const ShoppingListService = require('../src/shopping-list-service')

describe(`Shopping List Service object`, function () {
    let db
    let testItems = [
        {
            id: 1, 
            name: 'First test',
            date_added: new Date('2019-08-27T16:28:32.615Z'),
            price: "6.67",
            category:'Breakfast',
            checked:false
        },
        {
            id: 2, 
            name: 'Second test',
            date_added: new Date('2016-04-27T16:28:32.615Z'),
            price: "1.24",
            category: 'Lunch',
            checked: false
        },
        {
            id: 3, 
            name: 'Third test',
            date_added: new Date('2017-06-27T16:28:32.615Z'),
            price: "6.00",
            category: 'Main',
            checked: false
        },
        {
            id: 4, 
            name: 'Fourth test',
            date_added: new Date('2030-08-27T16:28:32.615Z'),
            price: "3.00",
            category: 'Snack',
            checked: true
        },
        {
            id: 5, 
            name: 'Fifth test',
            date_added: new Date('2019-08-27T16:28:32.615Z'),
            price: "1.90",
            category: 'Breakfast',
            checked: true
        },

    ]
    before(()=> {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
    })
    before(() => db('shopping_list').truncate())
    afterEach(() => db('shopping_list').truncate())
    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
            .into('shopping_list')
            .insert(testItems)
        })
        it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
            return ShoppingListService.getAllItems(db)
            .then(actual => {
                expect(actual).to.eql(testItems)
            })
        })
        it(`getByID() resolves article by id from 'shopping_list' table`, () => {
            const idToGet = 2
            const secondItem = testItems[idToGet - 1]
            return ShoppingListService.getById(db, idToGet)
            .then(actual => {
                expect(actual).to.eql({
                    id: idToGet,
                    name: secondItem.name,
                    date_added: secondItem.date_added,
                    price: secondItem.price,
                    category: secondItem.category,
                    checked: secondItem.checked,

                })
            })
        })
            it(`deleteItem() removes an article by id from 'shopping_list' table`, () => {
                const itemToDelete = 2
                return ShoppingListService.deleteItem(db, itemToDelete)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                    const expected = testItems
                    .filter(article => article.id !== itemToDelete)
                    expect(allItems).to.eql(expected)
                })
             })
             it(`updateItem() updates an article from the 'shopping_list' table`, () => {
                const idForUpdate = 2
                const newItemData = {
                     name: 'updated item',
                     price: "1.24",
                    date_added: new Date(),
                    checked: true,
                    category: "Main"
                }
                return ShoppingListService.updateItem(db, newItemData, idForUpdate)
                .then(() => ShoppingListService.getById(db, idForUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idForUpdate,
                        ...newItemData
                    })
                })
             })  
         })
         context(`Given 'shopping_list' has no data`, () => {
            it(`insertItem() inserts an article and resolves the article with an 'id'`, () =>{
                    const newItem = {
                        name: 'updated item',
                        price: "1.24",
                       date_added: new Date(),
                       checked: true,
                       category: "Main"
                   }
                   return ShoppingListService.insertItem(db, newItem)
                   .then(actual => {
                       expect(actual).to.eql({
                           id: 1,
                           ...newItem
                       })               
                    })
                }) 
            })
    })
    
