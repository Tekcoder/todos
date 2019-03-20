import React, { Component } from 'react';
import DatePicker from 'react-date-picker';
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

const stringIsEmpty = (string) => {
  return !string || !(string.trim());
};

const today = new Date();

class App extends Component {
  state = {
    newNote: {
      content: '',
      deadline: '',
      completed: false,
    },
    date: today,
    notes: [],
    page: 1,
    total_pages: 0,
    input_placeholder: 'Add another task',
  }
  onDateChange = date => this.setState({ date })
  getNotes = (page = 1) => {
    fetch(apiQuery('notes', { page })).then(
      response => response.json()
    ).then(data => {
      const { page, notes, total_pages } = data;
      const newPage = page +1;
      this.setState({
        page: newPage,
        notes: this.state.notes.concat(notes),
        total_pages,
      })
    })
  }
  componentDidMount() {
    this.getNotes();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.page !== this.state.total_pages) {
      this.getNotes(prevState.page + 1);
    }
  };
  postNewTask = () => {
    try {
      const string = this.state.inputField;
      if (stringIsEmpty(string)) throw {
        ErrorType: 'empty-string',
        ErrorText: 'Input string is empty'
      };
      const note = {
        content: this.state.inputField,
        deadline: this.state.date,
        completed: false,
      }
      fetch(apiQuery('notes', {}), {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note }),
      }).then(response => response.json())
        .then(data => this.setState({ notes: this.state.notes.concat(data.note) }));
    } catch (err) {
      this.setState({
        input: '',
        input_placeholder: 'Task cannot be empty',
      })
    }
  }

  onInputChange = (event) => {
    this.setState({ inputField: event.target.value });
  }

  render() {
    return (
      <div className="App">
        <nav> <img className="brand-image"
          src="http://useo.lh.pl/useo_v2/wp-content/uploads/2018/01/useo_logo_light.png" alt="useo brand" /> </nav>
        <main>
          <header className="App-header">
            My Todo List
        </header>
          <table>
            <tbody>
              <tr>
                <th colSpan="3"><input type="checkbox" /></th>
                <th>
                  <button><i className="fas fa-check" /></button>
                  <button><i className="fas fa-trash-alt" /></button>
                </th>
              </tr>
              <tr>
                <th> </th>
                <th><input onChange={(event) => this.onInputChange(event)} className="new-task" size='' placeholder={this.state.input_placeholder}></input></th>
                <th>
                  <DatePicker
                    value={this.state.date}
                    minDate={today}
                    onChange={this.onDateChange} />
                </th>
                <th><button onClick={() => this.postNewTask()}><i className="fas fa-plus" /></button></th>
              </tr>
              {this.state.notes.map(note => (
                <tr className={note.completed ? "completed" : undefined}>
                  <td><input type="checkbox" checked={note.isChecked} /></td>
                  <td>{note.content}</td>
                  <td>{note.deadline}</td>
                  <td><button><i className="fas fa-check" />
                  </button>
                    <button><i className="fas fa-trash-alt" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
        <footer>
          <img className="brand-image" src="http://useo.lh.pl/useo_v2/wp-content/uploads/2018/01/useo_logo_light.png" alt="useo brand" /> <a className="facebook-link" href="http://facebook.com">
            <i className="fab fa-facebook-f" />
          </a> </footer>
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