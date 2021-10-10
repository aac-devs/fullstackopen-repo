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

/*const mostBlogsx = (blogs) => {
  if (blogs.length === 0) return {};
  const authorBlogList = blogs.map((a) => a.author);
  const authors = {};
  for (let author of authorBlogList) {
    if (!authors.hasOwnProperty(author)) {
      authors[author] = 1;
    } else {
      authors[author] += 1;
    }
  }
  const values = Object.values(authors);
  const keys = Object.keys(authors);
  const max = Math.max(...values);
  const index = values.indexOf(max);
  return {
    author: keys[index],
    blogs: max,
  };
};*/

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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
