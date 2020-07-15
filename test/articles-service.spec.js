/* eslint-disable no-unused-vars */
/* eslint-disable strict */

//const { expect } = require('chai');
const ArticlesService = require('../src/articles-service.js');
const knex = require('knex');
const { expect } = require('chai');


/** Note: 
 * There may be issues here due to timezones, daylight savings time, etc... 
 * If you're having issues with the dates being slightly different, 
 * change the endpoint handler to run each article's date_published 
 * through a 'new Date()' constructor //see below for the code// 
* */

describe('Articles service object', function() {
  let db;
  let testArticles = [
    {
      id: 1,
      date_published: new Date('2029-01-22T16:28:32.615Z'),
      title: 'First test post!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
    },
    {
      id: 2,
      date_published: new Date('2100-05-22T16:28:32.615Z'),
      title: 'Second test post!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
    },
    {
      id: 3,
      date_published: new Date('1919-12-22T16:28:32.615Z'),
      title: 'Third test post!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
    },
  ];


  /** Note: 
   * The ordering of identical hooks matters! 
   * If you have multiple before() hooks, 
   * they will sequentially run in order of declaration. 
   * However, differing hooks will run in the expected sequence 
   * regardless of statement order. 
   * MOCHA methods (HOOKs): before, after, beforeEach, afterEach 
  * */

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

  /* Clear the table for a fresh start every time we run the tests */
  before(() => db('blogful_articles').truncate());

  /* Remove all of the data after each test to prevent "test leak" */
  afterEach(() => db('blogful_articles').truncate());

  /* Disconnect from database at the end of all tests to end the script */
  after(() => db.destroy());


  /** Insert test articles into test database before the tests 
   *  Use separate describe blocks for when the database has data and when it doesn't
   * 
   * Note, the context function is a synonym for the describe function. 
   * We can interchange them with no functional difference. 
   * The reason to use context here is for the semantics of reading 
   * the test code to see that we're setting a "context" of state 
   * for a group of tests. */

  context('Given \'blogful_articles\' has data', () => {
    beforeEach(() => {
      return db
        .into('blogful_articles')
        .insert(testArticles);
    });
    
    it('getAllArticles() resolves all articles from \'blogful_articles\' table', () => {
      return ArticlesService.getAllArticles(db)
        .then(actual => {
          expect(actual).to.eql(testArticles);
        });
    });

    it('getById() resolves an article by id from \'blogful_articles\' table', () => {
      const thirdId = 3;
      const thirdTestArticle = testArticles[thirdId - 1];
      return ArticlesService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdId,
            title: thirdTestArticle.title,
            content: thirdTestArticle.content,
            date_published: thirdTestArticle.date_published,
          });
        });
    });

    it('deleteArticle() removes an article by id from \'blogful_articles\' table', () => {
      const articleId = 3;
      return ArticlesService.deleteArticle(db, articleId)
        .then(() => ArticlesService.getAllArticles(db))
        .then(allArticles => {
          // copy the test articles array without the "deleted" article
          const expected = testArticles.filter(article => article.id !== articleId);
          expect(allArticles).to.eql(expected);
        });
    });

    it(`updateArticle() updates an article from the 'blogful_articles' table`, () => {
      const idOfArticleToUpdate = 3
      const newArticleData = {
        title: 'updated title',
        content: 'updated content',
        date_published: new Date(),
      }
      return ArticlesService.updateArticle(db, idOfArticleToUpdate, newArticleData)
        .then(() => ArticlesService.getById(db, idOfArticleToUpdate))
        .then(article => {
          expect(article).to.eql({
            id: idOfArticleToUpdate,
            ...newArticleData,
          });
        });
    })

  });

  context('Given \'blogful_articles\' has no data', () => {
    it('getAllArticles() resolves an empty array', () => {
      return ArticlesService.getAllArticles(db)
        .then(actual => {
          expect(actual).to.eql([]);
        });
    });

    it('insertArticle() inserts a new article and resolves the new article with an \'id\'', () => {
      const newArticle = {
        title: 'Test new title',
        content: 'Test new content',
        date_published: new Date('2020-01-01T00:00:00.000Z'),
      };
      return ArticlesService.insertArticle(db, newArticle)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            title: newArticle.title,
            content: newArticle.content,
            date_published: new Date(newArticle.date_published),
          });
        });
    });
  });
});