const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
  author: {
    firstName: String,
    lastName: String
  },
  title: {type: String, required: true},
  content: {type: String},
  created: {type: Date, default: Date.now}
});


blogPostSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    created: this.created
  };
}
const userSchema = mongoose.Schema({
  username: {type:String, unique:true, required: true},
  password: {type:String, required:true},
  firstName: {type:String, default: ""},
  lastName: {type:String, default: ""}
});

userSchema.methods.apiRepr = function() {
  return {
    username: this.userSchema,
    firstName: this.firstName,
    lastName: this.lastName
  };
}

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 12);
}


const BlogPost = mongoose.model('BlogPost', blogPostSchema);
const User = mongoose.model('User', userSchema);

module.exports = {BlogPost, User};
