const { asyncHandler } = require('../utils/asyncHandler');
const blogRepository = require('../repositories/blogRepository');
const { isDataStoreConfigured, emptyListResponse } = require('../utils/dataState');

const listBlogs = asyncHandler(async (req, res) => {
  if (!isDataStoreConfigured()) return emptyListResponse(res);

  const blogs = await blogRepository.listBlogs({
    category: req.query.category,
    search: req.query.search
  });
  res.json({ success: true, count: blogs.length, data: blogs });
});

const getBlogBySlug = asyncHandler(async (req, res) => {
  if (!isDataStoreConfigured()) return res.status(404).json({ success: false, error: 'Blog not found' });

  const blog = await blogRepository.getBlogBySlug(req.params.category, req.params.slug);

  if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' });
  res.json({ success: true, data: blog });
});

module.exports = { listBlogs, getBlogBySlug };
