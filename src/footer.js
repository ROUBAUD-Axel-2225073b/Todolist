import React from 'react';

const Footer = ({ onQuickSearch, onAddTask, onSaveTasks, isModalOpen }) => {
  return (
      <footer>
          <input className="quick-search-input" type="text" placeholder="Recherche rapide..." onChange={onQuickSearch}/>
          <button className="footer-button" onClick={onAddTask}>Ajouter une tâche</button>
          <button className="footer-button" onClick={onSaveTasks}>Sauvegarder les tâches</button>
      </footer>
  );
};
export default Footer;