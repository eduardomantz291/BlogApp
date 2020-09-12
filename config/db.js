if (process.env.NODE_ENV == "production") {
  module.exports = {mongoURI: "mongodb+srv://eduardoblogapp:eduardoblogapp@cluster0.oxsnb.mongodb.net/blogapp?retryWrites=true&w=majority"}
}else {
  module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}