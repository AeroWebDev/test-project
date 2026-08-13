import Link from "next/link";
import { Game as SupabaseGame } from "../lib/supabase";
import { Game as LocalGame } from "../data/gamesData";
import { FaFire, FaKey, FaThumbsUp } from "react-icons/fa";

interface GameCardProps {
  game: SupabaseGame | LocalGame | any;
}

export default function GameCard({ game }: GameCardProps) {
  const imageUrl = game.image_url || game.imageUrl;
  const activePlayers = game.active_players || game.activePlayers;
  const isTrending = game.is_trending ?? game.isTrending;
  const codesList = game.codes || [];
  const activeCodes = codesList.filter((c: any) => c.status === "active").length;

  return (
    <div className="game-card">
      <div className="game-card-img-wrap">
        <img src={imageUrl} alt={`${game.title} Roblox Game`} loading="lazy" />
        {isTrending && (
          <span className="badge badge-trending">
            <FaFire /> Trending
          </span>
        )}
        <span className="badge badge-category">{game.category}</span>
      </div>

      <div className="game-card-body">
        <h3 className="game-card-title">{game.title}</h3>
        <p className="game-card-dev">by {game.developer}</p>

        <div className="game-card-meta">
          <span title="Active Working Codes">
            <FaKey className="meta-icon key-icon" /> <strong>{activeCodes}</strong> Active Codes
          </span>
          <span title="Rating">
            <FaThumbsUp className="meta-icon thumbs-icon" /> {game.likes}
          </span>
        </div>

        <Link href={`/games/${game.slug}`} className="game-card-btn" title={`View ${game.title} Codes`}>
          View Codes ({activeCodes})
        </Link>
      </div>
    </div>
  );
}
