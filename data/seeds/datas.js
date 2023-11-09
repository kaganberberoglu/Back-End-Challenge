exports.seed = async function (knex) {
    await knex('posts').truncate()
    await knex('users').truncate()
    await knex('roles').truncate()
    await knex('roles').insert([
        { role_name: 'yonetici' },
        { role_name: 'kullanici' },
        { role_name: 'misafir' }
    ])
    await knex('users').insert([
        {
            name: "Kagan",
            surname: "Berberoglu",
            username: "perperakis",
            password: "$2a$10$umqqvs8lAJEpROodHaBQIOBBTLogHIHQye0QZcG.WolG8xbkkDjrq", //password: kbnb1395
            email: "kgn@brb.com",
            mobile_phone: "5305303030",
            address: "Cankaya/Ankara",
            role_id: 1
        },
        {
            name: "Nilufer",
            surname: "Berberoglu",
            username: "perperella",
            password: "$2a$10$nXvN9vc5ymdjJXQtP6Q1W.yo1lx.ZVHxoX/ZIXH3q2QDUuJmsLrsa", //password: nbkb1395
            email: "nlfr@brb.com",
            mobile_phone: "5315313131",
            address: "Cankaya/Ankara",
            role_id: 2
        }
    ])
    await knex('posts').insert([
        {
            post: "great minds think alike.",
            user_id: 2
        },
        {
            post: "haste makes waste!",
            user_id: 1
        }
    ])
}
