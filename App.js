import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';

class App extends Component {
  constructor() {
    super();
    this.state = {
    pageTitle: 'Home',
    anger: 0,
    joy: 0,
    fear: 0,
    sadness: 0,
    surprise: 0,
    quoteType: "",
    quote: ""
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
      <p></p>

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

  getEmote(data, callback) {
    $.post(
      'https://apiv2.indico.io/emotion/batch',
    JSON.stringify({
        'api_key': "601a9a72cc56692d1f388c608fa955b8",
        'data': data
      })

    ).then(function(res) {
      console.log(typeof res);
      callback(JSON.parse(res));
    });
  }

  // to calculate average emotions for compilation of quotes
 calcEmote(data, arr) {
   var a = 0;
   var aMax = 0;
   var aIndex = 0;

   var b = 0;
   var bMax = 0;
   var bIndex = 0;

   var c = 0;
   var cMax = 0;
   var cIndex = 0;

   var d = 0;
   var dMax = 0;
   var dIndex = 0;

   var e = 0;
   var eMax = 0;
   var eIndex = 0;

   for (var x = 0; x < data.length; x++) {
     a += data[x].anger;
     b += data[x].joy;
     c += data[x].fear;
     d += data[x].sadness;
     e += data[x].surprise;

     if (aMax < data[x].anger) {
       aMax = data[x].anger;
       aIndex = x;
     }

     if (bMax < data[x].joy) {
      bMax = data[x].joy;
      bIndex = x;
    }

    if (cMax < data[x].fear) {
      cMax = data[x].fear;
      cIndex = x;
    }

    if (dMax < data[x].sadness) {
      dMax = data[x].sadness;
      dIndex = x;
    }

    if (eMax < data[x].surprise) {
      eMax = data[x].surprise;
      eIndex = x;
    }
   }

    a = a / data.length;
    b = b / data.length;
    c = c / data.length;
    d = d / data.length;
    e = e / data.length;
    console.log(a);
    this.setState({anger: a});
     this.setState({joy: b});
     this.setState({fear: c});
     this.setState({sadness: d});
    this.setState({surprise: e});
    console.log(this.state);

    if (a === Math.max(a, b, c, d, e)) {
      this.setState({quoteType: "angry"});
      this.setState({quote: arr[aIndex]});
    }
    else if (b === Math.max(a, b, c, d, e)) {
      this.setState({quoteType: "joy"});
      this.setState({quote: arr[bIndex]});
    }
    else if (c === Math.max(a, b, c, d, e)) {
      this.setState({quoteType: "fear"});
      this.setState({quote: arr[cIndex]});
    }
    else if (d === Math.max(a, b, c, d, e)) {
      this.setState({quoteType: "sadness"});
      this.setState({quote: arr[dIndex]});
    }
    else {
      this.setState({quoteType: "surprise"});
      this.setState({quote: arr[eIndex]});
    }

    console.log(this.state.quoteType);
    console.log(this.state.quote);

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
         var emotions = this.getEmote(arr, function(dataset){
           this.calcEmote(dataset.results, arr);
         }.bind(this));
       }
       }.bind(this));
    } }.bind(this), searchItem);

   }


}

export default App;
