import { prisma } from "~/services/db.server";

// await prisma.category.create({
//     data: {
//         name: ""
//     }
// });
await Promise.all([
    { id: "03adc874-b3dc-496c-91dd-3a76d5528faf", name: "Desktop", sort: 1, parent: "3964586c-55a6-4c06-8ff4-3dc00fe75a86" },
    { id: "6addc481-e9a3-41a5-b888-eaa6d69fc54d", name: "Clothing", sort: 1, parent: null, imageUrl: "https://cdn.aliengearholsters.com/media/wysiwyg/mens-suit-for-ccw.jp" },
    { id: "3964586c-55a6-4c06-8ff4-3dc00fe75a86", name: "Electronic & Technology", sort: 0, parent: null, imageUrl: "https://static.ebayinc.com/static/assets/Uploads/Stories/Articles/_resampled/ScaleWidthWyI4MDAiXQ/eBay-Adds-Select-Samsung-Galaxy-Products-to-Refurbished-Program.jpeg?v=" },
    { id: "78afc870-9ed1-49ad-8037-a3a7b231c79f", name: "Skincare & Makeup", sort: 2, parent: null, imageUrl: "https://www.nykaa.com/beauty-blog/wp-content/uploads/images/issue286/EVERYTHING-YOU-NEED-TO-KNOW-ABOUT-LANEIGES-NEW-SKINCARE-SQUAD_OI.jp" },
    { id: "a8e49365-6e50-43f8-a193-40116e4f4264", name: "Food & Groceries", sort: 2, parent: null, imageUrl: "https://hips.hearstapps.com/hmg-prod/images/hungryroot-1658507018.pn" },
    { id: "dfabfe30-ff69-4c84-ad0b-1f0ce09fc897", name: "Mobile phones", sort: 2, parent: "3964586c-55a6-4c06-8ff4-3dc00fe75a86" },
    { id: "fa97ccdf-6ec1-436c-9a9d-9c3ab88f1cf2", name: "Televisions & Entertainment", sort: 3, parent: "3964586c-55a6-4c06-8ff4-3dc00fe75a86" },
    { id: "62e08166-1ef6-42da-b10b-c10afe95d7ac", name: "Monitors", sort: 1, parent: "03adc874-b3dc-496c-91dd-3a76d5528faf" },
    { id: "5497992c-8eab-430a-9fa2-d99a4c411fe4", name: "Gaming", sort: 0, parent: "03adc874-b3dc-496c-91dd-3a76d5528faf" },
    { id: "fdd6e068-4f4b-4b01-b1cc-f26cd7b92689", name: "Men", sort: 0, parent: "6addc481-e9a3-41a5-b888-eaa6d69fc54d" },
    { id: "1db661c7-ea53-4f0b-888c-e6542caa44cc", name: "Top", sort: 0, parent: "fdd6e068-4f4b-4b01-b1cc-f26cd7b92689" },
    { id: "6b40e55f-8bd0-4614-9038-e68328812dd9", name: "Top", sort: 0, parent: "85c13691-5079-45fc-a125-3921c4fbbc93" },
    { id: "85c13691-5079-45fc-a125-3921c4fbbc93", name: "Women", sort: 1, parent: "6addc481-e9a3-41a5-b888-eaa6d69fc54d" },
    { id: "d2948632-a04b-41c2-9d5e-28c6c99e7ea0", name: "Snacks", sort: 1,  parent: "a8e49365-6e50-43f8-a193-40116e4f4264" },
    { id: "b9a298cd-3c42-42e9-a63b-c01bfdd7684d", name: "Meat", sort: 0, parent: "a8e49365-6e50-43f8-a193-40116e4f4264" },
    { id: "29e1e49d-3343-499d-8c59-7b33ad36dd17", name: "Drinks", sort: 2, parent: "a8e49365-6e50-43f8-a193-40116e4f4264" },
    { id: "b79cdb27-94a0-4696-b8d9-25be72dac503", name: "Lamb", sort: 1, parent: "b9a298cd-3c42-42e9-a63b-c01bfdd7684d" },
    { id: "beae6bfe-2a6e-48bf-87c0-640b7f32b8c4", name: "Beef", sort: 0, parent: "b9a298cd-3c42-42e9-a63b-c01bfdd7684d" },
    { id: "192e48ff-7338-443d-be46-8100177c32e9", name: "Fish", sort: 2, parent: "b9a298cd-3c42-42e9-a63b-c01bfdd7684d" },
    { id: "a5ad2d74-99bd-4342-a2ef-06ea8ef3ed88", name: "Canned", sort: 1, parent: "29e1e49d-3343-499d-8c59-7b33ad36dd17" },
    { id: "54c1720e-9fbd-4f21-8f97-9944fd1fae57", name: "Packed", sort: 0, parent: "29e1e49d-3343-499d-8c59-7b33ad36dd17" },
    { id: "1a656f35-d217-468a-98ca-9907cd60d381", name: "Bottled", sort: 2, parent: "29e1e49d-3343-499d-8c59-7b33ad36dd17" },
    { id: "64ee8649-c7eb-47dd-a2b2-1e3dc5969fcc", name: "Consoles", sort: 2, parent: "3964586c-55a6-4c06-8ff4-3dc00fe75a86" },
    { id: "2038dd15-576f-4456-9352-147abf765d4d", name: "Chicken", sort: 3, parent: "b9a298cd-3c42-42e9-a63b-c01bfdd7684d" },
].map(async ({ id, name, sort, parent }) => {
    await prisma.category.upsert({
        where: { id },
        create: { id, name, sort, parent },
        update: { name, sort, parent }
    })
}));

