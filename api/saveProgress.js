const { CosmosClient } = require("@azure/cosmos");

// سيقوم Azure بجلب هذه القيم من الـ Configuration التي سنضبطها لاحقاً
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;

const client = new CosmosClient({ endpoint, key });

module.exports = async function (context, req) {
    context.log('جاري معالجة طلب حفظ البيانات...');

    // التأكد من وجود بيانات في الطلب
    if (!req.body || !req.body.userId) {
        context.res = {
            status: 400,
            body: "خطأ: بيانات اللاعب ناقصة (userId مطلوب)"
        };
        return;
    }

    try {
        const database = client.database("DamaData");
        const container = database.container("Players");

        const playerData = req.body;

        // استخدام upsert: تحديث إذا موجود، إنشاء إذا غير موجود
        const { resource } = await container.items.upsert(playerData);

        context.res = {
            status: 200,
            body: {
                message: "تم الحفظ بنجاح في سحابة Azure",
                savedData: resource
            }
        };
    } catch (error) {
        context.log.error("خطأ في قاعدة البيانات:", error.message);
        context.res = {
            status: 500,
            body: "فشل الحفظ في السحاب: " + error.message
        };
    }
};