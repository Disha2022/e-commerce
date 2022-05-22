const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  Category.findAll()
    .then(categories => res.json(categories))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  // be sure to include its associated Products
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  Category.findOne({
    where: {
      id: req.params.id
    }
      .then(data => {
        if (!data) {
          res.status(404).json({ message: 'No Category found with this id' });
          return;
        }
        res.json(data);
      })

      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      })
  // be sure to include its associated Products
  });

  router.post('/', (req, res) => {
  // create a new category
    Category.create({
      category_name: req.body.category_name
    })
      .then(data => res.json(data))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.put('/:id', (req, res) => {
  // update a category by its `id` value
    Category.update({
      category_name: req.body.category_name
    });
  });

  router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  });
});

module.exports = router;
