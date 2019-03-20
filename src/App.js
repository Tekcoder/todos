import React, { Component } from 'react';
import './App.scss';

const apiQuery = (endpoint, query) => {
  const queryString = Object.entries(query)
    .reduce(
      (acc, entry) => acc.concat(`${entry[0]}=${entry[1]}&`),
      `http://useo-notes.herokuapp.com/${endpoint}?`,
    )
    .slice(0, -1);
  return queryString
}

class App extends Component {
  state = {
    newNote: {
      note: '',
      date: '',
    },
    notes: [],
    page: 1,
    total_pages: 0,
  }
  getNotes = (page = 1) => {
    ;
    fetch(apiQuery('notes', { page })).then(
      response => response.json()
    ).then(data => {
      const { page, notes, total_pages } = data;
      this.setState({
        page,
        notes: this.state.notes.concat(notes),
        total_pages
      })
    })
  }
  componentDidMount() {
    this.getNotes();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.page !== this.state.total_pages) {
      const page = prevState.page + 1;
      this.getNotes(page);
    }
  };
  render() {
    return (
      <div className="App">
        <nav> <span>useo</span> </nav>
        <main>
          <header className="App-header">
            My Todo List
        </header>
          <table>
            <tr>
              <th colSpan="3"><input type="checkbox" /></th>
              <th>
                <button><i class="fas fa-check"></i></button>
                <button><i class="fas fa-trash-alt"></i></button>
              </th>
            </tr>
            <tr>
              <th> </th>
              <th><input onChange={(event) => this.setState({ newNote: {...this.state.newNote, note: event.target.value }, })} className="new-task" size='' placeholder="Add another task"></input></th>
              <th><i class="far fa-calendar-alt"></i></th>
              <th><button><i class="fas fa-plus"></i></button></th>
            </tr>
            {this.state.notes.map(note => (
              <tr className={note.completed && "completed"}>
                <td><input type="checkbox" /></td>
                <td>{note.content}</td>
                <td>{note.deadline}</td>
                <td><button><i class="fas fa-check"></i>
                </button>
                  <button><i class="fas fa-trash-alt"></i></button>
                </td>
              </tr>
            ))}
          </table>
        </main>
        <footer> <span>useo</span> <span>f</span> </footer>
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