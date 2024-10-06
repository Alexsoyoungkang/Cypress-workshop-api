describe('Test with backend', () => {

  beforeEach('login to application', () => {
    cy.loginToApplication()
  })

  it('first', () => {
    cy.log('we logged in')
  })

  it('Verify correct request and response', () => {

    cy.intercept('POST', 'https://conduit-api.bondaracademy.com/api/articles/').as('postArticles') // Listens for any POST requests to the specified URL and assigns them the alias '@postArticles'.
    // Intercept - control the behavior of HTTP requests. You can statically define the body, HTTP status code, headers, and other response characteristics.

    cy.get('[href="/editor"]').click(); // navigate to New Article page
    cy.get('[formcontrolname="title"]').type('This is title')
    cy.get('[formcontrolname="description"]').type('This is description')
    cy.get('[formcontrolname="body"]').type('This is body')
    cy.contains('button', 'Publish Article').click()

    //cy.wait('@postArticles') // ensures that the request has been made and a response has been received.
    cy.wait('@postArticles').then( xhr => {
      console.log(xhr)
      expect(xhr.response.statusCode).to.equal(201)
      expect(xhr.request.body.article.title).to.equal('This is title')
      expect(xhr.response.body.article.body).to.equal('This is body')

    })

    it.only('Verify popular tags are displayed', () => {
      
    })

  })
})

// Stub vs. Spy
// Stub: Replaces the real network request with fake data. You control what the response is.
// Spy: Watches the network request without changing it. You can see what was sent and what was received, but the real request still happens.