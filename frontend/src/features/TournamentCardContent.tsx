import { CardContent, CardContentProps } from "@mui/material";
import "./TournamentCardContent.css";

interface Props extends CardContentProps {
  tournament: Pick<Tournament, "tname" | "fromdate" | "todate" | "venue" | "shortinfo" | "city" | "region" | "country" | "organization">;
}

/**
 * This displays a tournament, presenting only details likely to be helpful for finding a tournament.
 */
export const TournamentCardContent = (props: Props) => {
  const { className, tournament, ...cardContentProps } = props;
  return (
    <CardContent className={`tournamentCardContent${className ? ` ${className}` : ""}`} {...cardContentProps}>
      {(tournament.tname || tournament.fromdate || tournament.todate) && (
        <h3>
          <span>{tournament.tname}</span>
          <span className="dates">{`${tournament.fromdate.format("YYYY-MM-DD")} - ${tournament.todate.format("YYYY-MM-DD")}`}</span>
        </h3>
      )}
      {tournament.venue && (
        <p>
          <span className="descriptionTitle">Venue</span><br />
          <span>{tournament.venue}</span>
        </p>
      )}
      {tournament.shortinfo && (
        <p>
          <span className="descriptionTitle">Info</span>
          <span>{tournament.shortinfo}</span>
        </p>
      )}
      {(tournament.country || tournament.region || tournament.city) && (
        <p>
          <span className="descriptionTitle">Location</span>
          <span>
            {tournament.city}
            {tournament.city && tournament.region && ", "}
            {tournament.region}
          </span>
          <span>{tournament.country}</span>
        </p>
      )}
      {tournament.organization && (  
        <p>
          <span className="descriptionTitle">Organization</span>
          <span>{tournament.organization}</span>
        </p>
      )}
    </CardContent>
  );
};
