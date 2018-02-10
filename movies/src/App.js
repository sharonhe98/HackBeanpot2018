import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';

class App extends Component {
  constructor() {
    super();
    this.state = {
    quotes: ''
    }
  }

  render() {
    return (
      <div className="App">
        <p>{this.state.quotes}</p>
      </div>
    );
  }

  getData() {
    $.ajax({
      url: 'https://en.wikiquote.org/w/api.php',
      dataType: 'jsonp',
      data: {
        action: 'query',
        generator: 'search',
        utf8: '1',
        format: 'json',
        gsrsearch: 'Einstein',
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
      }.bind(this),

      error: function(xhr, status, err) {
        console.log(err);
      }
    })
  }

  componentWillMount() {
    this.setState();
    this.getData();
  }

  componentDidMount() {
    this.getData();
  }
}

export default App;
