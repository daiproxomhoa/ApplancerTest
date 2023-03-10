import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useDebounce from "../hook/useDebounce";

const ListPage = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const [term, setTerm] = useState(searchParams.get("term"));
  const debouncedValue = useDebounce(term, 300);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const mappedData = useMemo(() => {
    return data.reduce((v, c) => [...v, ...c], []);
  }, [data]);

  const observer = useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      if (
        first.isIntersecting &&
        data.length > 0 &&
        data?.every((v) => v.length > 0)
      ) {
        setPage((no) => no + 1);
      }
    })
  );

  const getData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      `https://dummyjson.com/products/search?skip=${
        page * 9
      }&limit=9&q=${debouncedValue}`
    );
    const json = await res.json();
    setData((old) => (page ? [...old, json.products] : [json.products]));
    setLoading(false);
  }, [debouncedValue, page]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    setData([]);
    setPage(0);
    navigate(
      { search: `?term=${debouncedValue}` },
      { replace: true, preventScrollReset: false }
    );
    window.scrollTo({ top: 0 });
  }, [debouncedValue, navigate]);

  useEffect(() => {
    const currentElement = ref.current;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, []);

  return (
    <>
      <div className="flex justify-center sticky top-0 p-4 z-10 bg-gray-800">
        <div>
          <input
            className={"text-field rounded-xl px-4 w-96 mx-auto"}
            autoComplete="off"
            defaultValue={searchParams.get("term")}
            onKeyUp={(e) => setTerm(e.currentTarget.value)}
            placeholder={"Search products"}
          />
        </div>
      </div>
      <div className="container pb-4">
        <div className="grid grid-cols-3 gap-6 mt-10">
          {mappedData.map((item) => {
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
        {!loading && mappedData.length === 0 && (
          <p className="text-xl text-center mx-auto">No data found!</p>
        )}
        {loading && (
          <div className="flex justify-center">
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
        )}
      </div>
      <div ref={ref} />
    </>
  );
};
export default ListPage;
