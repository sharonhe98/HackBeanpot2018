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
    beginning: '',
    quoteType: "",
    quote: "",
    quoteTypeTwo: "",
    quoteTwo: "",

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
      <h2>Most relevant result: {this.state.pageTitle}</h2>
      <form onSubmit={this.handleSubmit.bind(this)}>
          <div>
              <label>Search</label><br />
              <input type="text" placeholder="search" ref="search" />
          </div>
          <input type="submit" value="Search" />
      </form>
    </div>
      <p>{this.state.beginning}</p>

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
      callback(JSON.parse(res));
    });
  }

  // to calculate average emotions for compilation of quotes
  calcEmote(data, arr) {
    var a = 0;
    var aMax = 0;
    var aMaxTwo = 0;
    var aIndex = 0;
    var aIndexTwo = 0;

    var b = 0;
    var bMax = 0;
    var bMaxTwo = 0;
    var bIndex = 0;
    var bIndexTwo = 0;

    var c = 0;
    var cMax = 0;
    var cMaxTwo = 0;
    var cIndex = 0;
    var cIndexTwo = 0;

    var d = 0;
    var dMax = 0;
    var dMaxTwo = 0;
    var dIndex = 0;
    var dIndexTwo = 0;

    var e = 0;
    var eMax = 0;
    var eMaxTwo = 0;
    var eIndex = 0;
    var eIndexTwo = 0;

    for (var x = 0; x < data.length; x++) {
      a += data[x].anger;
      b += data[x].joy;
      c += data[x].fear;
      d += data[x].sadness;
      e += data[x].surprise;

      if (data[aIndex].anger < data[x].anger) {
        aMaxTwo = aMax;
        aMax = data[x].anger;
        aIndexTwo = aIndex;
        aIndex = x;
      }

      if (bMax < data[x].joy) {
        bMaxTwo = bMax;
        bMax = data[x].anger;
        bIndexTwo = bIndex;
        bIndex = x;
     }

     if (cMax < data[x].fear) {
       cMaxTwo = cMax;
       cMax = data[x].anger;
       cIndexTwo = cIndex;
       cIndex = x;
     }

     if (dMax < data[x].sadness) {
       dMaxTwo = dMax;
       dMax = data[x].anger;
       dIndexTwo = dIndex;
       dIndex = x;
     }

     if (eMax < data[x].surprise) {
       eMaxTwo = eMax;
       eMax = data[x].anger;
       eIndexTwo = eIndex;
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

     var nums = [a, b, c, d, e];
     nums = nums.sort();
     var max = nums[4];
     if (max === a) {
       this.setState({quoteType: "angry"});
       this.setState({quote: arr[aIndex]});
     } else if (max === b) {
       this.setState({quoteType: "joy"});
       this.setState({quote: arr[bIndex]});
     } else if (max === c) {
       this.setState({quoteType: "fear"});
       this.setState({quote: arr[cIndex]});
     } else if (max === d) {
       this.setState({quoteType: "sadness"});
       this.setState({quote: arr[dIndex]});
     } else {
       this.setState({quoteType: "surprise"});
       this.setState({quote: arr[eIndex]});
     }
     var twoMax = nums[3];
     if (twoMax === a) {
       this.setState({quoteTypeTwo: "angry"});
       this.setState({quoteTwo: arr[aIndexTwo]});
     } else if (twoMax === b) {
       this.setState({quoteTypeTwo: "joy"});
       this.setState({quoteTwo: arr[bIndexTwo]});
     } else if (twoMax === c) {
       this.setState({quoteTypeTwo: "fear"});
       this.setState({quoteTwo: arr[cIndexTwo]});
     } else if (twoMax === d) {
       this.setState({quoteTypeTwo: "sadness"});
       this.setState({quoteTwo: arr[dIndexTwo]});
     } else {
       this.setState({quoteTypeTwo: "surprise"});
       this.setState({quoteTwo: arr[eIndexTwo]});
     }
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
       this.setState({pageTitle: tle});
       this.setState({isBadSearch: false});
       this.getData(pageId, function(revisions) {
         var thing = revisions.query.pages[0].revisions[0].content;
         var begre = /.*\=/;
         var endidx = thing.match(begre).index;
         console.log(endidx);
         var begin = thing.substring(0, endidx);
         var cleanreg1 = /\[|\]|{{.*}}|w:[^\|]*\||<.*>/;
           var splitarr = begin.split(cleanreg1);
           console.log(splitarr);
           begin = splitarr.join(' ');
         this.setState({beginning: begin});
         console.log(this.state.beginning);
         console.log(thing);
         var arr = this.parseString(thing.substring(endidx));
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
