import { DialogContent, DialogFooter, DialogTitle } from "./ui/dialog";
import { useCallback, useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProucts } from "@/pages/home.api";
import type { Product as ProductType, Variant as VariantType } from "@/schemas/product.schema";
import CustomInput from "./CustomInput.component";
import { Icon } from "@iconify/react";
import { Spinner } from "flowbite-react";
import { useRef } from "react";
import { ProductToDscount } from "@/pages/home";


interface Props {
  open: boolean,
  productId?: number,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  products: ProductType[],
  setProducts: React.Dispatch<React.SetStateAction<ProductType[]>>,
  productToReplace: number,
  setProductToReplace: React.Dispatch<React.SetStateAction<number>>
  setDiscountValue: React.Dispatch<React.SetStateAction<ProductToDscount>>;
}

export default function AddProductDialog(props: Props) {

  const { open, setOpen, setProducts: setProductsAtHome, productToReplace } = props;

  const [products, setProducts] = useState<ProductType[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [page, _setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  // const [adddProducts, setAddProducts] = useState<ProductType[]>();

  const observer = useRef<IntersectionObserver | null>(null);
  const rootElement = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['fetchProducts', page, searchQuery],
    queryFn: ({ pageParam }) => fetchProucts({ search: searchInput, page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
    getPreviousPageParam: (_firstPage, _allPages) => {
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

  useEffect(() => {
    setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);

  }, [searchInput]);

  const handleAddProduct = () => {
    setProductsAtHome(prev => {

      const productsToAdd = products.filter(prod => prod.selected)

      //if (productToReplace < 0) return productsToAdd;

      if (productsToAdd.length + prev.length > 5) {
        alert("can not add more than 5 proudcts");
        return prev;
      }

      let insertAt = prev.findIndex((prod) => prod.id === productToReplace);

      prev.splice(insertAt, 1, ...productsToAdd);

      return prev;
    });
    setOpen(false);
    setProducts(prev => {
      return prev.map(pr => {
        pr.selected = false;
        return pr;
      })
    });
  }

  const handleProductClick = useCallback((e: React.ChangeEvent<HTMLInputElement>, p: ProductType) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === p.id) {
          const isSelected = e.target.checked;
          return {
            ...product,
            selected: isSelected,
            variants: product.variants.map((variant) => ({
              ...variant,
              selected: isSelected
            }))
          }
        }
        return product
      })
    )
  }, []);

  const handleVariantClick = useCallback((e: React.ChangeEvent<HTMLInputElement>, v: VariantType) => {

    setProducts((prevProducts) => {
      return prevProducts.map((product) => {
        if (product.id === v.product_id) {
          const updatedVariants = product.variants.map((variant) =>
            variant.id === v.id ? { ...variant, selected: e.target.checked } : variant
          );

          const isProductSelected = updatedVariants.some((v) => v.selected);

          return {
            ...product,
            selected: isProductSelected,
            variants: updatedVariants
          }
        }

        return product;
      })
    })
  }, []);


  return (
    <DialogContent className="p-0 h-[70vh] max-w-[35%] overflow-hidden">
      <div>
        <DialogTitle className="px-4 pt-4 bg-white">
          <p className="text-2xl">Select Products</p>
          <div className="w-full p-4">
            <CustomInput
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              icon="material-symbols-light:search"
              iconPosition="left"
              className="bg-white border focus:border border-gray-100"
            />
          </div>
        </DialogTitle>
        <div ref={rootElement} className="border-2 border-green-300 h-[420px] overflow-scroll">
          <div id="container" className="overflow-scroll h-full">
            {!isLoading ? products.map((prod, prod_idx, prod_arr) => {
              return (
                <div ref={lastElementRef} key={prod_idx} >
                  <div className="w-full border-t border-gray-300 p-3 flex justify-between">
                    <div className="flex gap-2 items-center">
                      <input checked={prod.selected} type="checkbox" onChange={(e) => handleProductClick(e, prod)} />
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
                          <input checked={variant.selected} onChange={(e) => handleVariantClick(e, variant)} type="checkbox" />
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
              <div className="text-center flex items-center justify-center border h-[100%]">
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
            <button onClick={() => setOpen(false)}>cancel</button>
            <button onClick={handleAddProduct}>Add</button>
          </div>
        </div>
        <DialogFooter className="sticky bottom-0">
        </DialogFooter>
      </div>
    </DialogContent>
  )
}
