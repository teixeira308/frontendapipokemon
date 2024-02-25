import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Modal.css";

function Modal({
  isOpen,
  onClose,
  pokemon,
  handleDeletePokemon,
  setPokemonList,
  pokemonList,
  updatePokemon,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPokemon, setEditedPokemon] = useState({
    name: "",
    nationalId: "",
    firstAttribute: "",
    secondAttribute: "",
    megaEvolution: "",
  });

  const convertToBR = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  };

  useEffect(() => {
    setEditedPokemon({ ...pokemon });
  }, [pokemon]);

  const handleDelete = async () => {
    await handleDeletePokemon(pokemon.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedPokemon({
      ...pokemon, // Mantém os valores originais do Pokémon
      updatedAt: new Date().toISOString() // Define a data de atualização como a data atual
    });
  };

  const handleSubmitEdit = async () => {
    try {
      await axios.put(
        `http://localhost:8000/pokemon/${pokemon.id}`,
        editedPokemon
      );
      setIsEditing(false);
      // Atualiza os detalhes do Pokémon no estado local pokemonList
      const updatedPokemonList = pokemonList.map((p) =>
        p.id === pokemon.id ? { ...p, ...editedPokemon } : p
      );
      setPokemonList(updatedPokemonList);
      updatePokemon(editedPokemon);
    } catch (error) {
      console.error("Erro ao editar Pokémon:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content large-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{pokemon.name}</h2>
        <p>ID: {pokemon.id}</p>
        {isEditing ? (
          <div className="edit-form">
            <label>Nome: </label>
            <br />
            <input
              type="text"
              value={editedPokemon.name}
              onChange={(e) =>
                setEditedPokemon({ ...editedPokemon, name: e.target.value })
              }
            />
            <br />
            <label>National ID: </label>
            <br />
            <input
              type="text"
              value={editedPokemon.nationalId}
              onChange={(e) =>
                setEditedPokemon({
                  ...editedPokemon,
                  nationalId: e.target.value,
                })
              }
            />{" "}
            <br />
            <label>firstAttribute: </label>
            <br />
            <input
              type="text"
              value={editedPokemon.firstAttribute}
              onChange={(e) =>
                setEditedPokemon({
                  ...editedPokemon,
                  firstAttribute: e.target.value,
                })
              }
            />{" "}
            <br />
            <label>secondAttribute: </label>
            <br />
            <input
              type="text"
              value={editedPokemon.secondAttribute}
              onChange={(e) =>
                setEditedPokemon({
                  ...editedPokemon,
                  secondAttribute: e.target.value,
                })
              }
            />{" "}
            <br />
            <label>megaEvolution: </label>
            <br />
            <input
              type="text"
              value={editedPokemon.megaEvolution}
              onChange={(e) =>
                setEditedPokemon({
                  ...editedPokemon,
                  megaEvolution: e.target.value,
                })
              }
            />
            <br />
            <button onClick={handleSubmitEdit}>Salvar</button>
            <button onClick={handleCancelEdit}>Cancelar</button>
          </div>
        ) : (
          <>
            <p>national ID: {pokemon.nationalId}</p>
            <p>firstAttribute: {pokemon.firstAttribute}</p>
            <p>secondAttribute: {pokemon.secondAttribute}</p>
            <p>megaEvolution: {pokemon.megaEvolution}</p>
          </>
        )}
        <p className="small-text">
          Criado em: {convertToBR(pokemon.createdAt)}
        </p>
        <p className="small-text">
          Atualizado em: {convertToBR(pokemon.updatedAt)}
        </p>
        <center>
          <button onClick={handleEdit} disabled={isEditing}>
            Editar
          </button>
          {"   "}
          <button onClick={handleDelete} disabled={isEditing}>
            Excluir
          </button>
          {"   "}
          <button onClick={onClose} disabled={isEditing}>
            Fechar
          </button>
        </center>
      </div>
    </div>
  );
}

export default Modal;
