const db = require('../../data/db-config');

/* const get = () => {
    return db('users');
}; */

const get = () => {
    return db("users as u")
        .leftJoin("roles as r", "r.role_id", "u.role_id")
        .select("u.*", "r.role_name");
};

/* const getById = (id) => {
    return db('users')
        .where({ id })
        .first();
}; */

const getById = (id) => {
    return db("users as u")
        .leftJoin("roles as r", "r.role_id", "u.role_id")
        .select("u.*", "r.role_name")
        .where("u.user_id", id)
        .first();
};

/* const getByUsername = (username) => {
    return db('users')
        .where('username', username)
        .first();
}; */

const getByUsername = username => {
    return db("users as u")
        .leftJoin("roles as r", "r.role_id", "u.role_id")
        .select("u.*", "r.role_name")
        .where("u.username", username)
        .first();
};

/* const getByEmail = (email) => {
    return db('users')
        .where('email', email)
        .first();
}; */

const getByEmail = email => {
    return db("users as u")
        .leftJoin("roles as r", "r.role_id", "u.role_id")
        .select("u.*", "r.role_name")
        .where("u.email", email)
        .first();
};

/* const getByMobilePhone = (mobile_phone) => {
    return db('users')
        .where('mobile_phone', mobile_phone)
        .first();
}; */

const getByMobilePhone = mobile_phone => {
    return db("users as u")
        .leftJoin("roles as r", "r.role_id", "u.role_id")
        .select("u.*", "r.role_name")
        .where("u.mobile_phone", mobile_phone)
        .first();
};

/* const insert = (user) => {
    return db('users')
        .insert(user)
        .then(newUsers => {
            return getById(newUsers[0]);
        });
}; */

async function insert({ name, surname, username, password, email, mobile_phone, address, role_name }) {
    let created_user_id
    await db.transaction(async trx => {
        let role_id_to_use
        const [role] = await trx('roles').where('role_name', role_name);
        if (role) {
            role_id_to_use = role.role_id;
        } else {
            const [role_id] = await trx('roles').insert({ role_name: role_name });
            role_id_to_use = role_id;
        }
        const [user_id] = await trx('users').insert({ name, surname, username, password, email, mobile_phone, address, role_id: role_id_to_use });
        created_user_id = user_id;
    })
    return getById(created_user_id);
};

const update = (user_id, changes) => {
    return db('users')
        .where({ user_id })
        .update(changes)
        .then(x => {
            return getById(user_id);
        });
};

const remove = (user_id) => {
    return db('users')
        .where('user_id', user_id)
        .del();
};

module.exports = {
    get,
    getById,
    insert,
    update,
    remove,
    getByUsername,
    getByEmail,
    getByMobilePhone
};
