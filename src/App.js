


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { AiOutlineHome, AiOutlineBulb, AiOutlineBook, AiOutlineMail } from 'react-icons/ai';
import Modal from './components/Modal'; // Importe o componente Modal

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pokemonList, setPokemonList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState('cards'); // Estado para controlar o modo de visualização


  const [selectedPokemon, setSelectedPokemon] = useState(null); // Estado para armazenar o Pokémon selecionado

  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a abertura e fechamento do modal

  // Função para buscar a lista de Pokémon
  const fetchPokemonList = async (page, pageSize) => {
    try {
      const response = await axios.get(`http://localhost:8000/pokemon?page=${page}&pageSize=${pageSize}`);
      setPokemonList(response.data);
      setCurrentPage(page);
      setTotalPages(Math.ceil(response.headers['x-total-count'] / pageSize));
    } catch (error) {
      console.error('Erro ao obter a lista de Pokémon:', error);
    }
  };

  // Efeito para buscar a lista de Pokémon ao alterar o tamanho da página
  useEffect(() => {
    fetchPokemonList(1, pageSize);
  }, [pageSize]);


  // Componente para renderizar um Pokémon como card
  const PokemonCard = ({ pokemon }) => (
    <div className="card" key={pokemon.id}>
      <div className="id">ID: {pokemon.id}</div>
      <div className="name">{pokemon.name}</div>
      <div className="createdAt">Data de Criação: {pokemon.createdAt}</div>
      <div className="createdAt">Data de Atualização: {pokemon.updatedAt}</div>
      <button onClick={() => handleDeletePokemon(pokemon.id)}>Excluir</button>
      <button onClick={() => handleOpenModal(pokemon)}>Ver Detalhes</button>
    </div>
  );

  // Componente para renderizar um Pokémon como item em uma lista
  const PokemonTableRow = ({ pokemon }) => (
    <tr key={pokemon.id}>
      <td>{pokemon.id}</td>
      <td>{pokemon.name}</td>
      <td>{pokemon.createdAt}</td>
      <td>{pokemon.updatedAt}</td>
      <td> <button onClick={() => handleDeletePokemon(pokemon.id)}>Excluir</button> <button onClick={() => handleOpenModal(pokemon)}>Ver Detalhes</button></td>
    </tr>
  );

  const PokemonTableHeader = () => (
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Data de Criação</th>
        <th>Data de Atualização</th>
        <th>Ações</th>
      </tr>
    </thead>
  );


    // Manipulador de evento para abrir o modal e definir o Pokémon selecionado
    const handleOpenModal = (pokemon) => {
      setSelectedPokemon(pokemon);
      setIsModalOpen(true);
    };
  
    // Manipulador de evento para fechar o modal
    const handleCloseModal = () => {
      setSelectedPokemon(null);
      setIsModalOpen(false);
    };

  const handleViewDetails = (pokemon) => {
    // Aqui você pode implementar o redirecionamento para a página de detalhes do Pokémon
    // Ou abrir um modal com os detalhes do Pokémon
  };

  const handleDeletePokemon = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/pokemon/${id}`);
      // Após a exclusão bem-sucedida, atualiza a lista de Pokémon removendo o Pokémon excluído
      setPokemonList(prevList => prevList.filter(pokemon => pokemon.id !== id));
    } catch (error) {
      console.error('Erro ao excluir Pokémon:', error);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    fetchPokemonList(1, newSize); // Chama fetchPokemonList para atualizar totalPages
  };

  const handleFirstPage = () => {
    fetchPokemonList(1, pageSize);
  };

  const handleLastPage = () => {
    fetchPokemonList(totalPages, pageSize);
  };


  // Função para alternar entre a visualização de cards e a visualização de itens em lista
  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'cards' ? 'list' : 'cards'); // Alterna entre 'cards' e 'list'
  };

  return (
    <div className="app-container">
      
      <div className="menu">
        <div className="menu" >
          {/* Botão de menu para dispositivos móveis */}
          {/* Conteúdo do menu */}
          <ul>
            <li>
              <a href="#">
                <i className="fas fa-home">  <AiOutlineHome /></i> {/* Ícone para o link */}
                <span>Home</span> {/* Descrição do link */}
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-info-circle"><AiOutlineBulb /></i> {/* Ícone para o link */}
                <span>Sobre</span> {/* Descrição do link */}
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-paw"><AiOutlineBook /></i> {/* Ícone para o link */}
                <span>Pokemons</span> {/* Descrição do link */}
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-envelope"> <AiOutlineMail /></i> {/* Ícone para o link */}
                <span>Contato</span> {/* Descrição do link */}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="main">
        <header className="header">
          <h1>Poke API</h1>
        </header>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} pokemon={selectedPokemon} />
        <div className="view-mode-selector">
          {/* Select para alternar entre os modos de visualização */}
          <label htmlFor="view-mode-select">Modo de Visualização:</label>
          <select id="view-mode-select" value={viewMode} onChange={e => setViewMode(e.target.value)}>
            <option value="cards">Cards</option>
            <option value="list">Lista</option>
          </select>
        </div>
        <div className="pagination-container-right">
          <div className="pagesize-selector-right">
            <label htmlFor="pagesize-select">Selecione o número de itens por página: </label>
            <select id="pagesize-select" value={pageSize} onChange={(e) => handlePageSizeChange(e)}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              {/* Adicione mais opções conforme necessário */}
            </select>
          </div>
        </div>
        <div className="pagination-container-right">
          {/* Seletor de tamanho de página */}
        </div>
        <div className={viewMode === 'cards' ? 'card-container' : 'list-container'}>
          {/* Renderização condicional baseada no modo de visualização */}
          {viewMode === 'cards' ? (
            pokemonList.map(pokemon => <PokemonCard pokemon={pokemon} />)
          ) : (
            <div className="table-container">
              <table>
                <PokemonTableHeader />
                {pokemonList.map(pokemon => <PokemonTableRow key={pokemon.id} pokemon={pokemon} />)}
              </table>
            </div>
          )}
        </div>
        <div className="pagination-container">
          {/* Botões de paginação */}
          <div className="pagination-container">
            <div className="pagination-buttons">
              <button onClick={handleFirstPage} disabled={currentPage === 1}>Primeira</button>
              <button onClick={() => fetchPokemonList(currentPage - 1, pageSize)} disabled={currentPage === 1}>Anterior</button>
              <button onClick={() => fetchPokemonList(currentPage + 1, pageSize)} disabled={currentPage === totalPages}>Próxima</button>
              <button onClick={handleLastPage} disabled={currentPage === totalPages}>Última</button>
            </div>
            <div className="pagesize-selector">
              <label htmlFor="pagesize-select">Selecione o número de itens por página: </label>
              <select id="pagesize-select" value={pageSize} onChange={(e) => handlePageSizeChange(e)}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                {/* Adicione mais opções conforme necessário */}
              </select>
            </div>
          </div>
        </div>
        <footer className="footer">
          powered by Gui
        </footer>
      </div>
    </div>
  );
}

export default App;
