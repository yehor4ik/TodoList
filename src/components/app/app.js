import React, { Component } from 'react';


import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list/todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';

import "./app.css";

export default class App extends Component {

  maxId = 228;

  state = {
    todoData: [
      this.createTodoItem('Get Up at 7'),
      this.createTodoItem('Brush your teeth'),
      this.createTodoItem('Have a lunch'),
    ],
    term: '',
    filter: 'all'
  };



  createTodoItem(label) {
    return {
      label,
      important: false,
      done: false,
      id: this.maxId++
    }
  }

  deletedItem = (id) => {
    this.setState(({ todoData }) => {

      const _id = todoData.findIndex((el) => el.id === id)

      const newArray = [
        ...todoData.slice(0, _id),
        ...todoData.slice(_id + 1)
      ];

      return {
        todoData: newArray
      }

    });
  }

  addItem = (text) => {
    if(text.length === 0) return alert('Are you Fadey? Why is there no casa in your input field that you have to do? Write the thing you have')
    const newItem = this.createTodoItem(text);

    this.setState(({ todoData }) => {

      const newArr = [
        ...todoData,
        newItem
      ];

      return {
        todoData: newArr
      };

    })

  };

  toggleProperty(arr, id, propName) {
    
    const _id = arr.findIndex((el) => el.id === id);

    const oldItem = arr[_id];
    const newItem = { ...oldItem, [propName]: !oldItem[propName] };

    return [
      ...arr.slice(0, _id),
      newItem,
      ...arr.slice(_id + 1)
    ];
  }

  onToggleDone = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'done'),
      };
    })
  };

  onToggleImportant = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'important'),
      };
    })
  };

  search( items, term ) {
    if (term.length === 0) {
      return items;
    }
    return items.filter((item) => {
      return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;
    });
  }

  onSearchChange = (term) => {
    this.setState({ term });
  };

  filter(items, filter) {

    switch(filter) {
      case 'all':
        return items;
      case 'active':
        return items.filter((item) => !item.done);
      case 'done':
        return items.filter((item) => item.done);
      default:
        return items;
    }

  }

  onFilterChange = (filter) => {
    this.setState({ filter });
  };



  render() {

    const { todoData, term, filter } = this.state;

    const visibleItems = this.filter(this.search(todoData, term), filter);
    const doneCount = todoData.filter((el) => el.done).length;

    const todoCount = todoData.length - doneCount;

    return (
      <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount} />
        <div className="top-panel d-flex">
          <SearchPanel 
            onSearchChange={this.onSearchChange}/>
          <ItemStatusFilter 
            filter={filter} 
            onFilterChange={this.onFilterChange} />
        </div>

        <TodoList
          todos={visibleItems}
          onDeleted={this.deletedItem}
          onToggleImportant={this.onToggleImportant}
          onToggleDone={this.onToggleDone} />

        <ItemAddForm
          addItem={this.addItem} />
      </div>
    );
  };
};