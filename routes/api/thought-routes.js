const router = require('express').Router();
const {
    getAllThought,
    getThoughtbyId,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction
} = require('../../controllers/thought-controller');

router
    .route('/')
    .get(getAllThought)
    .post(createThought);

router
    .route('/:id')
    .get(getThoughtbyId)
    .put(updateThought)
    .delete(deleteThought);

router
    .route('/:thoughtId/reactions')
    .post(addReaction)
    .delete(removeReaction);

module.exports = router;