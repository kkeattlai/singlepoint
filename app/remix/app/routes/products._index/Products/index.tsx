import { SerializeFrom } from "@remix-run/node";

import { loader } from "../route";

type ProductProps = {
    product: SerializeFrom<typeof loader>["data"]["masonry"]["2"][number];
};

const Product: React.FC<ProductProps> = ({ product }) => {
    const salePrice = product.salePrice / 100;
    const retailPrice = product.retailPrice / 100;
    const discountPrice = retailPrice - salePrice;

    return (
        <div className="break-inside-avoid space-y-1.5">
            <img className="w-full rounded-lg" src={product.images[0].url} />
            {/* <Image url={product.images[0]?.url} /> */}
            <div className="space-y-0">
                <div className="font-semibold tracking-tight">{ product.name }</div>
                { discountPrice ? (
                    <div className="flex items-center gap-1">
                        <div className="">
                            <span className="text-[10px] text-gray-500">B$</span>
                            <span className="text-sm text-gray-800 font-semibold tracking-tight">{ salePrice.toFixed(2) }</span>
                        </div>
                        <div className="text-xs text-gray-400 line-through">
                            <span>B$</span>
                            <span>{ salePrice.toFixed(2) }</span>
                        </div>
                    </div>
                ) : (
                    <div className="">
                        <span className="text-[10px] text-gray-500">B$</span>
                        <span className="text-sm text-gray-800 font-semibold tracking-tight">{ salePrice.toFixed(2) }</span>
                    </div>
                ) }
            </div>
        </div>
    );
};

type MasonryProps = {
    masonry: SerializeFrom<typeof loader>["data"]["masonry"];
};

const Masonry: React.FC<MasonryProps> = ({ masonry }) => {
    return (
        <div>
            <div className="grid lg:hidden grid-cols-2 gap-4">
                { masonry[2].map(product => (
                    <Product key={product.id} product={product} />
                )) }
            </div>
            <div className="hidden lg:grid xl:hidden grid-cols-3 gap-4">
                { masonry[3].map(product => (
                    <Product key={product.id} product={product} />
                )) }
            </div>
            <div className="hidden xl:grid grid-cols-4 gap-6">
                { masonry[4].map(product => (
                    <Product key={product.id} product={product} />
                )) }
            </div>
        </div>
    );
};

export default Masonry;