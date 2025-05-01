const { Cart } = require("../models")

class CartController {
  static async addToCart(req, res, next) {
    try {
      const { id } = req.params
      console.log(id, "<<< id product")
      // const { productId, quantity } = req.body
      // const { id: userId } = req.user

      // const cart = await Cart.create({
      //   productId,
      //   quantity,
      //   userId
      // })

      // res.status(201).json(cart)
    }
    catch (error) {
      console.log(error)
      next(error)
    }
  }
}

module.exports = CartController 