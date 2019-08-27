const ShoppingListService = {
    getAllItems(knex) {
        return knex
        .from('shopping_list')
        .select('*')
        },

    getById(knex, id) {
        return knex
        .from('shopping_list')
        .select('*')
        .where('id', id)
        .first()
    },

    updateItem(knex, updateItem, id) {
        return knex('shopping_list')
        .where({ id })
        .update(updateItem)
    },
    
    deleteItem(knex, id) {
        return knex('shopping_list')
        .where({ id })
        .delete()
    },

    insertItem(knex, newItem) {
        return knex
        .insert(newItem)
        .into('shopping_list')
        .returning('*')
        .then(rows => rows[0])
    },
}

module.exports = ShoppingListService