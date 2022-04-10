const {User} = require('../models');
const {signToken} = require('../utils/auth');
const {AuthenticationError} = require('apollo-server-express');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (args) {
                const userData = await User.findOne({ _id: args.id })
                .select("-__v - password")
                .populate("savedBooks");

                console.log(userData || "no data")
                return userData;
            }
            console.log("no user data found")
            throw new AuthenticationError("Please log in");
        },

        users: async (parent, args, context) => {
            const users = await User.find()

            return users
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return {token, user};
        },

        login: async (parent, {email, password}, context) => {
            const user = await User.findOne({email});
            console.log(user);

            if (!user) {
                throw new AuthenticationError("Username is incorrect");
            }

            const validPassword = await user.isCorrectPassword(password);

            if(!validPassword) {
                throw new AuthenticationError("Password is incorrect");
            }

            const token = signToken(user);
            return {token, user};
        },

        saveBook: async (parent, args, context) => {
            try {
                if (context.user) {
                    const user = await User.findOneAndUpdate(
                        {_id: context.user._id},
                        // always add to new args, DONT WRITE OVER DATA. ALWAYS NEW!!!
                        {$addToSet: {savedBooks: {...args}}},
                        {new: true, runValidators: true}
                    );
                    return user;
                }
                throw new AuthenticationError("Please log in to continue.");
            } catch (err) {
                console.log(err);
            }
        },

        removeBook: async (parent, args, context) => {
            try {
                if (context.user) {
                    const user = await User.findOneAndUpdate(
                        { _id: user._id },
                        { $pull: {savedBoodks: { bookId: params.bookId}}},
                        {new: true}
                    );
                    return user;
                }
                throw new AuthenticationError("Please log in to continue");
            } catch (err) {}
        } 
    },
};


module.exports = resolvers;