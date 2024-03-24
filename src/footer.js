import React from 'react';

const Footer = ({ onSearch, onAddTask, onDateChange, onQuickSearch, onSaveTasks, isModalOpen }) => {
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
          <button onClick={onSaveTasks}>Sauvegarder les tâches</button> {/* Add this line */}
      </footer>
  );
};
export default Footer;