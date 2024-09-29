// src/pages/pokemon.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import RankingBoard from '../../components/ranking-board';
import styles from './styles.module.scss';

interface Pokemon {
  name: string;
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
  types: { type: { name: string } }[];
  sprites: { front_default: string };
}

const getRandomId = () => Math.floor(Math.random() * 151) + 1; // Pokémon de 1 a 151

export default function Home() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [guess, setGuess] = useState('');
  const [hint, setHint] = useState(0);
  const [result, setResult] = useState('');
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [revealedLetters, setRevealedLetters] = useState<string[]>([]);

  useEffect(() => {
    fetchPokemon();
  }, []);

  const fetchPokemon = async () => {
    const id = getRandomId();
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    setPokemon(response.data);
    setRevealedLetters(new Array(response.data.name.length).fill('_')); // Inicializa a "forca"
    setHint(0); // Resetando o número de dicas para novo Pokémon
    setResult(''); // Reseta a mensagem de resultado
    setGuess(''); // Reseta o campo de input
  };

  const handleGuess = () => {
    if (pokemon && guess.toLowerCase() === pokemon.name.toLowerCase()) {
      const earnedPoints = 10 - hint; // Quanto menos dicas, mais pontos
      setPoints(points + earnedPoints);
      setStreak(streak + 1);
      setResult('Parabéns! Você acertou.');
      setTimeout(() => fetchPokemon(), 2000); // Espera 2 segundos antes de buscar um novo Pokémon
    } else {
      setResult('Errou! Tente novamente.');
      setStreak(0); // Reseta o contador de acertos seguidos
      setPoints(0); // Zera os pontos ao errar
    }
    setGuess('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleGuess(); // Aciona a função de adivinhar
    }
  };

  const getHint = () => {
    if (!pokemon) return '';
    if (hint === 0) return `Altura: ${pokemon.height}`;
    if (hint === 1) return `Peso: ${pokemon.weight}`;
    if (hint === 2) return `Tipo: ${pokemon.types.map((type) => type.type.name).join(', ')}`;
    if (hint === 3) return `Habilidade: ${pokemon.abilities.map((ab) => ab.ability.name).join(', ')}`;
    return '';
  };

  const revealLetter = () => {
    if (!pokemon) return;
    const unrevealedIndices = revealedLetters
      .map((letter, index) => (letter === '_' ? index : -1))
      .filter((index) => index !== -1);

    if (unrevealedIndices.length > 0) {
      const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
      const newRevealed = [...revealedLetters];
      newRevealed[randomIndex] = pokemon.name[randomIndex];
      setRevealedLetters(newRevealed);
    }
  };

  const skipPokemon = () => {
    fetchPokemon(); // Carrega um novo Pokémon
  };

  return (
    <div className={styles.container}>
      <div className={styles.gameContainer}>
        <h1 className={styles.title}>Adivinhe o Pokémon!</h1>

        {pokemon && (
          <>
            <img src={pokemon.sprites.front_default} alt="Pokémon" className={styles.pokemonImage} />
            <p className={styles.hint}>
              {revealedLetters.join(' ')} {/* Exibe a "forca" */}
            </p>
          </>
        )}

        <p className={styles.hint}>{getHint()}</p>

        <input
          className={styles.input}
          type="text"
          placeholder="Digite o nome do Pokémon"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={handleKeyDown} // Adiciona o manipulador de evento
        />
        <div>
          <button className={styles.button} onClick={handleGuess}>Adivinhar</button>
          <button className={styles.button} onClick={() => { setHint(hint + 1); revealLetter(); }}>Pedir Dica</button>
          <button className={styles.button} onClick={skipPokemon}>Pular</button> {/* Botão de Pular */}
        </div>

        <div className={styles.score}>
          <p>Acertos Seguidos: {streak}</p>
          <p>Pontos: {points}</p>
        </div>

        {result && (
          <p className={`${styles.result} ${result.includes('Parabéns') ? styles.success : styles.error}`}>
            {result}
          </p>
        )}
      </div>

      <div className={styles.rankingContainer}>
        <RankingBoard playerPoints={points} />
      </div>
    </div>
  );
}
