import { Product, Variant as VariantType } from "@/schemas/product.schema";
import { Icon } from "@iconify/react";
import CustomInput from "./CustomInput.component";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities";

type Props = {
  variant: VariantType;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
}

export default function Variant(props: Props) {

  const { variant } = props;

  const handleDiscountValueChange = (_e: React.ChangeEvent<HTMLInputElement>, _variant: VariantType) => {
    //handle logic to save input to state or save it to db

  };

  const handleDiscountTypeChange = (_e: React.ChangeEvent<HTMLSelectElement>, _variant: VariantType) => {
    //handle logic to save input to state or save it to db
  };

  //for handling drag for variants
  const { setNodeRef, listeners, attributes, transform, transition } = useSortable({ id: variant?.id || -1 });
  const styles = {
    transform: CSS.Translate.toString(transform),
    transition
  }

  return (
    <div ref={setNodeRef} style={styles} {...attributes} className="flex w-full gap-2 my-2">
      <div className="flex w-1/2">
        <div {...listeners} className="flex items-center"><Icon icon="lsicon:drag-filled" fontSize={30} /></div>
        <div className="rounded-full shadow-sm w-full bg-white p-2 flex border border-[#00000012] justify-center">
          <p>{variant.title}</p>
        </div>
      </div>
      <div className="w-1/3 flex gap-2 justify-center">
        <CustomInput className="rounded-full bg-white" onChange={(e) => handleDiscountValueChange(e, variant)} value={variant?.discount?.toString() || ""} defaultValue="0" />
        <select className="rounded-full" onChange={(e) => handleDiscountTypeChange(e, variant)}>
          <option>Flat</option>
          <option>Percentage</option>
        </select>
      </div>
    </div>
  )
}
