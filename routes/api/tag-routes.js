/* eslint-disable camelcase */
const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags and associated Product data
  Tag.findAll({
    include: [
      {
        model: Product
      }
    ]
  })
    .then(data => res.json(data))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  Tag.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Product
      }
    ]
  }).then(data => {
    if (!data) {
      res.status(404).json({ message: 'No Category found with this id' });
      return;
    }
    res.json(data);
  }).catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      tag_name: "Basketball",
      productIds: [1, 2, 3, 4]
    }
  */
  Tag.create(req.body)
    .then((tag) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.productIds.length) {
        const productTagIdArr = req.body.productIds.map((productId) => {
          return {
            product_id: productId,
            tag_id: tag.id
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(tag);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then((tag) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { tag_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current product_ids
      const productTagIds = productTags.map(({ product_id }) => product_id);
      // create filtered list of new product_ids
      const newProductTags = req.body.productIds
        .filter((product_id) => !productTagIds.includes(product_id))
        .map((product_id) => {
          return {
            product_id,
            tag_id: req.params.id
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ product_id }) => !req.body.productIds.includes(product_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags)
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
    .then((tag) => {
      res.json(tag);
      // ---- not sure if needed to update product tags
      // return ProductTag.findAll({ where: { tag_id: req.params.id } });
    })
    // .then((productTags) => {
    //   // get list of current product_ids
    //   // figure out which ones to remove
    //   const productTagsToRemove = productTags
    //     .filter(({ product_id }) => !req.body.productIds.includes(product_id))
    //     .map(({ id }) => id);

    //   // run both actions
    //   return ProductTag.destroy({ where: { id: productTagsToRemove } });
    // })
    // .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

module.exports = router;
