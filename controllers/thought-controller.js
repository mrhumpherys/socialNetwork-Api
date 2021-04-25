const { Thought, User } = require('../models');

const thoughtController = {
    getAllThought(req, res) {
        Thought.find({})
          .populate({
              path: 'reactions',
              select: '-__v'
          })
          .select('-__v')
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => {
              console.log(err);
              res.status(400).json(err);
          });
    },
    getThoughtbyId({ params }, res) {
        Thought.findOne({_id: params.id })
          .select('-__v')
          .then(dbThoughtData => {
            // If no thought is found, send 404
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thought found with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
          });
    },
    createThought({ body }, res) {
        Thought.create(
            {
                thoughtText: body.thoughtText,
                username: body.username
            }
        )
          .then(({ _id }) => {
              return User.findOneAndUpdate(
                  { _id: body.userId },
                  { $push: { thoughts: _id } },
                  { new: true }
              );
          })
          .then(dbUserData => {
              if (!dbUserData) {
                  res.status(404).json({ message: 'No user found with this id!'});
                  return;
              }
              res.json(dbUserData);
          })
          .catch(err => res.json(err));
    },
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
          .then(dbThoughtData => {
            if (!dbThoughtData) {
             res.status(404).json({ message: 'No thought found with this id!' });
             return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.status(400).json(err));
    },
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $push: { reactions: body } },
          { new: true, runValidators: true }
        )
          .then(dbThoughtData => {
            if(!dbThoughtData) {
              res.status(404).json({ message: 'No Thought found with this id!'});
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
    },
    removeReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $pull: { reactions: { reactionId: body.reactionId } } },
          { new: true }
        )
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => res.json(err));
      },
};

module.exports = thoughtController;