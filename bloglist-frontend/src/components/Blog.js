import { useState } from 'react'

const Blog = ({
  blog,
  user,
  fetchBlogs,
  blogService
}) => {
  const [expanded, setExpanded] = useState(false)

  const hideWhenExpanded = { display: expanded ? 'none' : '' }
  const showWhenExpanded = { display: expanded ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleExpanded = () => {
    setExpanded(!expanded)

  }

  const increaseLike = async () => {
    const newBlogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    await blogService.update(blog.id, newBlogObject)
    fetchBlogs()
  }

  const deletePost = async () => {
    await blogService.remove(blog.id)
    fetchBlogs()
  }

  const deleteButton = () => (
    <>
      <button onClick={deletePost} className='delButton'>remove</button>
    </>
  )

  return (
    <div style={blogStyle} className='blog'>
      <div style={hideWhenExpanded} className='hidingDiv'>
        {blog.title} {blog.author}
        <button onClick={toggleExpanded} className='visButton'>view</button>
      </div>
      <div style={showWhenExpanded}>
        <p>{blog.title} <button onClick={toggleExpanded} className='hideButton'>hide</button></p>
        <p>{blog.url}</p>
        <p>{blog.likes} <button onClick={increaseLike} className='likeButton'>like</button></p>
        <p>{blog.author}</p>
        {user !== null && user.username === blog.user.username && deleteButton()}
      </div>
    </div>
  )
}

export default Blog
