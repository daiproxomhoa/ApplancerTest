import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Virtual, Navigation, Pagination } from "swiper";

SwiperCore.use([Virtual, Navigation, Pagination]);

const DetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://dummyjson.com/products/${id}`);
      const json = await res.json();
      if (res.status === 200) setData(json);
    } catch (e) {}
    setLoading(false);
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin -ml-1 mr-3 h-10 w-10 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        Product not found!
      </div>
    );
  }

  return (
    <>
      <div>
        <Swiper
          centeredSlides={true}
          pagination={{
            type: "bullets",
          }}
          navigation={true}
          virtual
        >
          {data?.images?.map((item, index) => {
            return (
              <SwiperSlide key={index} virtualIndex={index}>
                <div className="bg-black flex justify-center h-64">
                  <img
                    src={item}
                    alt="images"
                    className="h-full object-contain"
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <div className="container py-4">
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold">{data.title}</h1>
            <h2 className="text-xl">Rating:&nbsp;{data.rating}</h2>
            <h2 className="text-xl">Stock:&nbsp;{data.stock}</h2>
            <h2 className="text-xl">Category:&nbsp;{data.category}</h2>
            <h2 className="text-xl">Brand:&nbsp;{data.brand}</h2>
            <h2 className="text-xl">Description:&nbsp;{data.description}</h2>
          </div>
          <div>
            <h2 className="text-5xl font-bold text-yellow-400">
              {new Intl.NumberFormat("en", {
                maximumSignificantDigits: 3,
              }).format(data.price)}
            </h2>
            {data.discountPercentage && (
              <p className="text-lg text-red-600 font-bold">
                -{data.discountPercentage}%
              </p>
            )}
          </div>
        </div>
        <img src={data.thumbnail} alt="thumbnail" className="mt-4" />
        <div className="flex justify-center gap-2 my-10 items-center">
          <Link
            to={{ pathname: "/" + (Number(id) > 1 ? Number(id) - 1 : "1") }}
            className="p-4"
          >
            Previous Product
          </Link>
          <p>/</p>
          <Link to={{ pathname: "/" + (Number(id) + 1) }} className="p-4">
            See Next
          </Link>
        </div>
      </div>
    </>
  );
};
export default DetailPage;
