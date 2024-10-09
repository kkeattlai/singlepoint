import bcrypt from "bcryptjs";
import { prisma } from "~/services/db.server";

await Promise.all([
    {
        id: "03adc874-b3dc-496c-91dd-3a76d5528faf",
        name: "Desktop",
        sort: 1,
        parent: "3964586c-55a6-4c06-8ff4-3dc00fe75a86",
        imageUrl: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSFT-All-in-One_1040x585?scl=1",
        description: ""
    }, {
        id: "6addc481-e9a3-41a5-b888-eaa6d69fc54d",
        name: "Clothing",
        sort: 1,
        parent: null,
        imageUrl: "https://cdn.aliengearholsters.com/media/wysiwyg/mens-suit-for-ccw.jpg",
        description: "Your ultimate destination for fashionable clothing that caters to all your style needs. At SinglePoint, we pride ourselves on offering a diverse collection of high-quality apparel for men, women, and children. From trendy casual wear to elegant evening outfits, our range is designed to suit every occasion and personal style."
    }, {
        id: "3964586c-55a6-4c06-8ff4-3dc00fe75a86",
        name: "Electronic & Technology",
        sort: 0,
        parent: null,
        imageUrl: "https://static.ebayinc.com/static/assets/Uploads/Stories/Articles/_resampled/ScaleWidthWyI4MDAiXQ/eBay-Adds-Select-Samsung-Galaxy-Products-to-Refurbished-Program.jpeg?v=",
        description: "Where technology meets innovation. Dive into a world of cutting-edge electronics and state-of-the-art gadgets designed to elevate your digital lifestyle. At SinglePoint, we are passionate about bringing you the latest tech advancements and top-tier devices that cater to your every need."
    }, {
        id: "78afc870-9ed1-49ad-8037-a3a7b231c79f",
        name: "Skincare & Makeup",
        sort: 2,
        parent: null,
        imageUrl: "https://cdn-contents.anymindgroup.com/corporate/wp-uploads/2022/06/28103014/Laneige-product.png",
        description: "Discover the ultimate skincare shopping experience at Singlepoint, where beauty meets science. As a leading online skincare platform, Singlepoint offers an extensive range of high-quality products designed to cater to all skin types and concerns. From luxury brands to everyday essentials, we have everything you need to achieve healthy, radiant skin."
    }, {
        id: "a8e49365-6e50-43f8-a193-40116e4f4264",
        name: "Food & Groceries",
        sort: 2,
        parent: null,
        imageUrl: "https://hips.hearstapps.com/hmg-prod/images/hungryroot-1658507018.png",
        description: "As a leading online grocery platform, SinglePoint offers a wide range of fresh produce, pantry staples, household essentials, and gourmet items, all at competitive prices. Experience seamless shopping and fast delivery right to your doorstep."
    },
    {
        id: "dfabfe30-ff69-4c84-ad0b-1f0ce09fc897",
        name: "Mobile phones",
        sort: 2,
        parent: "3964586c-55a6-4c06-8ff4-3dc00fe75a86",
        imageUrl: "https://www.slashgear.com/img/gallery/heres-how-long-samsung-phones-last/l-intro-1676431948.jpg",
        description: ""
    },
    {
        id: "fa97ccdf-6ec1-436c-9a9d-9c3ab88f1cf2",
        name: "Televisions & Entertainment",
        sort: 3,
        parent: "3964586c-55a6-4c06-8ff4-3dc00fe75a86",
        imageUrl: "https://api.hisense-india.com/media/products/A6K-description_image-1715250312-7993.webp",
        description: ""
    }, {
        id: "62e08166-1ef6-42da-b10b-c10afe95d7ac",
        name: "Monitors",
        sort: 1,
        parent: "03adc874-b3dc-496c-91dd-3a76d5528faf",
        imageUrl: "https://www.oneplus.in/content/dam/oasis/page/2022/in/product/monitor-x27/pc/banner.jpg",
        description: ""
    }, {
        id: "5497992c-8eab-430a-9fa2-d99a4c411fe4",
        name: "Gaming",
        sort: 0,
        parent: "03adc874-b3dc-496c-91dd-3a76d5528faf",
        imageUrl: "https://assets2.razerzone.com/images/og-image/Razer-Products-OGimage-1200x630.jpg",
        description: ""
    },
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
    {
        id: "64ee8649-c7eb-47dd-a2b2-1e3dc5969fcc",
        name: "Consoles",
        sort: 2,
        parent: "3964586c-55a6-4c06-8ff4-3dc00fe75a86",
        imageUrl: "https://hips.hearstapps.com/hmg-prod/images/gh-index-gamingconsoles-052-print-preview-1659705142.jpg?crop=0.669xw:1.00xh;0.164xw,0&resize=640:*",
        description: ""
    },
    { id: "2038dd15-576f-4456-9352-147abf765d4d", name: "Chicken", sort: 3, parent: "b9a298cd-3c42-42e9-a63b-c01bfdd7684d" },
].map(async ({ id, name, sort, parent, imageUrl, description }) => {
    await prisma.category.upsert({
        where: { id },
        create: { id, name, sort, parent, imageUrl, description },
        update: { name, sort, parent, imageUrl, description }
    })
}));

