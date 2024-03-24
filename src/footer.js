import React from 'react';

const Footer = ({ onSearch, onAddTask, onDateChange, onQuickSearch, isModalOpen }) => {
  return (
      <footer>
          <input type="text" placeholder="Recherche rapide..." onChange={onQuickSearch}/>
          {isModalOpen && (
            <>
              <input type="text" placeholder="Entre la tache a cree..." onChange={onSearch}/>
              <input type="date" onChange={onDateChange}/>
            </>
          )}
          <button onClick={onAddTask}>Ajouter une tâche</button>
      </footer>
  );
};

export default Footer;