// import { buildMetadata } from "@rootline/seo";
// import { Key } from "lucide-react";
// import type { Metadata } from "next"

// export const metadata: Metadata = buildMetadata({
//     title: "Product",
//     description: "Rootline Technology, an engineering studio building secure software with care.",
//     path: "/product",
// });

// const product = [
//     {
//         project_name: "A2Z Electronic Marmat",
//         image: "/product/a2z.jpeg",
//     }
// ]

// export default function ProductPage() {
//     return (
//         <section className="pt-10 pb-50">
//             <div>
//                 <h1 className="text-center font-bold text-5xl">Our Product</h1>
//                 <p className="text-center pt-7">A showcase of projects where creativity, technology, and strategy come together to deliver impact.</p>
//             </div>

//             <div className="pt-10 pl-10">
//                 {product.map((product, index) => (
//                     <div
//                         key={index}
//                         className="w-80 rounded-lg shadow-2xl overflow-hidden"
//                     >
//                         <img
//                             src={product.image}
//                             alt={product.project_name}
//                             width={320}
//                             height={220}
//                         />

//                         <div>
//                             <h2 className="text-xl font-semibold text-center">
//                                 {product.project_name}
//                             </h2>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </section>
//     )
// }


import { buildMetadata } from "@rootline/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "Product",
  description:
    "Rootline Technology, an engineering studio building secure software with care.",
  path: "/product",
});

const products = [
  {
    project_name: "A2Z Electronic Marmat",
    image: "/product/a2z.jpeg",
    link:"https://www.a2zelectricmarmat.com/",
  },
  {
    project_name:""
  }
];

export default function ProductPage() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold">Our Products</h1>
          <p className="mt-5 text-gray-500 max-w-2xl mx-auto font-semibold text-2xl">
            A showcase of projects where creativity, technology, and strategy
            come together to deliver impact.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product, index) => (
            <Link
              key={index}
              href={product.link}
              target="blank"
              className="group overflow-hidden rounded-xl border border-gray-800 bg-black shadow-xl"
            >
              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.project_name}
                  className="w-full h-220px object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-5 bg-black">
                <h2 className="text-white text-2xl font-semibold">
                  {product.project_name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}