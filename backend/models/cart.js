import mongoose from 'mongoose';

const cartSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        qty: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
