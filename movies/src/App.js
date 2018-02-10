import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';
import indico from 'indico.io';




class App extends Component {
  constructor() {
    super();
    this.state = {
    quotes: [],
    page: ''
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
        var idx = o[0].pageid;
        grabPageID(idx);
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
    ).then(function(res) {console.log(res)});
  }

  parseString(messy) {
    var re = /[a-zA-Z,'-\s]+[.?!]/g;
    var matches = messy.match(re);
    return matches;

  }

  getQuotes(searchItem) {
     var page = this.getPage(function(pageId){
       console.log(pageId);
       this.getData(pageId, function(revisions) {
         console.log(revisions);
         var thing = revisions.query.pages[0].revisions[0].content;
         var arr = this.parseString(thing);
         this.setState({quotes: arr});
         console.log(thing);
       }.bind(this));
     }.bind(this), searchItem);

   }


}

export default App;
