/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React from 'react';
import DatePicker from 'react-date-picker';
import uuidv4 from 'uuid/v4';

const today = new Date();

const TaskTable = (props) => {
  const {
    onInputChange, inputPlaceholder, date, onDateChange, postNewTask, notes, toggleComplete, onDelete, checked, toggleChecked, checkAll, deleteChecked, completeChecked
  } = props;

  return (
    <table>
      <tbody>
        <tr>
          <th colSpan="3"><input type="checkbox" checked={checked.master} onClick={() => checkAll()} /></th>
          <th>
            <button type="submit" onClick={() => completeChecked()}><i className="fas fa-check" /></button>
            <button type="submit" onClick={() => deleteChecked()}><i className="fas fa-trash-alt" /></button>
          </th>
        </tr>
        <tr>
          <td />
          <td><input onChange={event => onInputChange(event)} className="new-task" size="" placeholder={inputPlaceholder} /></td>
          <td>
            <DatePicker
              value={date}
              minDate={today}
              onChange={onDateChange}
            />
          </td>
          <td><button type="submit" onClick={() => postNewTask()}><i className="fas fa-plus" /></button></td>
        </tr>
        {notes.map(note => (
          <tr key={uuidv4()} className={note.completed ? 'completed' : undefined}>
            <td><input type="checkbox" checked={checked[note.id]} onClick={event => toggleChecked(note.id)} /></td>
            <td>{note.content}</td>
            <td className="deadline">{note.deadline}</td>
            <td>
              <button type="submit" onClick={() => toggleComplete(note)}>
                <i className="fas fa-check" />
              </button>
              <button type="submit" onClick={() => onDelete(note.id)}><i className="fas fa-trash-alt" /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaskTable;
