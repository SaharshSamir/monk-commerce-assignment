import type { Product } from "@/schemas/product.schema"
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from 'react';
import { Icon } from "@iconify/react";
import CustomInput from "@/components/CustomInput.component";

type Props = {
  product?: Product,
  openDialog: React.Dispatch<React.SetStateAction<boolean>>,
  inputValue: string
}

export default function Product(props: Props) {
  const [inputValue, setInputValue] = useState(props.inputValue ?? "");
  const { setNodeRef, listeners, attributes, transform, transition } = useSortable({ id: props?.product?.id || -1 });


  const styles = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div className="z-50 w-full col-span-2 flex gap-3 my-3" style={styles} ref={setNodeRef} {...attributes}>
      <div {...listeners} className="flex items-center"><Icon icon="lsicon:drag-filled" fontSize={30} /></div>
      <div className="w-1/2 flex justify-center border relative text-gray-400 focus-within:text-gray-600 ">
        <form className="w-full">
          <CustomInput value={props.inputValue} setValue={setInputValue} icon="jam:pencil-f" iconPosition="right" iconAction={() => props.openDialog(true)} />
        </form>
      </div>
      <div className="w-1/2 flex justify-center">
        <button className="px-10 py-2 bg-[#008060] text-white rounded-md font-semibold">Add Discount</button>
      </div>
    </div>
  )
}