await Promise.all([
    { id: "2fe76f2c-ee9f-42d9-a362-e4d4e1752d4c", email: "elriclai88@gmail.com" }, 
].map(async ({ id, email }) => {
    await prisma.user.upsert({
        where: { id },
        create: { id, email, password: await bcrypt.hash("a123b456C7*", 10), fullname: "Elric Lai", mobile: "8802828" },
        update: { email, password: await bcrypt.hash("a123b456C7*", 10) }
    })
}));

await Promise.all([
    { id: "5c47e062-692c-4a47-9031-2638ea7fa455", name: "Apple", sort: 0 },
    { id: "21d213ec-06b4-47ce-8279-4d92c51c9185", name: "Niko neko", sort: 1 },
].map(async ({ id, name, sort }) => {
    await prisma.brand.upsert({
        where: { id },
        create: { id, name, sort },
        update: { name, sort }
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

const store2 = await prisma.store.upsert({
    where: { id: "a22fa02b-deb1-4664-a716-349beec3ef30" },
    create: {
        id: "a22fa02b-deb1-4664-a716-349beec3ef30",
        fullname: "Niko neko",
        mobile: "2262828",
    },
    update: {
        fullname: "Niko neko",
        mobile: "2262828",
    }
});

await Promise.all([
    { id: "5708a70b-48a0-4b7f-98c7-902b05eb6c11", name: "Brunei Muara District", sort: 0 },
    { id: "80e08454-8ecd-4cea-a126-3aaa39898cc2", name: "Tutong District", sort: 1 },
    { id: "54a3011f-413f-43a0-a00a-72954e6c7efc", name: "Belait District", sort: 2 },
    { id: "502b29c1-a1f3-4d62-b094-fa3f0ce4a886", name: "Temburong District", sort: 3 }
].map(async ({ id, name, sort }) => {
    const district = await prisma.district.upsert({
        where: { id },
        create: { id, name, sort },
        update: { name, sort }
    })
}));

await Promise.all([
    { id: "86a2b1b5-0abf-4625-8c43-7b4409fae3c7", name: "Click & Collect", sort: 0 },
    { id: "d6ccd632-8ead-452c-9abd-82a4909bc0d8", name: "Standard Delivery", sort: 1 },
    { id: "b741eef9-788e-4915-b4ae-abe5f70d1509", name: "Express Delivery", sort: 2 },
    { id: "835ebbf0-aba5-4963-86f2-170f6373a475", name: "Next day Delivery", sort: 3 }
].map(async ({ id, name, sort }) => {
    const deliveryType = await prisma.deliveryType.upsert({
        where: { id },
        create: { id, name, sort },
        update: { name, sort }
    })
}));

await Promise.all([
    { id: "378d02d9-e83d-41ec-bdc7-430aea88c8f5", charges: 0, minTime: 0, maxTime: 1, deliveryTypeId: "86a2b1b5-0abf-4625-8c43-7b4409fae3c7", districtId: "5708a70b-48a0-4b7f-98c7-902b05eb6c11", storeId: "25906f11-e25c-459c-be54-4b4bd17606f7", sort: 0 },
    { id: "321363c8-e477-4da6-a418-9559046d400e", charges: 5, minTime: 1, maxTime: 10, deliveryTypeId: "d6ccd632-8ead-452c-9abd-82a4909bc0d8", districtId: "5708a70b-48a0-4b7f-98c7-902b05eb6c11", storeId: "25906f11-e25c-459c-be54-4b4bd17606f7", sort: 1 },
    { id: "4b1c6bdd-a298-44bb-964a-ba9d976d91f6", charges: 7.5, minTime: 1, maxTime: 5, deliveryTypeId: "b741eef9-788e-4915-b4ae-abe5f70d1509", districtId: "5708a70b-48a0-4b7f-98c7-902b05eb6c11", storeId: "25906f11-e25c-459c-be54-4b4bd17606f7", sort: 2 },
    { id: "1ea0255e-90f6-4696-8aac-db85ea5c4f25", charges: 15, minTime: 1, maxTime: 2, deliveryTypeId: "835ebbf0-aba5-4963-86f2-170f6373a475", districtId: "5708a70b-48a0-4b7f-98c7-902b05eb6c11", storeId: "25906f11-e25c-459c-be54-4b4bd17606f7", sort: 3 },
    { id: "499324de-d9cf-4f3e-9129-76a63ff64567", charges: 7.5, minTime: 1, maxTime: 10, deliveryTypeId: "d6ccd632-8ead-452c-9abd-82a4909bc0d8", districtId: "80e08454-8ecd-4cea-a126-3aaa39898cc2", storeId: "25906f11-e25c-459c-be54-4b4bd17606f7", sort: 0 },
    { id: "88db71c3-4293-4baa-9c6f-fd2b3426bc86", charges: 15, minTime: 1, maxTime: 5, deliveryTypeId: "b741eef9-788e-4915-b4ae-abe5f70d1509", districtId: "80e08454-8ecd-4cea-a126-3aaa39898cc2", storeId: "25906f11-e25c-459c-be54-4b4bd17606f7", sort: 1 },
    { id: "99ea06c1-2f3c-4420-949d-ade76e118248", charges: 20, minTime: 1, maxTime: 2, deliveryTypeId: "835ebbf0-aba5-4963-86f2-170f6373a475", districtId: "80e08454-8ecd-4cea-a126-3aaa39898cc2", storeId: "25906f11-e25c-459c-be54-4b4bd17606f7", sort: 2 },
].map(async ({ id, charges, minTime, maxTime, deliveryTypeId, districtId, storeId, sort }) => {
    const storeDeliveryOption = await prisma.storeDeliveryOption.upsert({
        where: { id },
        create: { id, charges, minTime, maxTime, deliveryTypeId, districtId, storeId, sort },
        update: { charges, minTime, maxTime, deliveryTypeId, districtId, storeId, sort }
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

const storeAddress2 = await prisma.storeAddress.upsert({
    where: { id: "4a9569a4-3938-4e71-b527-9325c6849fe2" },
    create: {
        id: "4a9569a4-3938-4e71-b527-9325c6849fe2",
        fullname: "Niko neko Gadong",
        mobile: "2262828",
        simpang: "527-20-9",
        municiple: "Kampung Belimbing, Jalan Subok",
        districtId: "5708a70b-48a0-4b7f-98c7-902b05eb6c11",
        storeId: "a22fa02b-deb1-4664-a716-349beec3ef30"
    },
    update: {
        fullname: "GearNext Subok",
        mobile: "2262828",
        simpang: "527-20-9",
        municiple: "Kampung Belimbing, Jalan Subok",
        districtId: "5708a70b-48a0-4b7f-98c7-902b05eb6c11",
        storeId: "a22fa02b-deb1-4664-a716-349beec3ef30"
    }
});

await Promise.all([
    {
        id: "45d195f5-c068-4824-9962-a3bdba942024",
        images: [
            {
                id: "3a78889a-9e89-4dbd-a38d-28ee6ce47486",
                url: "https://99mobilebn.com/wp-content/uploads/2023/10/iPhone-15-18.png",
                sort: 0
            }, {
                id: "e7389f6b-c8ce-4886-8e40-4fa264833351",
                url: "https://99mobilebn.com/wp-content/uploads/2023/10/iPhone-15-01.png",
                sort: 1
            }, {
                id: "77234144-c37b-45f3-8bbb-6f155ced59b6",
                url: "https://99mobilebn.com/wp-content/uploads/2023/10/iPhone-15-04.png",
                sort: 2
            }
        ],
        categoryId: "dfabfe30-ff69-4c84-ad0b-1f0ce09fc897",
        brandId: "5c47e062-692c-4a47-9031-2638ea7fa455",
        storeId: "25906f11-e25c-459c-be54-4b4bd17606f7",
        name: "iPhone 15",
        salePrice: 87900,
        retailPrice: 97900,
        variants: [
            {
                id: "9222cd65-d7c7-4d48-8efb-f76590bfa4bb",
                name: "Color",
                sort: 0,
                options: [
                    {
                        id: "648c0012-7f4d-409d-ae59-194fae900718",
                        name: "Black",
                        sort: 0
                    }, {
                        id: "3edae631-e6ce-4004-affa-e83e75fbbb22",
                        name: "White",
                        sort: 1
                    }
                ]
            }, {
                id: "2b65e5cd-4669-4fb5-b07f-dc3ae98d22d8",
                name: "Capacity",
                sort: 1,
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
                sku: "256GB / Black",
                salePrice: 9000,
                retailPrice: 10000,
                imagePointerId: "e7389f6b-c8ce-4886-8e40-4fa264833351",
                skus: [
                    {
                        variantId: "2b65e5cd-4669-4fb5-b07f-dc3ae98d22d8",
                        optionId: "2290bcd5-528f-42f2-bf17-1be7cd9af477",
                        inventoryId: "0ced8b85-8c1b-45c4-8290-c20d1c16fabd",
                        sort: 0
                    }, {
                        variantId: "9222cd65-d7c7-4d48-8efb-f76590bfa4bb",
                        optionId: "648c0012-7f4d-409d-ae59-194fae900718",
                        inventoryId: "0ced8b85-8c1b-45c4-8290-c20d1c16fabd",
                        sort: 1
                    }
                ],
                stocks: [
                    {
                        id: "d4a37d4c-c523-452e-be01-4582ab39ce50",
                        quantity: 20,
                        inventoryId: "0ced8b85-8c1b-45c4-8290-c20d1c16fabd",
                        storeId: "25906f11-e25c-459c-be54-4b4bd17606f7",
                        branchId: "c279120d-868c-4499-855a-1a54b6a191a2",
                        location: "A1"
                    }
                ]
            }, {
                id: "17f39654-47fd-4395-8eef-575354675b34",
                sku: "512GB / Black",
                salePrice: 18000,
                retailPrice: 20000,
                imagePointerId: "e7389f6b-c8ce-4886-8e40-4fa264833351",
                skus: [
                    {
                        variantId: "2b65e5cd-4669-4fb5-b07f-dc3ae98d22d8",
                        optionId: "53caccfd-685c-460d-8d4a-b8a5080f986b",
                        inventoryId: "17f39654-47fd-4395-8eef-575354675b34",
                        sort: 0
                    }, {
                        variantId: "9222cd65-d7c7-4d48-8efb-f76590bfa4bb",
                        optionId: "648c0012-7f4d-409d-ae59-194fae900718",
                        inventoryId: "17f39654-47fd-4395-8eef-575354675b34",
                        sort: 1
                    }
                ],
                stocks: [
                    {
                        id: "11930d44-fbb7-4b1b-9d1a-cba14cd66a23",
                        quantity: 5,
                        inventoryId: "17f39654-47fd-4395-8eef-575354675b34",
                        storeId: "25906f11-e25c-459c-be54-4b4bd17606f7",
                        branchId: "c279120d-868c-4499-855a-1a54b6a191a2",
                        location: "A1"
                    }
                ]
            }, {
                id: "8a77d982-fedc-45eb-a9c3-b9cc8a0461cf",
                sku: "256GB / White",
                salePrice: 9000,
                retailPrice: 10000,
                imagePointerId: "77234144-c37b-45f3-8bbb-6f155ced59b6",
                skus: [
                    {
                        variantId: "2b65e5cd-4669-4fb5-b07f-dc3ae98d22d8",
                        optionId: "2290bcd5-528f-42f2-bf17-1be7cd9af477",
                        inventoryId: "8a77d982-fedc-45eb-a9c3-b9cc8a0461cf",
                        sort: 0
                    }, {
                        variantId: "9222cd65-d7c7-4d48-8efb-f76590bfa4bb",
                        optionId: "3edae631-e6ce-4004-affa-e83e75fbbb22",
                        inventoryId: "8a77d982-fedc-45eb-a9c3-b9cc8a0461cf",
                        sort: 1
                    }
                ],
                stocks: [
                    {
                        id: "eb836f87-6b84-442d-af03-1989d72d1399f",
                        quantity: 20,
                        inventoryId: "8a77d982-fedc-45eb-a9c3-b9cc8a0461cf",
                        storeId: "25906f11-e25c-459c-be54-4b4bd17606f7",
                        branchId: "c279120d-868c-4499-855a-1a54b6a191a2",
                        location: "A1"
                    }
                ]
            }, {
                id: "faaecf76-49af-4d8f-832a-a4b88aba08fc",
                sku: "512GB / White",
                salePrice: 18000,
                retailPrice: 20000,
                imagePointerId: "77234144-c37b-45f3-8bbb-6f155ced59b6",
                skus: [
                    {
                        variantId: "2b65e5cd-4669-4fb5-b07f-dc3ae98d22d8",
                        optionId: "53caccfd-685c-460d-8d4a-b8a5080f986b",
                        inventoryId: "faaecf76-49af-4d8f-832a-a4b88aba08fc",
                        sort: 0
                    }, {
                        variantId: "9222cd65-d7c7-4d48-8efb-f76590bfa4bb",
                        optionId: "3edae631-e6ce-4004-affa-e83e75fbbb22",
                        inventoryId: "faaecf76-49af-4d8f-832a-a4b88aba08fc",
                        sort: 1
                    }
                ],
                stocks: [
                    {
                        id: "eb836f87-6b84-442d-af03-1989d72d1399",
                        quantity: 5,
                        inventoryId: "faaecf76-49af-4d8f-832a-a4b88aba08fc",
                        storeId: "25906f11-e25c-459c-be54-4b4bd17606f7",
                        branchId: "c279120d-868c-4499-855a-1a54b6a191a2",
                        location: "A1"
                    }
                ]
            }
        ],
    }, {
        id: "f41f717a-810d-4577-841b-b250e29e2ccb",
        images: [
            {
                id: "f2faf169-ed13-48e4-b77d-d4614bede712",
                url: "https://99mobilebn.com/wp-content/uploads/2023/11/iPhone-15-Pro-Max-06.png",
                sort: 0
            }, {
                id: "d656e0e9-cbcb-4e3e-a7e1-3099964e72c1",
                url: "https://99mobilebn.com/wp-content/uploads/2023/11/iPhone-15-Pro-Max-19.png",
                sort: 1
            }, {
                id: "85b14dc7-95ce-4822-8147-f26c89bc0323",
                url: "https://99mobilebn.com/wp-content/uploads/2023/11/iPhone-15-Pro-Max-01.png",
                sort: 2
            }
        ],
        categoryId: "dfabfe30-ff69-4c84-ad0b-1f0ce09fc897",
        brandId: "5c47e062-692c-4a47-9031-2638ea7fa455",
        storeId: "25906f11-e25c-459c-be54-4b4bd17606f7",
        name: "iPhone 15 Pro",
        salePrice: 187900,
        retailPrice: 197900,
        inventories: [
            {
                id: "71a0a101-d712-4df9-977d-68d52e3d9921",
                sku: "256GB / Black Titanium",
                salePrice: 9000,
                retailPrice: 10000,
                imagePointerId: "85b14dc7-95ce-4822-8147-f26c89bc0323",
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
                        id: "836daa62-49c5-4f3b-abbb-95d543701095",
                        quantity: 10,
                        inventoryId: "71a0a101-d712-4df9-977d-68d52e3d9921",
                        storeId: "25906f11-e25c-459c-be54-4b4bd17606f7",
                        branchId: "c279120d-868c-4499-855a-1a54b6a191a2",
                        location: "A1"
                    }
                ]
            }, {
                id: "25b0f5f6-02bc-46b2-a82a-c55d651bb6b4",
                sku: "512GB / Black Titanium",
                salePrice: 9000,
                retailPrice: 10000,
                imagePointerId: "85b14dc7-95ce-4822-8147-f26c89bc0323",
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
                        id: "f13ba5fc-b5de-4607-abcb-2d7d374edbe4",
                        quantity: 10,
                        inventoryId: "25b0f5f6-02bc-46b2-a82a-c55d651bb6b4",
                        storeId: "25906f11-e25c-459c-be54-4b4bd17606f7",
                        branchId: "c279120d-868c-4499-855a-1a54b6a191a2",
                        location: "A1"
                    }
                ]
            }, {
                id: "e0fe564f-f477-4993-b711-aa7ab359b7f6",
                sku: "256GB / Natural Titanium",
                salePrice: 9000,
                retailPrice: 10000,
                imagePointerId: "d656e0e9-cbcb-4e3e-a7e1-3099964e72c1",
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
                        id: "a941f851-2adf-4bea-90b4-4b69d1f2cce1",
                        quantity: 10,
                        inventoryId: "e0fe564f-f477-4993-b711-aa7ab359b7f6",
                        storeId: "25906f11-e25c-459c-be54-4b4bd17606f7",
                        branchId: "c279120d-868c-4499-855a-1a54b6a191a2",
                        location: "A1"
                    }
                ]
            }, {
                id: "8ef4f9ed-655a-4a72-a493-85fe5f4ebb21",
                sku: "512GB / Natural Titanium",
                salePrice: 9000,
                retailPrice: 10000,
                imagePointerId: "d656e0e9-cbcb-4e3e-a7e1-3099964e72c1",
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
                        id: "fb8b4013-2f63-4ba5-b4a4-f1011a1db2c3",
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
                sort: 0,
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
                sort: 1,
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
    }, {
        id: "2d11f519-590e-47fe-a50c-2b88dbff6eca",
        images: [
            {
                id: "3569b611-8d75-4d87-8e6c-73510b94681c",
                url: "https://www.nikonekomatcha.com/wp-content/uploads/2020/12/AJISAI-80g-2.jpg",
                sort: 0
            }
        ],
        categoryId: "54c1720e-9fbd-4f21-8f97-9944fd1fae57",
        brandId: "21d213ec-06b4-47ce-8279-4d92c51c9185",
        storeId: "a22fa02b-deb1-4664-a716-349beec3ef30",
        name: "Ren matcha powder",
        salePrice: 1500,
        retailPrice: 1500,
        variants: [
            {
                id: "9b53028b-0e31-49c1-81db-5f3049097aa0",
                name: "Weight",
                sort: 0,
                options: [
                    {
                        id: "c869d5a9-02b8-46cd-a3c9-f749f65480f1",
                        name: "6g",
                        sort: 0
                    }, {
                        id: "75389449-3a92-40e2-9fca-dcd87df05acf",
                        name: "80g",
                        sort: 1
                    }, {
                        id: "d264e637-ae2e-48f3-94e8-3f6cc2d15b31",
                        name: "200g",
                        sort: 2
                    }
                ]
            }
        ],
        inventories: [
            {
                id: "28d6c947-5d99-41c9-ab7d-f6cc383157bd",
                sku: "6g",
                salePrice: 0,
                retailPrice: 0,
                imagePointerId: null,
                skus: [
                    {
                        variantId: "9b53028b-0e31-49c1-81db-5f3049097aa0",
                        optionId: "c869d5a9-02b8-46cd-a3c9-f749f65480f1",
                        inventoryId: "28d6c947-5d99-41c9-ab7d-f6cc383157bd",
                        sort: 1
                    }
                ],
                stocks: [
                    {
                        id: "58f44c53-986d-42ff-9099-70ff32c02e40",
                        quantity: 200,
                        inventoryId: "28d6c947-5d99-41c9-ab7d-f6cc383157bd",
                        storeId: "a22fa02b-deb1-4664-a716-349beec3ef30",
                        branchId: "4a9569a4-3938-4e71-b527-9325c6849fe2",
                        location: "A1"
                    }
                ]
            }, {
                id: "5dd80462-ee36-41e0-aa9a-31850777a250",
                sku: "80g",
                salePrice: 2000,
                retailPrice: 2000,
                imagePointerId: null,
                skus: [
                    {
                        variantId: "9b53028b-0e31-49c1-81db-5f3049097aa0",
                        optionId: "75389449-3a92-40e2-9fca-dcd87df05acf",
                        inventoryId: "5dd80462-ee36-41e0-aa9a-31850777a250",
                        sort: 1
                    }
                ],
                stocks: [
                    {
                        id: "83169be7-cf3b-4a89-a114-a06ccbc0231f",
                        quantity: 100,
                        inventoryId: "5dd80462-ee36-41e0-aa9a-31850777a250",
                        storeId: "a22fa02b-deb1-4664-a716-349beec3ef30",
                        branchId: "4a9569a4-3938-4e71-b527-9325c6849fe2",
                        location: "A1"
                    }
                ]
            }, {
                id: "0d84cac1-01a3-4899-87bf-1f7b70a5353e",
                sku: "200g",
                salePrice: 4000,
                retailPrice: 4000,
                imagePointerId: null,
                skus: [
                    {
                        variantId: "9b53028b-0e31-49c1-81db-5f3049097aa0",
                        optionId: "d264e637-ae2e-48f3-94e8-3f6cc2d15b31",
                        inventoryId: "0d84cac1-01a3-4899-87bf-1f7b70a5353e",
                        sort: 1
                    }
                ],
                stocks: [
                    {
                        id: "10ce4d9b-ee73-4e17-aba6-452c77457994",
                        quantity: 100,
                        inventoryId: "0d84cac1-01a3-4899-87bf-1f7b70a5353e",
                        storeId: "a22fa02b-deb1-4664-a716-349beec3ef30",
                        branchId: "4a9569a4-3938-4e71-b527-9325c6849fe2",
                        location: "A1"
                    }
                ]
            }
        ]
    }
].map(async ({ id: productId, images, variants, inventories, ...rest }) => {
    await prisma.product.upsert({
        where: { id: productId },
        create: { id: productId, ...rest },
        update: { ...rest }
    });

    await Promise.all(
        images.map(async ({ id: imageId, ...rest }) => {
            await prisma.productImage.upsert({
                where: { id: imageId },
                create: { id: imageId, ...rest, productId },
                update: { id: imageId, ...rest, productId }
            })
        })
    );

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
        inventories.map(async ({ id, sku, salePrice, retailPrice, imagePointerId, skus, stocks }) => {
            await prisma.inventory.upsert({
                where: { id },
                create: { id, sku, salePrice, retailPrice, imagePointerId, productId },
                update: { sku, salePrice, retailPrice, imagePointerId, productId }
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