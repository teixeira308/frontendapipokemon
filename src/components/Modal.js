import React, { useState } from 'react';
import './Modal.css'; // Importe o arquivo CSS para estilização do modal

function Modal({ isOpen, onClose, pokemon }) {
  if (!isOpen) return null; // Retorna null se o modal não estiver aberto

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{pokemon.name}</h2>
        <p>ID: {pokemon.id}</p>
        <p>firstAttribute: {pokemon.firstAttribute}</p>
        <p>secondAttribute: {pokemon.secondAttribute}</p>
        <p>megaEvolution: {pokemon.megaEvolution}</p>
        <p>Criado em: {pokemon.createdAt}</p>
        <p>Atualizado em: {pokemon.updatedAt}</p>
        {/* Adicione mais detalhes do Pokémon conforme necessário */}
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

export default Modal;
