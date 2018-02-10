import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';

class App extends Component {
  constructor() {
    super();
    this.state = {
    quotes: [],
    page: '',
    pageTitle: 'Home',
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.refs.search.value === '') {
        alert('Search text is required');
    }
    else {
        this.getQuotes(this.refs.search.value);
    }


}


render() {
  return (
    <div className="App">
      <div className="Search">
      <h1>Search WikiQuotes</h1>
      <h2>You are looking at: {this.state.pageTitle}</h2>
      <form onSubmit={this.handleSubmit.bind(this)}>
          <div>
              <label>Search</label><br />
              <input type="text" placeholder="search" ref="search" />
          </div>
          <input type="submit" value="Search" />
      </form>
    </div>
      <p>{this.state.quotes}</p>

    </div>
  );
}

 getPage(grabPageID, id) {
    $.ajax({
      async: false,
      url: 'https://en.wikiquote.org/w/api.php',
      dataType: 'jsonp',
      data: {
        action: 'query',
        list: 'search',
        srsearch: id,
        utf8: '',
        format: 'json',
      },

      cache: false,
      success: function(thing) {
        console.log(thing);
        var o = thing.query.search;
        if (o[0] === undefined) {
          grabPageID(-1, 'Bad Search');
        } else {
        var idx = o[0].pageid;
        var title = o[0].title;
        grabPageID(idx, title);
      }
      },

      error: function(xhr, status, err) {
        console.log('hi');
      }
    })
  }

  getData(page, callback) {
    let p = String(page);
    $.ajax({
      async: false,
      url: 'https://en.wikiquote.org/w/api.php',
      dataType: 'jsonp',
      data: {
        action: 'query',
        pageids: page + '',
        prop: 'revisions',
        rvprop: 'content',
        format: 'json',
        formatversion: '2'
      },
      cache: false,
      success: function(pageData) {
      //  console.log(pageData);
        callback(pageData);
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }
    })
  }

  getEmote(data) {
    $.post(
      'https://apiv2.indico.io/emotion/batch',
      JSON.stringify({
        'api_key': "601a9a72cc56692d1f388c608fa955b8",
        'data': data,
        'threshold': 0.1
      })
    ).then(function(res) {
      console.log(res);
    });
  }

  parseString(messy) {
    var re = /[a-zA-Z,'-\s]+[.?!]/g;
    var matches = messy.match(re);
    return matches;

  }

  getQuotes(searchItem) {
     var page = this.getPage(function(pageId, tle){
       if (pageId === -1) {
         this.setState({pageTitle: 'Bad search'});
         this.setState({quotes: ['THIS IS A BAD SEARCH']});
       } else {
       console.log(pageId);
       this.setState({pageTitle: tle});
       this.setState({isBadSearch: false});
       this.getData(pageId, function(revisions) {
         console.log(this.state.pageTitle);
         var thing = revisions.query.pages[0].revisions[0].content;
         var arr = this.parseString(thing);
         if (arr === null) {
           this.setState({quotes: ['Please be more specific']});
         } else {
         this.setState({quotes: arr});
       }
       }.bind(this));
    } }.bind(this), searchItem);

   }


}

export default App;
