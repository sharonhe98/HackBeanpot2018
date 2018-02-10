import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';


class App extends Component {
  constructor() {
    super();
    this.state = {
    quotes: '',
    page: ''
    }
  }

  render() {
    return (
      <div className="App">
        <p>{this.state.quotes}</p>
      </div>
    );
  }

 getPage(grabPageID) {
    $.ajax({
      async: false,
      url: 'https://en.wikiquote.org/w/api.php',
      dataType: 'jsonp',
      data: {
        action: 'query',
        list: 'search',
        srsearch: 'Fury Road',
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

  parseString(messy) {
    var re = /[a-zA-Z,'\s]+[.?!]/g;
    var matches = messy.match(re);
    console.log(matches);

  }

  componentWillMount() {
    let p = '';
    var page = this.getPage(function(pageId){
      console.log(pageId);
      this.getData(pageId, function(revisions) {
        console.log(revisions);
        var thing = revisions.query.pages[0].revisions[0].content;
        this.parseString(thing);
        this.setState({quotes: thing});
        console.log(thing);
      }.bind(this));
    }.bind(this));

  }

  componentDidMount() {
    let p = '';
    var page = this.getPage(function(pageId){
      console.log(pageId);
      this.getData(pageId, function(revisions) {
        console.log(revisions);
        var thing = revisions.query.pages[0].revisions[0].content;
        this.parseString(thing);
        this.setState({quotes: thing});
        console.log(thing);

      }.bind(this));
    }.bind(this));


  }
}

export default App;
