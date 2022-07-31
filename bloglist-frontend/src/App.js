import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Toggable'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedAppUser')
    setUser(null)
  }

  const loginForm = () => (
    <>
      <Togglable buttonLabel="login">
        <LoginForm
          setUser = {setUser}
          setMessage = {setMessage}
        />
      </Togglable>
    </>
  )

  const blogForm = () => (
    <Togglable buttonLabel="new blog post" ref={blogFormRef}>
      <BlogForm
        setBlogs = {setBlogs}
        setMessage = {setMessage}
        blogFormRef = {blogFormRef}
        blogService = {blogService}
      />
    </Togglable>
  )

  const loggedInInfo = () => (
    <p>
      {user.name} logged in <button onClick={handleLogout}>logout</button>
    </p>
  )

  const messageInfo = () => <p style={{ border: '1px solid' }}>{message}</p>

  const fetchBlogs = async () => {
    let allBlogs = await blogService.getAll()
    allBlogs.sort((a, b) => {
      if (a.likes > b.likes) {
        return 0
      } else {
        return 1
      }
    })
    setBlogs(allBlogs)
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  return (
    <div>
      <h2>Blogs</h2>
      {message !== null && messageInfo()}
      {user === null && loginForm()}
      {user !== null && loggedInInfo()}
      {user !== null && blogForm()}
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} user={user} fetchBlogs={fetchBlogs} blogService = {blogService}/>
      ))}
    </div>
  )
}

export default App
