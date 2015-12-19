package main.java;

import java.util.Collection;
import java.util.Map;

import main.java.trueskill.TwoPlayerTrueSkillCalculator;

public class CalculateRating {
	private TwoPlayerTrueSkillCalculator calculator;
	
	public static void main(String[] args) {
		CalculateRating calc = new CalculateRating();			
	}
	
	CalculateRating() {
		calculator = new TwoPlayerTrueSkillCalculator();
		calculateRating();
	}
	
	
	
	public void calculateRating() {
        Player<Integer> player1 = new Player<Integer>(1);
        Player<Integer> player2 = new Player<Integer>(2);
        GameInfo gameInfo = GameInfo.getDefaultGameInfo();
        
        Team team1 = new Team(player1, gameInfo.getDefaultRating());
        Team team2 = new Team(player2, gameInfo.getDefaultRating());
        Collection<ITeam> teams = Team.concat(team1, team2);
        System.out.println(team1);
        Map<IPlayer, Rating> newRatings = calculator.calculateNewRatings(gameInfo, teams, 1, 2); // teams, 1, 2 -----> team1 1st place, team2 2nd place
                
        Rating player1NewRating = newRatings.get(player1);
        Rating player2NewRating = newRatings.get(player2);
        System.out.println(team1);
        System.out.println(player1NewRating);
    }

}
