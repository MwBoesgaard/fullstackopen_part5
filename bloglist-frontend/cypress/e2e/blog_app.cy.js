describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'John McBobson',
      username: 'JohnMcBob',
      password: '1234'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })
  it('Login form is shown', function () {
    cy.contains('Blogs')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('JohnMcBob')
      cy.get('#password').type('1234')
      cy.get('#login-button').click()

      cy.contains('logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('JohnMcBob')
      cy.get('#password').type('lol')
      cy.get('#login-button').click()

      cy.contains('wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3001/api/login', {
        username: 'JohnMcBob', password: '1234'
      }).then(response => {
        localStorage.setItem('loggedAppUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })

    it('A blog can be created', function() {
      cy.contains('new blog post').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress')
      cy.get('#url').type('www.cypress.cp')
      cy.contains('create').click()

      cy.contains('a blog created by cypress')
    })

    it('A blog can be liked', function() {
      cy.contains('new blog post').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress')
      cy.get('#url').type('www.cypress.cp')
      cy.contains('create').click()

      cy.get('.visButton').click()
      cy.get('.likeButton').click()

      cy.contains('1')
    })

    it('A blog can be deleted by its creator', function() {
      cy.contains('new blog post').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress')
      cy.get('#url').type('www.cypress.cp')
      cy.contains('create').click()

      cy.get('.visButton').click()
      cy.get('.delButton').click()

      cy.contains('www.cypress.cp').should('not.exist')
    })

    it('After liking a blog, the shown blogs will be sorted after the most likes', function() {
      cy.contains('new blog post').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress')
      cy.get('#url').type('www.cypress.cp')
      cy.contains('create').click()

      cy.contains('new blog post').click()
      cy.get('#title').type('the second blog created by cypress')
      cy.get('#author').type('cypress')
      cy.get('#url').type('www.cypress.cp')
      cy.get('.createButton').click()

      cy.wait(500)

      cy.get('.visButton').eq(1).click()
      cy.get('.likeButton').eq(1).click()

      cy.wait(500)

      cy.get('.blog').eq(0).should('contain', 'the second blog created by cypress')
    })
  })


})