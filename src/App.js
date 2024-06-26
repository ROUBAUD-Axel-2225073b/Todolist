import React from "react";
import Modal from 'react-modal';
import Header from './header';
import Footer from './footer';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonalIcon from '@mui/icons-material/Person';


Modal.setAppElement('#root');

const categoryIcons = {
  Home: <HomeIcon />,
  Work: <WorkIcon />,
  School: <SchoolIcon />,
  Personal: <PersonalIcon />,
};

class App extends React.Component {
constructor(props) {
  super(props);
  const savedItems = localStorage.getItem('items');
  const items = savedItems
      ? JSON.parse(savedItems).map(item => ({...item, date: new Date(item.date)}))
      : [];
  this.state = {
    items: items,
    filter: "all",
    newItemText: "",
    newItemDate: new Date(),
    newItemCategory: "",
    searchText: "",
    isModalOpen: false,
  };

  this.handleToggleDone = this.handleToggleDone.bind(this);
  this.handleMoveUp = this.handleMoveUp.bind(this);
  this.handleMoveDown = this.handleMoveDown.bind(this);
  this.handleAddItem = this.handleAddItem.bind(this);
  this.handleConfirmAddItem = this.handleConfirmAddItem.bind(this);
  this.handleEditItem = this.handleEditItem.bind(this);
  this.handleDeleteItem = this.handleDeleteItem.bind(this);
  this.handleFilterChange = this.handleFilterChange.bind(this);
  this.handleNewItemChange = this.handleNewItemChange.bind(this);
  this.handleNewItemDateChange = this.handleNewItemDateChange.bind(this);
  this.handleSearch = this.handleSearch.bind(this);
  this.handleQuickSearch = this.handleQuickSearch.bind(this);
  this.handleCategoryFilterChange = this.handleCategoryFilterChange.bind(this);
  this.handleNewItemCategoryChange = this.handleNewItemCategoryChange.bind(this);
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
    this.setState({isModalOpen: true});
  };

  handleConfirmAddItem = () => {
    const {newItemText, newItemDate, newItemCategory} = this.state;
    console.log("Reading category from state: ", newItemCategory); // Add this line
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

  handleCategoryFilterChange = (event) => {
    this.setState({categoryFilter: event.target.value});
  };

  handleNewItemCategoryChange = (event) => {
    const category = event.target.value;
    if (category) {
      this.setState({newItemCategory: category}, () => {
        console.log("Updated category in state: ", this.state.newItemCategory);
      });
    }
  };

  componentDidMount() {
    const confirmation = window.confirm("Voulez-vous charger les tâches de la session précédente ?");
    if (confirmation) {
      const savedItems = localStorage.getItem('items');
      const items = savedItems
          ? JSON.parse(savedItems).map(item => ({...item, date: new Date(item.date)}))
          : [];
      this.setState({items: items});
    } else {
      this.setState({items: []});
    }
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      this.setState({isModalOpen: false});
    }
  };

  handleSaveTasks = () => {
    localStorage.setItem('items', JSON.stringify(this.state.items));
  };


  render() {
    const {items, filter, newItemCategory, searchText, isModalOpen, categoryFilter} = this.state;

    const filteredTasks = items.filter(item => {
      const matchesSearchText = item.text.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
      if (filter === "all") {
        return matchesSearchText && matchesCategory;
      } else if (filter === "todo") {
        return !item.done && matchesSearchText && matchesCategory;
      } else {
        return item.done && matchesSearchText && matchesCategory;
      }
    });

    const remainingTasks = items.filter(item => !item.done).length;

    return (
        <div className="task-container">
          <Header totalTasks={items.length} remainingTasks={remainingTasks}/>
          <div className="button-container">
            <button onClick={() => this.handleFilterChange("all")}>All</button>
            <button onClick={() => this.handleFilterChange("todo")}>To Do</button>
            <button onClick={() => this.handleFilterChange("done")}>Done</button>

          <select onChange={this.handleCategoryFilterChange}>
        <option value="">Toutes les catégories</option>
        <option value="Work">Travail</option>
        <option value="Home">Maison</option>
        <option value="School">Ecole</option>
        <option value="Personal">Personnel</option>
      </select>
          </div>
          <ol className="task-list">
            {filteredTasks.map((item, index) => (
                <li key={item.id}>
                  {index !== 0 && <button className="move-button" onClick={() => this.handleMoveUp(item.id)}>↑</button>}
                  {index !== filteredTasks.length - 1 && <button className="move-button" onClick={() => this.handleMoveDown(item.id)}>↓</button>}
                  <label>
                    <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => this.handleToggleDone(item.id)}
                    />
                    <span className={item.done ? "done" : ""}>{item.text} </span>
                    <span>({item.date.toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })})</span>
                    {categoryIcons[item.category]}
                  </label>
                  <button className="edit-button" onClick={() => this.handleEditItem(item.id)}><EditIcon/></button>
                  <button className="delete-button" onClick={() => this.handleDeleteItem(item.id)}><DeleteIcon/></button>
                </li>
            ))}
          </ol>
          <Footer onSearch={this.handleSearch} onQuickSearch={this.handleQuickSearch} onAddTask={this.handleAddItem}
                  onDateChange={this.handleNewItemDateChange} onSaveTasks={this.handleSaveTasks}
                  isModalOpen={isModalOpen}/>
          <Modal isOpen={isModalOpen}>
            <button className="close-button" onClick={() => this.setState({isModalOpen: false})}>X</button>
            <input className="popup-text-input" type="text" placeholder="Entre la tache a cree..."
                   onChange={this.handleNewItemChange}/>
            <input className="popup-date-input" type="date" onChange={this.handleNewItemDateChange}/>
            <select className="popup-select" onChange={this.handleNewItemCategoryChange} value={newItemCategory}>
              <option value="">Select a category</option>
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="School">School</option>
              <option value="Personal">Personnel</option>
            </select>
            <button className="confirm-add-button" onClick={this.handleConfirmAddItem}>Confirmer l'ajout</button>
          </Modal>
        </div>
    );
  }

}
export default App;