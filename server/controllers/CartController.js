const { Cart, Product } = require("../models")

class CartController {
  static async getCart(req, res, next) {
    try {
      const { id } = req.user
      const cart = await Cart.findAll({
        where: { UserId: id },
        include: ['Product']
      })

      res.status(200).json(cart)
    }
    catch (error) {
      next(error)
    }
  }
  static async addToCart(req, res, next) {
    try {
      const { id } = req.params

      const product = await Product.findByPk(id)
      if (!product) {
        throw { name: 'NotFound', message: 'Product not found' }
      }
      if (product.stock <= 0) {
        throw { name: 'BadRequest', message: 'Product out of stock' }
      }
      const { id: UserId } = req.user
      const cart = await Cart.findOne({
        where: {
          ProductId: id,
          UserId
        }
      })
      if (cart) {
        cart.quantity += 1
        await cart.save()
        return res.status(200).json(cart)
      } else {
        const newCart = await Cart.create({
          ProductId: id,
          UserId
        })
        return res.status(201).json(newCart)
      }
    }
    catch (error) {
      console.log(error)
      next(error)
    }
  }
  static async deleteFromCart(req, res, next) {
    try {
      const { id: UserId } = req.user
      const { id } = req.params
      const cart = await Cart.findOne({
        where: {
          UserId,
          ProductId: id
        }
      })
      if (!cart) {
        throw res.status(404).json({ name: 'NotFound' , message: 'Cart not found' })
      }
      const product = await Product.findByPk(id)
      if (!product) {
        throw res.status(404).json({ name: 'NotFound', message: 'Product not found' })
      }
      await cart.destroy()
      res.status(200).json({ message: 'Product deleted from cart' })
    }
    catch (error) {
      next(error)
    }
  }
}

module.exports = CartController 