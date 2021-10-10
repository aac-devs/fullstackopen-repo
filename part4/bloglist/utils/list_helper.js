const dummy = (blogs) => {
  // ...
  return 1;
};

const totalLikes = (blogs) => {
  let total = 0;
  for (let blog of blogs) {
    total += blog.likes;
  }
  return total;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {};
  const likesList = blogs.map((b) => b.likes);
  const max = Math.max(...likesList);
  const index = likesList.indexOf(max);
  const { title, author, likes } = blogs[index];
  return { title, author, likes };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
