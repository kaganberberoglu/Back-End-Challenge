const request = require("supertest");
const server = require("./server");
const db = require("../data/db-config");
const bcryptjs = require("bcryptjs");

beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
    await db.seed.run();
});

afterAll(async () => {
    await db.destroy();
});

test('[0] Testler çalışır durumda:)]', () => {
    expect(true).toBe(true);
});

describe("Users Test", () => {
    it("[1] Register başarılı mı?", async () => {
        //arrange
        const sampleModel = {
            "name": "Nermin",
            "surname": "Berberoglu",
            "username": "nrmn",
            "password": "nb1965",
            "email": "nrmn@brb.com",
            "mobile_phone": "5335333333",
            "address": "Çankaya/Ankara",
            "role_name": "kullanici"
        };
        //act
        const result = await request(server)
            .post("/api/users")
            .send(sampleModel);
        //assert
        expect(result.status).toBe(201);
        expect(result.body.user_id).toBeGreaterThan(2);
    });

    it("[2] Password hashleniyor mu?", async () => {
        //arrange
        const sampleModel = {
            "name": "Nermin",
            "surname": "Berberoglu",
            "username": "nrmn1",
            "password": "nb1965",
            "email": "nrmn1@brb.com",
            "mobile_phone": "5335333334",
            "address": "Çankaya/Ankara",
            "role_name": "kullanici"
        };
        //act
        const result = await request(server)
            .post("/api/users")
            .send(sampleModel);
        const isHashed = bcryptjs.compareSync(sampleModel.password, result.body.password);
        //assert
        expect(result.status).toBe(201);
        expect(isHashed).toBeTruthy();
    });

    it("[3] Login token dönüyor mu?", async () => {
        //arrange
        const sampleModel = {
            "username": "nrmn",
            "password": "nb1965"
        };
        //act
        const result = await request(server)
            .post("/api/users/login")
            .send(sampleModel);
        //assert
        expect(result.status).toBe(200);
        expect(result.body.token).toBeDefined();
    });

    it("[4] Login eksik payload durumunda hata dönüyor mu?", async () => {
        //arrange
        const sampleModel = {
            "username": "nrmn1"
        };
        //act
        const result = await request(server)
            .post("/api/users/login")
            .send(sampleModel);
        //assert
        expect(result.status).toBe(400);
    });

    it("[5] Token geçerli ise; limited verilerine ulaşabiliyor mu?", async () => {
        //arrange
        const sampleModel = {
            "username": "nrmn",
            "password": "nb1965"
        };
        //act
        const loginResult = await request(server)
            .post("/api/users/login")
            .send(sampleModel);
        const result = await request(server)
            .get("/api/users/limited/allUsers")
            .set('authorization', loginResult.body.token);
        //assert
        expect(result.status).toBe(200);
        expect(result.body.length).toBeGreaterThan(2);
    });

    it("[6] Logout olmuş bir kullanıcıda limited verileri çalışıyor mu?", async () => {
        //arrange
        const sampleModel = {
            "username": "nrmn",
            "password": "nb1965"
        };
        //act
        const loginResult = await request(server)
            .post("/api/users/login")
            .send(sampleModel);
        await request(server).post("/api/users/logout")
            .send()
            .set('authorization', loginResult.body.token);
        const result = await request(server)
            .get("/api/users/limited/allUsers")
            .set('authorization', loginResult.body.token);
        //assert
        expect(result.status).toBe(400);
        expect(result.body.message).toBe("daha önce çıkış yapılmış, tekrar giriş yapınız!");
    });

    it("[7] Rolü yönetici olmayan bir kişi ilgili id verilerine ulaşabilir mi?", async () => {
        //arrange
        const sampleModel = {
            "username": "nrmn1",
            "password": "nb1965"
        };
        //act
        const loginResult = await request(server)
            .post("/api/users/login")
            .send(sampleModel);
        const result = await request(server)
            .get("/api/users/secret/1")
            .set('authorization', loginResult.body.token);
        //assert
        expect(result.status).toBe(403);
        expect(result.body.message).toBe("bu işlem için yetkiniz bulunmamaktadır!");
    });

    it("[8] Post ekleme işlemi başarılı mı?", async () => {
        //arrange
        const sampleModel = {
            "post": "never say never!",
            "username": "nrmn"
        };
        //act
        const result = await request(server)
            .post("/api/posts")
            .send(sampleModel);
        //assert
        expect(result.status).toBe(201);
        expect(result.body.post_id).toBeGreaterThan(2);
    });

    it("[9] Post güncelleme işlemi başarılı mı?", async () => {
        //arrange
        const sampleModel = {
            "post": "never say never maaaaannn!"
        };
        //act
        const result = await request(server)
            .put("/api/posts/3")
            .send(sampleModel);
        //assert
        expect(result.status).toBe(200);
    });
});
