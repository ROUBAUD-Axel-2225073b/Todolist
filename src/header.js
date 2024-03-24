import React from 'react';

const Header = ({ totalTasks, remainingTasks }) => {
  return (
    <header>
      <h1>Todo App</h1>
      <p>{remainingTasks} tâche(s) restante(s) sur {totalTasks}</p>
    </header>
  );
};

export default Header;