import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders content', async () => {
  const newBlog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John',
    url: 'www.lol.dk',
    likes: 0,
    user: {
      username: 'Dr John',
      password: '123',
      id: 23411
    }
  }
  const testUser = {
    username: 'Dr Evil'
  }

  render(<Blog blog={newBlog} user={testUser}/>)

  const titleAndAuthorElement = screen.getByText('Component testing is done with react-testing-library John')
  expect(titleAndAuthorElement).toBeVisible()

  const likeButtonElement = screen.getByText('like')
  expect(likeButtonElement).not.toBeVisible()

  const urlElement = screen.getByText('www.lol.dk')
  expect(urlElement).not.toBeVisible()
})

test('renders url and likes when show button is pressed', async () => {
  const newBlog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John',
    url: 'www.lol.dk',
    likes: 0,
    user: {
      username: 'Dr John',
      password: '123',
      id: 23411
    }
  }
  const testUser = {
    username: 'Dr Evil'
  }

  let { container } = render(<Blog blog={newBlog} user={testUser} setBlogs={() => 4+2}/>)

  const userActor = userEvent.setup()
  const showButton = container.querySelector('.visButton')
  await userActor.click(showButton)

  const likeButtonElement = screen.getByText('like')
  expect(likeButtonElement).toBeVisible()

  const urlElement = screen.getByText('www.lol.dk')
  expect(urlElement).toBeVisible()

})

test('if like button is clicked twice the event-handler is called twice', async () => {
  const newBlog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John',
    url: 'www.lol.dk',
    likes: 0,
    user: {
      username: 'Dr John',
      password: '123',
      id: 23411
    }
  }
  const testUser = {
    username: 'Dr Evil'
  }

  const mockHandler = jest.fn()
  const mockService = {
    update : () => {
      //Database updated
    }
  }

  let { container } = render(<Blog blog={ newBlog } user={ testUser } fetchBlogs={ mockHandler } blogService={ mockService }/>)

  const userActor = userEvent.setup()
  const showButton = container.querySelector('.visButton')
  await userActor.click(showButton)

  const likeButton = container.querySelector('.likeButton')
  await userActor.click(likeButton)
  await userActor.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('when a new blog is created the blog form is updated', async () => {
  const mockSetMessage = jest.fn()
  const mockSetBlogs = jest.fn()
  const mockServiceCalls = jest.fn()

  const mockBlogFormRef = {
    current: {
      toggleVisibility: () => {
        //Empty mock method call
      }
    }
  }

  const mockService = {
    create : (blogtoCreate) => {
      mockServiceCalls(blogtoCreate)
    }
  }

  let { container } = render(<BlogForm setBlogs={ mockSetBlogs } setMessage={ mockSetMessage } blogService={ mockService } blogFormRef = {mockBlogFormRef}/>)

  const userActor = userEvent.setup()
  const createButton = container.querySelector('.createButton')
  await userActor.click(createButton)

  expect(mockServiceCalls.mock.calls[0][0]).toHaveProperty('title')
  expect(mockServiceCalls.mock.calls[0][0]).toHaveProperty('author')
  expect(mockServiceCalls.mock.calls[0][0]).toHaveProperty('url')
})