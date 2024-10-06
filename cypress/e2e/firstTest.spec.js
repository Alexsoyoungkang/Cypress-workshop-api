describe('Test with backend', () => {

  beforeEach('login to application', () => {
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/tags', { fixture: 'tags.json'}) // stubbing the our own response(tags.json)
    cy.loginToApplication()
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
  })

  it('Verify popular tags are displayed', () => {
    cy.log('we logged in')
    cy.get('.tag-list')
      .should('contain', 'Cypress')
      .and('contain', 'Automation')
      .and('contain', 'testing')
  })

  it.only('Mocking API Response: verify favourite button', () => {
    cy.intercept('GET', 'https://conduit-api.bondaracademy.com/api/articles*', { fixture: 'articles.json'}) //. 와일드카드(*)를 사용하여 쿼리 파라미터나 추가 경로가 있는 요청도 포함됩니다.


    cy.get('a').contains('Global Feed').click()
    cy.get('app-article-list button').then( favouriteList => {
      expect(favouriteList[0]).to.contain('1')
      expect(favouriteList[1]).to.contain('100')
    })

    cy.fixture('articles').then( articleList => {
      const articleSlug = articleList.articles[0].slug
      //articleList.articles[0].favouritesCount = 2
      //articleList.articles[1].favouritesCount = 101

      cy.intercept('POST', `https://conduit-api.bondaracademy.com/api/articles/${articleSlug}/favorite`, articleList)
    })

    cy.get('app-article-list button').eq(0).click().should('contain', '2')
    cy.get('app-article-list button').eq(1).click().should('contain', '101')
  })

})

// Stub vs. Spy
// Stub: Replaces the real network request with fake data. You control what the response is.
// Spy: Watches the network request without changing it. You can see what was sent and what was received, but the real request still happens.