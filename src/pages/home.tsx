import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Product from "@/components/Product.component";
import { useState } from "react";
import { Product as ProductType } from "@/schemas/product.schema";
import { Dialog } from "@radix-ui/react-dialog";
import AddProductDialog from "@/components/AddProductDialog.component";

export default function Home() {
  const emptyProduct: ProductType = {
    id: -1,
    title: "",
    variants: [],
    image: undefined
  }
  const [products, setProducts] = useState<ProductType[]>([emptyProduct]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over) return;

    console.log('ACTIVE: ', active.id);
    console.log('OVER: ', over.id);

    setProducts(prev => {
      if (prev !== null) {
        let activeProductIndex = prev.map(p => p.id).indexOf(Number(active.id.toString()));
        let overProductIndex = prev.map(p => p.id).indexOf(Number(over.id.toString()));

        console.log(activeProductIndex, overProductIndex);

        console.log(arrayMove(prev, activeProductIndex, overProductIndex));
        prev = arrayMove(prev, activeProductIndex, overProductIndex);
      }
      return prev;
    });
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[50%]">
        <div className="w-fit mb-5">
          <p className="font-bold">Add Products</p>
        </div>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="w-full grid grid-cols-2">

            <p>Product</p>
            <p>Discount</p>
            <SortableContext strategy={verticalListSortingStrategy} items={products}>
              {products.map((prod, idx) => (
                <Product key={idx} product={prod} />
              ))}
            </SortableContext>
          </div>
        </DndContext>
        <Dialog open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)}>
          <AddProductDialog open={openDialog} />
          <div className="w-full mt-8 flex justify-center">
            <button onClick={() => setOpenDialog(true)} className="w-fit px-7 py-2 border-2 rounded-sm text-[#008060] border-[#008060]">Add Product</button>
          </div>
        </Dialog>
      </div>
    </div>
  )
};

