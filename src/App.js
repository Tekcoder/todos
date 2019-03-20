import React, { Component } from 'react';
import TaskTable from './components/TaskTable';
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
    checked: { master: false },
    date: today,
    notes: [],
    page: 1,
    total_pages: 0,
    master_switch: false,
    input_placeholder: 'Add another task',
  }
  onDateChange = date => this.setState({ date })
  getNotes = (currentPage = 1) => {
    fetch(apiQuery('notes', { page: currentPage })).then(
      response => response.json()
    ).then(data => {
      const { page, notes, total_pages } = data;
      const newPage = page + 1;
      this.setState({
        page: newPage,
        notes: this.state.notes.concat(notes),
        total_pages,
      })
    })
  }

  // Completed (marks “note” as “completed” - field in the DB will change form “false”
  // to “true”):
  // url: “/notes/:id/completed”
  // example: “/notes/11/completed”
  // type: “PUT”
  // json response:
  // { success: true }

  toggleComplete = (note) => {
    const toggleQuery = note.completed ? 'uncompleted' : 'completed';
    fetch(`http://useo-notes.herokuapp.com/notes/${note.id}/${toggleQuery}`, {
      method: 'PUT',
    }).then(response => response.json()).then(data => {
      if (data.success) {
        const newNotes = this.state.notes.map(oldNote => {
          if (oldNote.id === note.id) return { ...oldNote, completed: !oldNote.completed }
          return { ...oldNote }
        })
        this.setState({ notes: newNotes })
      } else {
        throw new Error('Something bad happened while trying to toggle completion.')
      }
    })
  }
  // Destroy:
  // url: “/notes/:id”
  // example: “/notes/2”
  // type: “DELETE”json response:
  // { success: true }

  onDelete = (noteId) => {
    fetch(`http://useo-notes.herokuapp.com/notes/${noteId}`, { method: 'DELETE' }).then(response => {
      if (response.status === 200) return response.json();
      else throw new Error('Something happened while deleting. Try refreshing the page');
    }).then(data => {
      if (data && data.success) {
        this.setState({ notes: this.state.notes.filter(oldNote => oldNote.id !== noteId) })
      } else {
        throw new Error('Something went bad while deleting the task. Try refreshing the page');
      }
    })
  }
  checkAll = () => {
    const masterState = this.state.checked.master;
    const allChecked = { master: !masterState }
    if (!masterState) {
      this.state.notes.map(note => allChecked[note.id] = !masterState);
      this.setState({ checked: allChecked })
    } else {
      this.setState({ checked: { master: false } });
    }
  }
  toggleChecked = (noteId) => {
    const checked = { ...this.state.checked };
    if (checked[noteId] === true) {
      delete checked[noteId];
      this.setState({ checked })
    } else if (!checked.hasOwnProperty(noteId) || checked[noteId] === false) {
      checked[noteId] = true;
      this.setState({ checked })
    }
  }
  deleteChecked = () => {
    const { master, ...notes } = this.state.checked;
    const idsOfChecked = Object.keys(notes);
    if (idsOfChecked.length) {
      const urlMapped = idsOfChecked.map(note => `http://useo-notes.herokuapp.com/notes/${note}`)
      Promise.all(urlMapped.map(url =>
        fetch(url, { method: 'DELETE' })
          .then(response => {
            if (response.status === 200) return response.json()
            else throw new Error('Something happened while checking all of the things. Please reload the page');
          })
      ))
        .then(() => {
          this.setState({ page: 0, notes: [] })
          this.getNotes(1)
        });
    }

  }
  completeChecked = () => {
    const { master, ...notes } = this.state.checked;
    const idsOfChecked = Object.keys(notes);
    if (idsOfChecked.length) {
      const urlMapped = idsOfChecked.map(note => `http://useo-notes.herokuapp.com/notes/${note}/completed`)
      Promise.all(urlMapped.map(url =>
        fetch(url, { method: 'PUT' })
          .then(response => {
            if (response.status === 200) return response.json()
            else throw new Error('Something happened while checking all of the things. Please reload the page');
          })
      ))
        .then(() => {
          this.setState({ page: 0, notes: [] })
          this.getNotes(1)
        });
    }
  }
  componentDidMount() {
    this.getNotes();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.page <= this.state.total_pages) {
      this.getNotes(this.state.page);
    }
  };
  postNewTask = () => {
    try {
      const string = this.state.inputField;
      if (stringIsEmpty(string)) throw new Error('Input string is empty')
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
    const { onInputChange, state, onDateChange, postNewTask, toggleComplete, onDelete, toggleChecked, checkAll, completeChecked, deleteChecked } = this;
    const { checked, date, notes, input_placeholder, master_switch } = state;
    return (
      <div className="App">
        <nav> <img className="brand-image"
          src="http://useo.lh.pl/useo_v2/wp-content/uploads/2018/01/useo_logo_light.png" alt="useo brand" /> </nav>
        <main>
          <header className="App-header">
            My Todo List
          </header>
          <TaskTable
            onInputChange={onInputChange}
            inputPlaceholder={input_placeholder}
            date={date} onDateChange={onDateChange}
            postNewTask={postNewTask}
            notes={notes}
            toggleComplete={toggleComplete}
            onDelete={onDelete}
            checked={checked}
            toggleChecked={toggleChecked}
            master_switch={master_switch}
            completeChecked={completeChecked}
            deleteChecked={deleteChecked}
            checkAll={checkAll} />
        </main>
        <footer>
          <img className="brand-image" src="http://useo.lh.pl/useo_v2/wp-content/uploads/2018/01/useo_logo_light.png" alt="useo brand" /> <a className="facebook-link" href="http://facebook.com">
            <i className="fab fa-facebook-f" />
          </a>
        </footer>
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


