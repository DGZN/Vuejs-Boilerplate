'use strict';

const fs = require('fs');
const xml2js = require('xml2js');

class xmlParser {

  constructor () {
    this.parser = new xml2js.Parser();
  }

  parse (path) {
    var self = this;
    fs.readFile(path, function(err, data) {
        self.parser.parseString(data, function (err, result) {
            self.extract(result)
        });
    });
  }

  extract (data) {
    var data = data.package;
    var video = data.video[0];
    var payload = {
      title: video.title[0],
      guid: titleToGuid(video.title[0], video.theatrical_release_date[0]),
      type: 'film',
      runtime: 634,
      description: video.synopsis[0],
      releaseDate: video.theatrical_release_date[0],
      distributor: video.production_company[0],
      expiryDate: '2021-01',
      language: video.original_spoken_locale[0],
      orderPriority: 1,
      starRating: 5,
      subtitles: 'no',
      source: 'VOD',
      drm: 'no',
      quality: 'hd',
      countryDisallowList: [],
      moods: [],
      ratings: parseRatings(video.ratings),
      tags: {
        subscriberType: 'free',
        categoryTitle: categoryTitle(video.genres)
      },
      genres: parseGenres(video.genres),
      cast: parseCast(video.cast),
      crew: parseCrew(video.crew),
      videos: [{
        target: 'hls',
        url: ''
      }],
      images: []
    }
    console.log(require('util').inspect({
      msg: 'Extracting from JSON',
      data: payload
    }, { depth: null }));
  }

}

function titleToGuid(title, date){
  return title.toString().toLowerCase().replace(/\W/g,'-') + '-' + date;
}

function parseRatings(ratings){
  var ratings = ratings[0].rating;
  return {
    "name": ratings[0].$.system,
    "code": ratings[0].$.code,
    "country": "US"
  }
}

function categoryTitle(genres){
  var genres = genres[0].genre;
  return genres[0].$.code;
}

function parseGenres(genres){
  var genres = genres[0].genre;
  var _genres = [];
  for (var i in genres) {
    _genres.push(genres[i].$.code)
  }
  return _genres;
}

function parseCast(cast){
  var cast = cast[0].cast_member;
  var members = [];
  for (var i in cast) {
    var person = cast[i];
    members.push({
      name: person.display_name[0],
      character: person.characters[0].character[0].character_name[0]
    })
  }
  return members;
}

function parseCrew(crew){
  var crew = crew[0].crew_member;
  var members = [];
  for (var i in crew) {
    var person = crew[i];
    members.push({
      name: person.display_name[0],
      roles: person.roles[0].role
    })
  }
  return members;
}


var parser = new xmlParser()
parser.parse(__dirname + '/metadata.xml')
