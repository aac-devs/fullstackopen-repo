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

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {};
  const totalList = blogs.map((a) => a.author);
  const reducedList = new Set(totalList);
  const counts = [...reducedList].map(
    (item) => totalList.join(' ').match(new RegExp(item, 'g')).length
  );
  const max = Math.max(...counts);
  return {
    author: [...reducedList][counts.indexOf(max)],
    blogs: max,
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {};
  const reducedList = new Set(blogs.map((a) => a.author));
  const counts = [...reducedList].map((item) =>
    blogs.reduce((acc, blog) => {
      if (blog.author === item) return acc + blog.likes;
      return acc;
    }, 0)
  );
  const max = Math.max(...counts);
  return {
    author: [...reducedList][counts.indexOf(max)],
    likes: max,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