// const category = await prisma.category.createMany({
//     data: [
//         ...categories.map(category => ({
//             ...category
//         }))
//     ]
// });

// const product =
//     await prisma.product.create({
//         data: {
//             categoryId: "dfabfe30-ff69-4c84-ad0b-1f0ce09fc897",
//             storeId: store.id,
//             name: "iPhone 15 Pro",
//             salePrice: 167900,
//             retailPrice: 167900,
//             variants: {
//                 create: [
//                     {
//                         name: "Memory",
//                         options: {
//                             create: [
//                                 { name: "8GB" },
//                                 { name: "12GB" }
//                             ]
//                         }
//                     }, {
//                         name: "Color",
//                         options: {
//                             create: [
//                                 { name: "Titanium Black" },
//                                 { name: "Titanium Natural" }
//                             ]
//                         }
//                     }, {
//                         name: "Capacity",
//                         options: {
//                             create: [
//                                 { name: "256GB" },
//                                 { name: "512GB" },
//                                 { name: "1TB" }
//                             ]
//                         }
//                     }
//                 ]
//             }
//         }
//     });

const store = await prisma.store.upsert({
    where: { id: "25906f11-e25c-459c-be54-4b4bd17606f7" },
    create: {
        id: "25906f11-e25c-459c-be54-4b4bd17606f7",
        fullname: "GearNext",
        mobile: "2262828",
    },
    update: {
        fullname: "GearNext",
        mobile: "2262828",
    }
});

await Promise.all([
    {
        id: "45d195f5-c068-4824-9962-a3bdba942024",
        categoryId: "dfabfe30-ff69-4c84-ad0b-1f0ce09fc897",
        storeId: "25906f11-e25c-459c-be54-4b4bd17606f7",
        name: "iPhone 15",
        salePrice: 87900,
        retailPrice: 97900,
        variants: [
            {
                id: "9222cd65-d7c7-4d48-8efb-f76590bfa4bb",
                name: "Color",
                options: [
                    {
                        id: "648c0012-7f4d-409d-ae59-194fae900718",
                        name: "Black"
                    }, {
                        id: "3edae631-e6ce-4004-affa-e83e75fbbb22",
                        name: "Natural"
                    }
                ]
            }, {
                id: "2b65e5cd-4669-4fb5-b07f-dc3ae98d22d8",
                name: "Capacity",
                options: [
                    {
                        id: "2290bcd5-528f-42f2-bf17-1be7cd9af477",
                        name: "256GB"
                    }, {
                        id: "53caccfd-685c-460d-8d4a-b8a5080f986b",
                        name: "512GB"
                    }
                ]
            }   
        ]
    }, {
        id: "f41f717a-810d-4577-841b-b250e29e2ccb",
        categoryId: "dfabfe30-ff69-4c84-ad0b-1f0ce09fc897",
        storeId: "25906f11-e25c-459c-be54-4b4bd17606f7",
        name: "iPhone 15 Pro",
        salePrice: 187900,
        retailPrice: 197900,
        variants: [
            {
                id: "8e4b50cf-74de-44ee-83a8-67d3b778a1e3",
                name: "Color",
                options: [
                    {
                        id: "7787d709-174b-42c1-b114-626c1542c7ab",
                        name: "Black Titanium"
                    }, {
                        id: "b8743a85-1ae5-4677-9520-12f6afb5030b",
                        name: "Natural Titanium"
                    }
                ]
            }, {
                id: "83e207a7-9877-4e59-9ead-b4db34997795",
                name: "Capacity",
                options: [
                    {
                        id: "0b413adf-faec-4fc9-a2c9-ff1aa9a80f79",
                        name: "256GB"
                    }, {
                        id: "af8a6fb7-8c4c-4695-8d8b-e33d4ed3a6e5",
                        name: "512GB"
                    }
                ]
            }   
        ]
    }
].map(async ({ id: productId, variants, ...rest }) => {
    await prisma.product.upsert({
        where: { id: productId },
        create: { id: productId, ...rest },
        update: { ...rest }
    });

    await Promise.all(
        variants.map(async ({ id: variantId, options, ...rest }) => {
            await prisma.variant.upsert({
                where: { id: variantId },
                create: { id: variantId, ...rest, productId },
                update: { ...rest }
            });

            await Promise.all(
                options.map(async ({ id: optionId, ...rest }) => {
                    await prisma.option.upsert({
                        where: { id: optionId },
                        create: { id: optionId, ...rest, variantId },
                        update: { ...rest }
                    });
                })
            );
        })
    )
}))

// await prisma.product.upsert({
//     where: { id },
//     create: {
//         categoryId: "dfabfe30-ff69-4c84-ad0b-1f0ce09fc897",
//         storeId: "25906f11-e25c-459c-be54-4b4bd17606f7",
//         name: "iPhone 15",
//         salePrice: 87900,
//         retailPrice: 97900,
//         variants: {
//             create: [
//                 {
//                     name: "Color",
//                     options: {
//                         create: [
//                             { name: "Black" },
//                             { name: "Natural" }
//                         ]
//                     }
//                 }, {
//                     name: "Capacity",
//                     options: {
//                         create: [
//                             { name: "256GB" },
//                             { name: "512GB" },
//                         ]
//                     }
//                 }
//             ]
//         }
//     },
//     update: {}
// })

// console.log(product);
// await prisma.product.create({
//     data: {
//         name: "iPhone 15 Pro",
//         salePrice: 167900,
//         retailPrice: 167900,
        
//     }
// })