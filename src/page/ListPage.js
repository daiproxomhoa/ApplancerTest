import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useDebounce from "../hook/useDebounce";

const ListPage = () => {
  const [term, setTerm] = useState("");
  const debouncedValue = useDebounce(term, 300);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const getData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      `https://dummyjson.com/products/search?skip=${
        page * 9
      }&limit=9&q=${debouncedValue}`
    );
    const json = await res.json();
    setData((old) => [...old, ...json.products]);
    setTotal(json.total);
    setLoading(false);
  }, [debouncedValue, page]);

  useEffect(() => {
    getData();
  }, [getData]);

  const onScroll = useCallback(
    (e) => {
      if (
        window.innerHeight + window.pageYOffset >= document.body.offsetHeight &&
        !loading &&
        (page + 1) * 9 < total
      ) {
        setPage((old) => old + 1);
      }
    },
    [loading, page, total]
  );

  useEffect(() => {
    setPage(0);
    setTotal(0);
    setData([]);
  }, [debouncedValue]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  return (
    <div className="container py-4">
      <input
        className={"text-field rounded-xl px-4 w-96 mx-auto"}
        autoComplete="off"
        defaultValue=""
        onKeyUp={(e) => setTerm(e.currentTarget.value)}
        placeholder={"Search products"}
      />
      <div className="grid grid-cols-3 gap-6 mt-10">
        {data.map((item) => {
          return (
            <Link
              to={{ pathname: "/" + item.id }}
              key={item.id}
              className="flex flex-col gap-2"
            >
              <div className="bg-black flex justify-center h-64">
                <img
                  src={item.thumbnail}
                  alt="thumbnail"
                  className="h-full w-auto object-contain"
                />
              </div>
              <p>{item.category}</p>
              <div className="flex justify-between text-xl font-bold">
                <h3>
                  {item.title}-{item.brand}
                </h3>
                <p>{item.rating}</p>
              </div>
              <h3 className="font-bold text-yellow-300 text-3xl">
                {new Intl.NumberFormat("en", {
                  maximumSignificantDigits: 3,
                }).format(item.price)}
              </h3>
            </Link>
          );
        })}

        {!page && loading && (
          <>
            {Array(9)
              .fill(0)
              .map((_, index) => {
                return (
                  <div
                    key={index}
                    className="animate-pulse flex flex-col gap-4"
                  >
                    <div className="bg-neutral-500 h-64" />
                    <div className="h-4 w-1/4 rounded bg-neutral-500" />
                    <div className="flex justify-between">
                      <div className="h-4 w-40 rounded bg-neutral-500" />
                      <div className="h-4 w-10 rounded bg-neutral-500" />
                    </div>
                    <div className="h-4 w-2/5 rounded bg-neutral-500" />
                  </div>
                );
              })}
          </>
        )}
      </div>
      {!loading && data.length === 0 && (
        <p className="text-xl text-center mx-auto">No data found!</p>
      )}
    </div>
  );
};
export default ListPage;
