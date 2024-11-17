import { useState } from "react";
import type { Product } from "@/schemas/product.schema"
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@iconify/react";
import CustomInput from "@/components/CustomInput.component";
import Variant from "./Variant.component";
import { ProductToDscount } from "@/pages/home";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

type Props = {
  product?: Product,
  openDialog: React.Dispatch<React.SetStateAction<boolean>>,
  inputValue: string;
  setDiscountValue: React.Dispatch<React.SetStateAction<ProductToDscount>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
}

export default function Product(props: Props) {

  const { product, openDialog, inputValue, setDiscountValue, setProducts } = props;

  const [showDiscount, setShowDiscount] = useState<boolean>(false);
  const [showVariants, setShowVariants] = useState<boolean>(true);

  //for handling drag for products
  const { setNodeRef, listeners, attributes, transform, transition } = useSortable({ id: product?.id || -1 });
  const styles = {
    transform: CSS.Translate.toString(transform),
    transition
  }

  const handleDiscountValueChange = (e: React.ChangeEvent<HTMLInputElement>, prod: Product) => {
    setDiscountValue(prev => {
      return prev.set(prod.id, { type: "flat", discount: Number(e.target.value) || 0 });
    })
  }

  const handleDiscountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>, prod: Product) => {
    setDiscountValue(prev => {
      const currDiscount = prev.get(prod.id);
      return prev.set(prod.id, { discount: currDiscount?.discount || 0, type: e.target.value as "flat" | "percentage" });
    })
  }

  //handle drag end for variants
  const handleDragEnd = (e: DragEndEvent) => {

    if (!product) return;

    const { active, over } = e;

    if (!over) return;

    setProducts(prev => {
      const productVariantToChangeIdx = prev.findIndex(pr => pr?.id === product.id);
      const variantsToChange = prev[productVariantToChangeIdx]?.variants;

      if (!variantsToChange) return prev;

      let activeVariantIndex = variantsToChange.map(v => v.id).indexOf(Number(active.id.toString()));
      let overVariantIndex = variantsToChange.map(v => v.id).indexOf(Number(over.id.toString()));

      const newVariants = arrayMove(prev[productVariantToChangeIdx].variants, activeVariantIndex, overVariantIndex);

      prev[productVariantToChangeIdx].variants = newVariants;
      return [...prev];
    })
  };

  const disableAddDiscount = product === undefined;

  return (
    <div className="w-full col-span-2 my-3" style={styles} ref={setNodeRef} {...attributes}>
      <div className="z-50 w-full flex gap-2 " >
        <div {...listeners} className="flex items-center"><Icon icon="lsicon:drag-filled" fontSize={30} /></div>
        <div className="w-1/2 flex justify-center border relative text-gray-400 focus-within:text-gray-600 ">
          <form className="w-full">
            <CustomInput value={inputValue} icon="jam:pencil-f" iconPosition="right" iconAction={() => openDialog(true)} />
          </form>
        </div>
        {!showDiscount ?
          (
            <div className="w-1/3 flex justify-center">
              <button
                disabled={disableAddDiscount}
                onClick={() => setShowDiscount(true)}
                className={`px-10 py-2 ${disableAddDiscount ? "cursor-not-allowed" : ""} bg-[#008060] text-white rounded-md font-semibold`}
              >
                Add Discount
              </button>
            </div>
          )
          :
          (
            <div className="w-1/3 flex gap-2 justify-center">
              <CustomInput className="bg-white flex-1" onChange={(e) => handleDiscountValueChange(e, product!)} value={product?.discount?.toString() || ""} defaultValue="0" />
              <select className="flex-2" onChange={(e) => handleDiscountTypeChange(e, product!)}>
                <option>Flat</option>
                <option>Percentage</option>
              </select>
            </div>
          )
        }
        <div className="flex items-center">
          <Icon icon={"ic:baseline-close"} fontSize={25} />
        </div>
      </div>
      {
        product && product.variants.length > 1 && (<div onClick={() => setShowVariants(!showVariants)} className="w-full flex items-center justify-end mt-2 cursor-pointer">
          <p className="text-[#006EFF] underline">Show Variants</p>
          <span className="flex items-center">{!showVariants ? (<Icon icon="mdi:keyboard-arrow-down" color="#006EFF" />) : (<Icon icon="mdi:keyboard-arrow-up" color="#006EFF" />)}</span>
        </div>)
      }
      {showVariants && (<div className="w-full flex flex-col mt-2 pl-8">
        {
          product?.variants
          &&
          (
            <DndContext onDragEnd={handleDragEnd}>
              <SortableContext strategy={verticalListSortingStrategy} items={product.variants}>
                {
                  product.variants.map(variant => (
                    <Variant variant={variant} setProducts={setProducts} />
                  ))
                }
              </SortableContext>
            </DndContext>
          )
        }
      </div>)}
    </div>
  )
}
