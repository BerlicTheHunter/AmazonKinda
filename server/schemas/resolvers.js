const { Book, User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args,context) => {
      console.log("query made");
      if(context.user){
        return User.findOne({_id: context.user._id});
      }
    throw new AuthenticationError('Please Log In');
    },
  },

  Mutation: {
    login: async (parent, {email, password}) =>{
      const user = await User.findOne({email});
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

    addUser: async ( parent, {username,email,password}) =>{
      console.log("ran add user");
      const user = await User.create({username,email,password});
      const token = signToken(user);
      return{token, user};
    },

    saveBook: async (parent, {bookData}, context) => {
      console.log(bookData);
      console.log(context.user);
      if(context.user){
        const updateBook = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: {bookData} } },
          { new: true}
        );
        return updateBook;
      }

      throw new AuthenticationError('Please Log In');
    },

    deleteBook: async (parent,{ bookId }, context) => {
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