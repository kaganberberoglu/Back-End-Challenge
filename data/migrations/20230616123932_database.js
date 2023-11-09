exports.up = function (knex) {
    return knex.schema
        .createTable('roles', tbl => {
            tbl.increments('role_id');
            tbl.string('role_name', 32).notNullable().unique();
        })
        .createTable('users', tbl => {
            tbl.increments('user_id');
            tbl.string('name').notNullable();
            tbl.string('surname').notNullable();
            tbl.string('username', 255).notNullable().unique();
            tbl.string('password', 255).notNullable();
            tbl.string('email').notNullable().unique();
            tbl.string('mobile_phone').notNullable().unique();
            tbl.string('address').notNullable();
            tbl.integer('role_id')
                .unsigned()
                .notNullable()
                .references('role_id')
                .inTable('roles')
                .onUpdate('RESTRICT')
                .onDelete('RESTRICT');
        })
        .createTable('posts', tbl => {
            tbl.increments('post_id');
            tbl.string('post', 280).notNullable();
            tbl.integer('user_id')
                .unsigned()
                .notNullable()
                .references('user_id')
                .inTable('users')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
        })
        .createTable('tokenBlackList', tbl => {
            tbl.increments('token_id');
            tbl.string('token').notNullable();
            tbl.timestamp('createdate').defaultTo(knex.fn.now());
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('tokenBlackList')
        .dropTableIfExists('posts')
        .dropTableIfExists('users')
        .dropTableIfExists('roles')
}
