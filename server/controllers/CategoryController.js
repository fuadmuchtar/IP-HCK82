class CategoryController {

      static async createCategory(req, res, next) {
        try {
          const newCategory = await Category.create(req.body);
          res.status(201).json(newCategory);
        } catch (error) {
          next(error);
        }
      }
      static async getAllCategories(req, res, next) {
        try {
          const categories = await Category.findAll();
          res.status(200).json(categories);
        } catch (error) {
          next(error);
        }
      }
      static async updateCategory(req, res, next) {
        try {
          const { id } = req.params;
          const category = await Category.findByPk(id);
          if (!category) {
            throw { name: 'NotFound', message: 'Category not found' }
          }
          const updatedCategory = await category.update(req.body);
          res.status(200).json(updatedCategory);
        } catch (error) {
          next(error);
        }
      }
}

module.exports = CategoryController