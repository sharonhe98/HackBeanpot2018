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
      url: 'https://en.wikiquote.org/w/api.php',
      dataType: 'jsonp',
      data: {
        action: 'query',
        generator: 'search',
        utf8: '1',
        format: 'json',
        gsrsearch: 'Harry Potter',
        prop: 'extracts',
        exintro: '1',
        exlimit: '20',
        exchars: '200'
      },
      cache: false,
      success: function(thing) {
        var o = thing.query.pages;
        var idx = 0;
        var key = Object.keys(o)[idx];
        var value = o[key];
        console.log(value.pageid);
        grabPageID(value.pageid);

      },

      error: function(xhr, status, err) {
        console.log('hi');
      }
    })
  }

  getData(page, callback) {
    let p = String(page);
    $.ajax({
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

  componentWillMount() {
    let p = '';
    var page = this.getPage(function(pageId){
      console.log(pageId);
      this.getData(pageId, function(revisions) {
        console.log(revisions);
        var thing = revisions.query.pages[0].revisions[0].content;
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
        this.setState({quotes: thing});
        console.log(thing);

      }.bind(this));
    }.bind(this));


  }
}

export default App;
