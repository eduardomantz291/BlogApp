if (process.env.NODE.ENV == "production") {
  module.exports = {mongoURL: "mongodb+srv://eduardoblogapp:eduardoblogapp@cluster0.oxsnb.mongodb.net/blogapp?retryWrites=true&w=majority"}
}else {
  module.exports = {mongoURL: "mongodb://localhost/blogapp"}
}