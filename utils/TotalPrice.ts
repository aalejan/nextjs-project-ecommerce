import { AddCartType } from "@/types/AddCartType";

const totalPrice = (arr: Array<AddCartType>) => {
  return arr.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0);
};

export default totalPrice;
