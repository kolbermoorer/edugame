package main.java.trueskill.layers;

import main.java.GameInfo;
import main.java.factorgraphs.DefaultVariable;
import main.java.factorgraphs.Variable;
import main.java.numerics.GaussianDistribution;
import main.java.trueskill.DrawMargin;
import main.java.trueskill.TrueSkillFactorGraph;
import main.java.trueskill.factors.GaussianFactor;
import main.java.trueskill.factors.GaussianGreaterThanFactor;
import main.java.trueskill.factors.GaussianWithinFactor;

public class TeamDifferencesComparisonLayer extends
    TrueSkillFactorGraphLayer<Variable<GaussianDistribution>, GaussianFactor, DefaultVariable<GaussianDistribution>>
{
    private final double _Epsilon;
    private final int[] _TeamRanks;

    public TeamDifferencesComparisonLayer(TrueSkillFactorGraph parentGraph, int[] teamRanks)
    {
        super(parentGraph);
        _TeamRanks = teamRanks;
        GameInfo gameInfo = ParentFactorGraph.getGameInfo();
        _Epsilon = DrawMargin.GetDrawMarginFromDrawProbability(gameInfo.getDrawProbability(), gameInfo.getBeta());
    }

    @Override
    public void BuildLayer()
    {
        for (int i = 0; i < getInputVariablesGroups().size(); i++)
        {
            boolean isDraw = (_TeamRanks[i] == _TeamRanks[i + 1]);
            Variable<GaussianDistribution> teamDifference = getInputVariablesGroups().get(i).get(0);

            GaussianFactor factor =
                isDraw
                    ? (GaussianFactor) new GaussianWithinFactor(_Epsilon, teamDifference)
                    : new GaussianGreaterThanFactor(_Epsilon, teamDifference);

            AddLayerFactor(factor);
        }
    }
}