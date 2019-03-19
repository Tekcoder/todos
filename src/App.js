import React, { Component } from 'react';
import './App.scss';

class App extends Component {
  state = {
    things: ['something', 'somethingElse or other', 'orSomethingverydifferent'],
    data: [],
  }
  componentDidMount() {
    fetch(`http://useo-notes.herokuapp.com/notes`).then(response => response.json()).then(data => this.setState({ data }));
  }
  render() {
    const { data } = this.state;
    return (
      <div className="App">
        <nav> <span>useo</span> </nav>
        <header className="App-header">
          {data ? <div>We've got the data</div> : <div>'Hi'</div>}
        </header>
        <footer> </footer>
      </div>
    );
  }
}

export default App;


// Adres główny serwisu: http://useo-notes.herokuapp.com/

// Index (gets all notes: 5 per page):
// url: “/notes”
// additional param “page” - for example: “/notes?page=2”
// json response:
// { page: 1, total_pages: 2, total_count: 7, notes: [...] }
// Show (gets only one note):
// url : “/notes/:id”
// example: “/notes/2”
// json response:
// { note: {...} }
// Create:
// url: “/notes”
// type: “POST”
// required data: { note: { content: ‘...’ } }
// (“content” attribute cannot be blank, otherwise it returns json { success: false, errors:
// [...] } or status 400 for the request if the param “note” is completely missing). Object
// “errors” is an array of errors related to the “note”.
// json response:
// { success: true, note: {...} }
// Destroy:
// url: “/notes/:id”
// example: “/notes/2”
// type: “DELETE”json response:
// { success: true }
// Completed (marks “note” as “completed” - field in the DB will change form “false”
// to “true”):
// url: “/notes/:id/completed”
// example: “/notes/11/completed”
// type: “PUT”
// json response:
// { success: true }
// Uncompleted (marks “note” as “not completed” - field in the DB will change form
// “true” to “false”):
// url: “/notes/:id/uncompleted”
// example: “/notes/11/uncompleted”
// type: “PUT”
// json response:
// { success: true }