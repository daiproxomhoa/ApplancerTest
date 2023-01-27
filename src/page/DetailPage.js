import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

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
    return "Loading...";
  }
  if (!data) {
    return "Product not found!";
  }

  return (
    <>
      <div>
        <Swiper>
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
