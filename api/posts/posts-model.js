const db = require('../../data/db-config');

/* const get = () => {
    return db('posts');
}; */

const get = () => {
    return db("posts as p")
        .leftJoin("users as u", "u.user_id", "p.user_id")
        .select("p.*", "u.username");
};

/* const getById = (id) => {
    return db('posts')
        .where({ id })
        .first();
}; */

const getById = (id) => {
    return db("posts as p")
        .leftJoin("users as u", "u.user_id", "p.user_id")
        .select("p.*", "u.username")
        .where("p.post_id", id)
        .first();
};

/* const getByUsername = (username) => {
    return db('posts')
        .where('username', username)
        .first();
}; */

const getByUsername = (username) => {
    return db("posts as p")
        .leftJoin("users as u", "u.user_id", "p.user_id")
        .select("p.*", "u.username")
        .where("u.username", username)
        .first();
};

/* const insert = (post) => {
    return db('posts')
        .insert(post)
        .then(newPosts => {
            return getById(newPosts[0]);
        });
}; */

async function insert({ post, username }) {
    let created_post_id
    await db.transaction(async trx => {
        let user_id_to_use
        const [user] = await trx("users").where("username", username);
        if (user) {
            user_id_to_use = user.user_id;
        } else {
            const [user_id] = await trx("users").insert({ username: username });
            user_id_to_use = user_id;
        }
        const [post_id] = await trx("posts").insert({ post, user_id: user_id_to_use });
        created_post_id = post_id;
    })
    return getById(created_post_id);
};

const update = (post_id, changes) => {
    return db('posts')
        .where({ post_id })
        .update(changes)
        .then(x => {
            return getById(post_id);
        });
};

const remove = (post_id) => {
    return db('posts')
        .where('post_id', post_id)
        .del();
};

module.exports = {
    get,
    getById,
    getByUsername,
    insert,
    update,
    remove
};
