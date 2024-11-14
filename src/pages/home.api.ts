import { axiosInstance } from "@/helpers";
import { apiResponseSchema } from "@/schemas/product.schema";

const apiKey = import.meta.env.VITE_MONKEY_API_KEY;

type Args = {
  search: string,
  page: number,
  limit: number
}

export async function fetchProucts({ search, page, limit }: Args) {

  const res = await axiosInstance.get(`/task/products/search?search=${search}&page=${page}&limit=${limit}`, {
    headers: {
      "x-api-key": apiKey
    }
  });
  const data = await apiResponseSchema.parseAsync(res.data);
  return data;
}
