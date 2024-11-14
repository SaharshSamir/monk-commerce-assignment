import { DialogContent, DialogFooter, DialogTitle } from "./ui/dialog";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useCallback, useEffect, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchProucts } from "@/pages/home.api";
import type { Product as ProductType } from "@/schemas/product.schema";
import { DragEndEvent } from "@dnd-kit/core";
import CustomInput from "./CustomInput.component";
import { Icon } from "@iconify/react";
import { Spinner } from "flowbite-react";
import { useRef } from "react";


interface Props {
  open: boolean
}

export default function AddProductDialog(props: Props) {

  const { open } = props;

  const [products, setProducts] = useState<ProductType[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const observer = useRef<IntersectionObserver | null>(null);
  const rootElement = useRef<HTMLDivElement | null>(null);

  // const { data, isLoading } = useQuery({
  //   queryKey: ["fetchProducts", page],
  //   queryFn: () => fetchProucts({ search: searchInput, page, limit: 10 })
  // });

  console.log("OPENED DIALOG");

  const { data, isLoading, hasNextPage, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['fetchProducts', page],
    queryFn: ({ pageParam }) => fetchProucts({ search: searchInput, page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
    getPreviousPageParam: (firstPage, allPages) => {
      return -1
    },
    initialPageParam: 1,
    enabled: open
  });

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetching) {
        console.log("Fetching next page");
        fetchNextPage();
      }
    }, {
      root: rootElement.current,
      threshold: 0.5,
    });

    if (node) observer.current.observe(node);

  }, [fetchNextPage, hasNextPage, isFetching, isLoading]);

  useEffect(() => {
    const productsNew = data?.pages.reduce((acc, page) => {
      return [...acc, ...page];
    }, []);
    if (productsNew) {
      setProducts(productsNew);
    }
  }, [data]);


  return (
    <DialogContent className="p-0 h-[70vh] max-w-[35%] overflow-hidden">
      {
        isLoading ? <p>Loading...</p>
          :

          (
            <div>
              <DialogTitle className="px-4 pt-4 bg-white">
                <p className="text-2xl">Select Products</p>
                <div className="w-full p-4">
                  <CustomInput value={searchInput} setValue={setSearchInput} icon="material-symbols-light:search" iconPosition="left" className="bg-white border focus:border border-gray-100" />
                </div>
              </DialogTitle>
              <div ref={rootElement} className="border-2 border-green-300 max-h-[420px] overflow-scroll">
                <div id="container" className="overflow-scroll">
                  {!isLoading ? products.map((prod, prod_idx, prod_arr) => {
                    return (
                      <div ref={lastElementRef} key={prod_idx} >
                        <div className="w-full border-t border-gray-300 p-3 flex justify-between">
                          <div className="flex gap-2 items-center">
                            <input type="checkbox" />
                            <div className="border border-gray-200 rounded-md flex items-center justify-center h-9 w-9">
                              {prod.image?.src ? (<img className="object-fit" src={prod.image?.src} />) : (<Icon icon={"gridicons:image"} fontSize={20} color="#8C9096" />)}
                            </div>
                            <p className="text-sm">{prod.title}</p>
                          </div>
                        </div>
                        {prod.variants.map((variant, variant_idx, variant_arr) => {
                          const isLastVariantOfLastProd = prod_idx === prod_arr.length - 1 && variant_idx === variant_arr.length - 1;
                          return (
                            <div key={variant_idx} ref={isLastVariantOfLastProd ? lastElementRef : null} className=" flex pr-2 py-3 border-t border-gray-300 justify-between pl-10">
                              <div className="h-full flex gap-3">
                                <input type="checkbox" />
                                <p>{variant.title}</p>
                              </div>
                              <div className="flex gap-3 pr-5">
                                <p>${variant.price}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  }) :
                    <div className="text-center">
                      <Spinner />
                    </div>
                  }
                </div>
              </div>
              <div className="h-30 flex p-3 justify-between w-full bg-red-200 ">
                <div>
                  1 product selected
                </div>
                <div className="flex gap-2">
                  <button>cancel</button>
                  <button>Add</button>
                </div>
              </div>
              <DialogFooter className="sticky bottom-0">
              </DialogFooter>
            </div>
          )
      }
    </DialogContent>
  )
}