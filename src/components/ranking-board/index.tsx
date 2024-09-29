// src/components/RankingBoard.tsx
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';

interface RankingBoardProps {
  playerPoints: number;
}

const RankingBoard = ({ playerPoints }: RankingBoardProps) => {
  const [ranking, setRanking] = useState([
    { name: 'Ash', points: 120 },
    { name: 'Misty', points: 100 },
    { name: 'Brock', points: 80 },
    { name: 'Player', points: playerPoints }, // Player atualizado com pontuação
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRanking((prevRanking) => {
        const newRanking = prevRanking.map((entry) =>
          entry.name === 'Player' ? { ...entry, points: playerPoints } : entry
        );
        return newRanking.sort((a, b) => b.points - a.points);
      });
    }, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(interval);
  }, [playerPoints]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Ranking</h2>
      <ul className={styles.list}>
        {ranking.map((entry, index) => (
          <li key={index} className={entry.name === 'Player' ? styles.highlight : styles.listItem}>
            {index + 1}. {entry.name}: {entry.points} pts
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RankingBoard;
