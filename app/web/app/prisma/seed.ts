import { prisma } from "~/services/db.server";

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
    { id: "5708a70b-48a0-4b7f-98c7-902b05eb6c11", name: "Brunei Muara District" },
    { id: "80e08454-8ecd-4cea-a126-3aaa39898cc2", name: "Tutong District" },
    { id: "54a3011f-413f-43a0-a00a-72954e6c7efc", name: "Belait District" },
    { id: "502b29c1-a1f3-4d62-b094-fa3f0ce4a886", name: "Temburong District" }
].map(async ({ id, name }) => {
    const district = await prisma.district.upsert({
        where: { id },
        create: { id, name },
        update: { name }
    })
}));

const storeAddress = await prisma.storeAddress.upsert({
    where: { id: "c279120d-868c-4499-855a-1a54b6a191a2" },
    create: {
        id: "c279120d-868c-4499-855a-1a54b6a191a2",
        fullname: "GearNext Subok",
        mobile: "2262828",
        simpang: "527-20-9",
        municiple: "Kampung Belimbing, Jalan Subok",
        districtId: "5708a70b-48a0-4b7f-98c7-902b05eb6c11",
        storeId: "25906f11-e25c-459c-be54-4b4bd17606f7"
    },
    update: {
        fullname: "GearNext Subok",
        mobile: "2262828",
        simpang: "527-20-9",
        municiple: "Kampung Belimbing, Jalan Subok",
        districtId: "5708a70b-48a0-4b7f-98c7-902b05eb6c11",
        storeId: "25906f11-e25c-459c-be54-4b4bd17606f7"
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
                        name: "Black",
                        sort: 0
                    }, {
                        id: "3edae631-e6ce-4004-affa-e83e75fbbb22",
                        name: "Natural",
                        sort: 1
                    }
                ]
            }, {
                id: "2b65e5cd-4669-4fb5-b07f-dc3ae98d22d8",
                name: "Capacity",
                options: [
                    {
                        id: "2290bcd5-528f-42f2-bf17-1be7cd9af477",
                        name: "256GB",
                        sort: 0
                    }, {
                        id: "53caccfd-685c-460d-8d4a-b8a5080f986b",
                        name: "512GB",
                        sort: 1
                    }
                ]
            }   
        ],
        inventories: [
            {
                id: "0ced8b85-8c1b-45c4-8290-c20d1c16fabd",
                sku: "",
                salePrice: 9000,
                retailPrice: 10000,
                skus: [
                    {
                        variantId: "83e207a7-9877-4e59-9ead-b4db34997795",
                        optionId: "2290bcd5-528f-42f2-bf17-1be7cd9af477",
                        inventoryId: "0ced8b85-8c1b-45c4-8290-c20d1c16fabd",
                        sort: 0
                    }, {
                        variantId: "8e4b50cf-74de-44ee-83a8-67d3b778a1e3",
                        optionId: "648c0012-7f4d-409d-ae59-194fae900718",
                        inventoryId: "0ced8b85-8c1b-45c4-8290-c20d1c16fabd",
                        sort: 1
                    }
                ],
                stocks: [
                    {
                        id: "901c452e-08ff-4d35-9a07-7d88735432ff",
                        quantity: 10,
                        inventoryId: "0ced8b85-8c1b-45c4-8290-c20d1c16fabd",
                        storeId: "25906f11-e25c-459c-be54-4b4bd17606f7",
                        branchId: "c279120d-868c-4499-855a-1a54b6a191a2",
                        location: "A1"
                    }
                ]
            }, {
                id: "17f39654-47fd-4395-8eef-575354675b34",
                sku: "",
                salePrice: 9000,
                retailPrice: 10000,
                skus: [
                    {
                        variantId: "83e207a7-9877-4e59-9ead-b4db34997795",
                        optionId: "53caccfd-685c-460d-8d4a-b8a5080f986b",
                        inventoryId: "17f39654-47fd-4395-8eef-575354675b34",
                        sort: 0
                    }, {
                        variantId: "8e4b50cf-74de-44ee-83a8-67d3b778a1e3",
                        optionId: "648c0012-7f4d-409d-ae59-194fae900718",
                        inventoryId: "17f39654-47fd-4395-8eef-575354675b34",
                        sort: 1
                    }
                ],
                stocks: [
                    {
                        id: "901c452e-08ff-4d35-9a07-7d88735432ff",
                        quantity: 10,
                        inventoryId: "17f39654-47fd-4395-8eef-575354675b34",
                        storeId: "25906f11-e25c-459c-be54-4b4bd17606f7",
                        branchId: "c279120d-868c-4499-855a-1a54b6a191a2",
                        location: "A1"
                    }
                ]
            }
        ],
    }, {
        id: "f41f717a-810d-4577-841b-b250e29e2ccb",
        categoryId: "dfabfe30-ff69-4c84-ad0b-1f0ce09fc897",
        storeId: "25906f11-e25c-459c-be54-4b4bd17606f7",
        name: "iPhone 15 Pro",
        salePrice: 187900,
        retailPrice: 197900,
        inventories: [
            {
                id: "71a0a101-d712-4df9-977d-68d52e3d9921",
                sku: "",
                salePrice: 9000,
                retailPrice: 10000,
                skus: [
                    {
                        variantId: "83e207a7-9877-4e59-9ead-b4db34997795",
                        optionId: "0b413adf-faec-4fc9-a2c9-ff1aa9a80f79",
                        inventoryId: "71a0a101-d712-4df9-977d-68d52e3d9921",
                        sort: 0
                    }, {
                        variantId: "8e4b50cf-74de-44ee-83a8-67d3b778a1e3",
                        optionId: "7787d709-174b-42c1-b114-626c1542c7ab",
                        inventoryId: "71a0a101-d712-4df9-977d-68d52e3d9921",
                        sort: 1
                    }
                ],
                stocks: [
                    {
                        id: "901c452e-08ff-4d35-9a07-7d88735432ff",
                        quantity: 10,
                        inventoryId: "71a0a101-d712-4df9-977d-68d52e3d9921",
                        storeId: "25906f11-e25c-459c-be54-4b4bd17606f7",
                        branchId: "c279120d-868c-4499-855a-1a54b6a191a2",
                        location: "A1"
                    }
                ]
            }, {
                id: "25b0f5f6-02bc-46b2-a82a-c55d651bb6b4",
                sku: "",
                salePrice: 9000,
                retailPrice: 10000,
                skus: [
                    {
                        variantId: "83e207a7-9877-4e59-9ead-b4db34997795",
                        optionId: "af8a6fb7-8c4c-4695-8d8b-e33d4ed3a6e5",
                        inventoryId: "25b0f5f6-02bc-46b2-a82a-c55d651bb6b4",
                        sort: 0
                    }, {
                        variantId: "8e4b50cf-74de-44ee-83a8-67d3b778a1e3",
                        optionId: "7787d709-174b-42c1-b114-626c1542c7ab",
                        inventoryId: "25b0f5f6-02bc-46b2-a82a-c55d651bb6b4",
                        sort: 1
                    }
                ],
                stocks: [
                    {
                        id: "901c452e-08ff-4d35-9a07-7d88735432ff",
                        quantity: 10,
                        inventoryId: "25b0f5f6-02bc-46b2-a82a-c55d651bb6b4",
                        storeId: "25906f11-e25c-459c-be54-4b4bd17606f7",
                        branchId: "c279120d-868c-4499-855a-1a54b6a191a2",
                        location: "A1"
                    }
                ]
            }, {
                id: "e0fe564f-f477-4993-b711-aa7ab359b7f6",
                sku: "",
                salePrice: 9000,
                retailPrice: 10000,
                skus: [
                    {
                        variantId: "83e207a7-9877-4e59-9ead-b4db34997795",
                        optionId: "0b413adf-faec-4fc9-a2c9-ff1aa9a80f79",
                        inventoryId: "e0fe564f-f477-4993-b711-aa7ab359b7f6",
                        sort: 0
                    }, {
                        variantId: "8e4b50cf-74de-44ee-83a8-67d3b778a1e3",
                        optionId: "b8743a85-1ae5-4677-9520-12f6afb5030b",
                        inventoryId: "e0fe564f-f477-4993-b711-aa7ab359b7f6",
                        sort: 1
                    }
                ],
                stocks: [
                    {
                        id: "901c452e-08ff-4d35-9a07-7d88735432ff",
                        quantity: 10,
                        inventoryId: "e0fe564f-f477-4993-b711-aa7ab359b7f6",
                        storeId: "25906f11-e25c-459c-be54-4b4bd17606f7",
                        branchId: "c279120d-868c-4499-855a-1a54b6a191a2",
                        location: "A1"
                    }
                ]
            }, {
                id: "8ef4f9ed-655a-4a72-a493-85fe5f4ebb21",
                sku: "",
                salePrice: 9000,
                retailPrice: 10000,
                skus: [
                    {
                        variantId: "83e207a7-9877-4e59-9ead-b4db34997795",
                        optionId: "af8a6fb7-8c4c-4695-8d8b-e33d4ed3a6e5",
                        inventoryId: "8ef4f9ed-655a-4a72-a493-85fe5f4ebb21",
                        sort: 0
                    }, {
                        variantId: "8e4b50cf-74de-44ee-83a8-67d3b778a1e3",
                        optionId: "b8743a85-1ae5-4677-9520-12f6afb5030b",
                        inventoryId: "8ef4f9ed-655a-4a72-a493-85fe5f4ebb21",
                        sort: 1
                    }
                ],
                stocks: [
                    {
                        id: "901c452e-08ff-4d35-9a07-7d88735432ff",
                        quantity: 10,
                        inventoryId: "8ef4f9ed-655a-4a72-a493-85fe5f4ebb21",
                        storeId: "25906f11-e25c-459c-be54-4b4bd17606f7",
                        branchId: "c279120d-868c-4499-855a-1a54b6a191a2",
                        location: "A1"
                    }
                ]
            }
        ],
        variants: [
            {
                id: "8e4b50cf-74de-44ee-83a8-67d3b778a1e3",
                name: "Color",
                options: [
                    {
                        id: "7787d709-174b-42c1-b114-626c1542c7ab",
                        name: "Black Titanium",
                        sort: 0
                    }, {
                        id: "b8743a85-1ae5-4677-9520-12f6afb5030b",
                        name: "Natural Titanium",
                        sort: 1
                    }
                ]
            }, {
                id: "83e207a7-9877-4e59-9ead-b4db34997795",
                name: "Capacity",
                options: [
                    {
                        id: "0b413adf-faec-4fc9-a2c9-ff1aa9a80f79",
                        name: "256GB",
                        sort: 0
                    }, {
                        id: "af8a6fb7-8c4c-4695-8d8b-e33d4ed3a6e5",
                        name: "512GB",
                        sort: 1
                    }
                ]
            }   
        ]
    }
].map(async ({ id: productId, variants, inventories, ...rest }) => {
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
    );

    await Promise.all(
        inventories.map(async ({ id, sku, salePrice, retailPrice, skus, stocks }) => {
            await prisma.inventory.upsert({
                where: { id },
                create: { id, sku, salePrice, retailPrice, productId },
                update: { sku, salePrice, retailPrice, productId }
            });

            await Promise.all(
                skus.map(async ({ variantId, optionId, inventoryId, sort }) => {
                    await prisma.sku.upsert({
                        where: { id: { variantId, optionId, inventoryId, productId } },
                        create: { variantId, optionId, inventoryId, productId, sort },
                        update: { variantId, optionId, inventoryId, sort },
                    })
                })
            );

            await Promise.all(
                stocks.map(async ({ id, quantity, location, storeId, inventoryId, branchId }) => {
                    await prisma.stock.upsert({
                        where: { id },
                        create: { id, quantity, location, storeId, inventoryId, branchId },
                        update: { quantity, location, storeId, inventoryId, branchId },
                    })
                })
            )
        })
    )
}));

console.log("done");