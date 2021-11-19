const { Book, User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args,context) => {
      if(context.user){
        const myUserData = await User.findOne({_id: context.user._id})
        return myUserData
      }
    throw new AuthenticationError('Please Log In');
    },
  },

  Mutation: {
    login: async (parent, {email, password}) =>{
      const user = await User.findOne(email);
      if (!user) {
        return new AuthenticationError('Log In Unsuccessful, Please Check Creditials and Try Again');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        return new AuthenticationError('Log In Unsuccessful, Please Check Creditials and Try Again');
      }
      const token = signToken(user);
      return { token, user };
    },

    addUser: async ( parent, args) =>{
      const user = await User.create(args);
      const token =signToken(user);
      return{token, user}
    },

    saveBook: async (parent, {bookData}, context) => {
      if(context.user){
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true}
        );
        return updatedUser;
      }

      throw new AuthenticationError('Please Log In');
    },

    deleteBook: async (parent,{ bookID }, context) => {
      if (context.user){
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: {bookId} } },
          { new: true }
        );
      
        return updatedUser;
      }
      throw new AuthenticationError('Please Log In');
    }

  }
};



module.exports = resolvers;