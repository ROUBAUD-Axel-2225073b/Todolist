import React from "react";
import Modal from 'react-modal';
import Header from './header';
import Footer from './footer';

class App extends React.Component {
  constructor(props) {
    super(props);
    const savedItems = localStorage.getItem('items');
    const items = savedItems
        ? JSON.parse(savedItems).map(item => ({ ...item, date: new Date(item.date) }))
        : [];
    this.state = {
      items: items,
      filter: "all",
      newItemText: "",
      newItemDate: new Date(),
      searchText: "",
      isModalOpen: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.items !== this.state.items) {
      localStorage.setItem('items', JSON.stringify(this.state.items));
    }
  }

  handleToggleDone = (itemId) => {
    this.setState((prevState) => ({
      items: prevState.items.map((item) =>
          item.id === itemId ? {...item, done: !item.done} : item
      )
    }));
  };

  handleMoveUp = (itemId) => {
    this.setState((prevState) => {
      const {items} = prevState;
      const itemIndex = items.findIndex(item => item.id === itemId);
      if (itemIndex > 0) {
        const newItems = [...items];
        [newItems[itemIndex - 1], newItems[itemIndex]] = [newItems[itemIndex], newItems[itemIndex - 1]];
        return {items: newItems};
      }
    });
  };

  handleMoveDown = (itemId) => {
    this.setState((prevState) => {
      const {items} = prevState;
      const itemIndex = items.findIndex(item => item.id === itemId);
      if (itemIndex < items.length - 1) {
        const newItems = [...items];
        [newItems[itemIndex + 1], newItems[itemIndex]] = [newItems[itemIndex], newItems[itemIndex + 1]];
        return {items: newItems};
      }
    });
  };

  handleAddItem = () => {
    this.setState({ isModalOpen: true });
  };

    handleConfirmAddItem = () => {
      const {newItemText, newItemDate, newItemCategory} = this.state;
      if (newItemText.trim() !== "") {
        const newItem = {
          id: Date.now(),
          text: newItemText,
          date: newItemDate,
          category: newItemCategory,
          done: false
        };
        this.setState((prevState) => ({
          items: [...prevState.items, newItem],
          newItemText: "",
          newItemDate: new Date(),
          newItemCategory: "",
          isModalOpen: false,
        }));
      }
    };

  handleEditItem = (itemId) => {
    const {items} = this.state;
    const itemToEdit = items.find(item => item.id === itemId);
    const updatedText = window.prompt("Edit task:", itemToEdit.text);
    if (updatedText) {
      this.setState((prevState) => ({
        items: prevState.items.map(item =>
            item.id === itemId ? {...item, text: updatedText} : item
        )
      }));
    }
  };

  handleDeleteItem = (itemId) => {
    const confirmation = window.confirm("Etes vous sur de supprimer la tache ?");
    if (confirmation) {
      this.setState((prevState) => ({
        items: prevState.items.filter((item) => item.id !== itemId)
      }));
    }
  };

  handleDeleteAll = () => {
    const confirmation = window.confirm("Etes vous sur de supprimer toutes les taches ?");
    if (confirmation) {
      this.setState({ items: [] });
    }
  };

  handleFilterChange = (filterType) => {
    this.setState({filter: filterType});
  };

  handleNewItemChange = (event) => {
    this.setState({newItemText: event.target.value});
  };

  handleNewItemDateChange = (event) => {
    const dateValue = event.target.value ? new Date(event.target.value) : new Date();
    this.setState({newItemDate: dateValue});
  };

  handleSearch = (event) => {
    this.setState({newItemText: event.target.value});
  };

 handleQuickSearch = (event) => {
  const searchText = event.target.value;
  if (searchText.length >= 3) {
    this.setState({searchText: searchText});
  } else {
    this.setState({searchText: ""});
  }
};

  handleNewItemCategoryChange = (event) => {
  this.setState({newItemCategory: event.target.value});
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      this.setState({ isModalOpen: false });
    }
  };


  render() {
    const { items, filter, newItemText, newItemDate, searchText, isModalOpen } = this.state;

    const filteredTasks = items.filter(item => {
      const matchesSearchText = item.text.toLowerCase().includes(searchText.toLowerCase());
      if (filter === "all") {
        return matchesSearchText;
      } else if (filter === "todo") {
        return !item.done && matchesSearchText;
      } else {
        return item.done && matchesSearchText;
      }
    });

    const remainingTasks = items.filter(item => !item.done).length;

    return (
        <div>
          <Header totalTasks={items.length} remainingTasks={remainingTasks} />
          <div>
            <button onClick={() => this.handleFilterChange("all")}>All</button>
            <button onClick={() => this.handleFilterChange("todo")}>To Do</button>
            <button onClick={() => this.handleFilterChange("done")}>Done</button>
          </div>
          <ol>
            {filteredTasks.map((item, index) => (
                <li key={item.id}>
                  {index !== 0 && <button onClick={() => this.handleMoveUp(item.id)}>↑</button>}
                  {index !== filteredTasks.length - 1 && <button onClick={() => this.handleMoveDown(item.id)}>↓</button>}
                  <label>
                    <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => this.handleToggleDone(item.id)}
                    />
                    <span className={item.done ? "done" : ""}>{item.text} </span>
                    <span>({item.date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})</span>
                  </label>
                  <button onClick={() => this.handleEditItem(item.id)}>Edit</button>
                  <button className="delete-button" onClick={() => this.handleDeleteItem(item.id)}>Delete</button>
                </li>
            ))}
          </ol>
          <Footer onSearch={this.handleSearch} onQuickSearch={this.handleQuickSearch} onAddTask={this.handleAddItem} onDateChange={this.handleNewItemDateChange} isModalOpen={isModalOpen} />
          <Modal isOpen={isModalOpen}>
            <button style={{position: 'absolute', top: 0, left: 0}} onClick={() => this.setState({isModalOpen: false})}>X</button>
            <input type="text" placeholder="Entre la tache a cree..." onChange={this.handleNewItemChange}/>
            <input type="date" onChange={this.handleNewItemDateChange}/>
            <button onClick={this.handleConfirmAddItem}>Confirmer l'ajout</button>
          </Modal>
        </div>
    );
  }
}

export default App;
