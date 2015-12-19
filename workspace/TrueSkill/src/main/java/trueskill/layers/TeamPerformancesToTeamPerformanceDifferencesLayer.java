package main.java.trueskill.layers;

import java.util.ArrayList;
import java.util.List;

import main.java.factorgraphs.Variable;
import main.java.numerics.GaussianDistribution;
import main.java.trueskill.TrueSkillFactorGraph;
import main.java.trueskill.factors.GaussianWeightedSumFactor;

public class TeamPerformancesToTeamPerformanceDifferencesLayer extends
    TrueSkillFactorGraphLayer<Variable<GaussianDistribution>, 
                              GaussianWeightedSumFactor, 
                              Variable<GaussianDistribution>>
{
    public TeamPerformancesToTeamPerformanceDifferencesLayer(TrueSkillFactorGraph parentGraph)
    {
        super(parentGraph);
    }

    @Override
    public void BuildLayer()
    {
        for (int i = 0; i < getInputVariablesGroups().size() - 1; i++)
        {
            Variable<GaussianDistribution> strongerTeam = getInputVariablesGroups().get(i).get(0);
            Variable<GaussianDistribution> weakerTeam = getInputVariablesGroups().get(i + 1).get(0);

            Variable<GaussianDistribution> currentDifference = createOutputVariable();
            AddLayerFactor(CreateTeamPerformanceToDifferenceFactor(strongerTeam, weakerTeam, currentDifference));

            // REVIEW: Does it make sense to have groups of one?
            addOutputVariable(currentDifference);
        }
    }

    private GaussianWeightedSumFactor CreateTeamPerformanceToDifferenceFactor(
        final Variable<GaussianDistribution> strongerTeam, final Variable<GaussianDistribution> weakerTeam,
        Variable<GaussianDistribution> output)
    {
        List<Variable<GaussianDistribution>> teams = new ArrayList<Variable<GaussianDistribution>>(){
            private static final long serialVersionUID = -50768988200855179L; {
        add(strongerTeam);
        add(weakerTeam);
        }};
        return new GaussianWeightedSumFactor(output, teams, new double[] {1.0, -1.0});
    }

    private Variable<GaussianDistribution> createOutputVariable()
    {
        return new Variable<GaussianDistribution>(GaussianDistribution.UNIFORM, "Team performance difference");
    }
}