const { Thought, User } = require('../models');
const { Types } = require('mongoose');

const thoughtController = {
    async getAllThoughts(req, res) {
        try {
            const thoughts = await Thought.find({});
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getThoughtById(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });
            if (!thought) {
                res.status(404).json({ message: "Thought not found!" });
            } else {
                res.json(thought);
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);

            const user = await User.findByIdAndUpdate(
                req.body.userId,
                { $addToSet: { thoughts: thought._id } },
                { runValidators: true, new: true }
            );

            return res.status(200).json({ thought, user });
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({
                _id: req.params.thoughtId,
            });

            if (!thought) {
                return res.status(404).json({ message: "No thought with that ID" });
            }

            return res.status(200).json({
                message: "Thought & associated reactions successfully deleted",
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: "No thought with this id!" });
            }

            return res.status(200).json(thought);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async createReaction(req, res) {
        try {
            const reaction = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true }
            );

            if (!reaction) {
                return res.status(404).json({ message: "No thought with that ID" });
            }

            return res.status(200).json(reaction);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    async deleteReaction(req, res) {
        try {
            const reaction = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
               // { $pull: { reactions: { _id: req.params.reactionId }  },
                { runValidators: true, new: true }
            );
            
            if (!reaction) {
                return res
                    .status(404)
                    .json({ message: "Check thought and reaction ID" });
            }

            return res.status(200).json(reaction);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
};

module.exports = thoughtController;