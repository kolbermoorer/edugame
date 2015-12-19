package main.java.trueskill.layers;

import main.java.factorgraphs.Factor;
import main.java.factorgraphs.FactorGraphLayer;
import main.java.factorgraphs.Variable;
import main.java.numerics.GaussianDistribution;
import main.java.trueskill.TrueSkillFactorGraph;

public abstract class TrueSkillFactorGraphLayer<TInputVariable extends Variable<GaussianDistribution>, 
                                                TFactor extends Factor<GaussianDistribution>,
                                                TOutputVariable extends Variable<GaussianDistribution>>
    extends FactorGraphLayer
            <TrueSkillFactorGraph, GaussianDistribution, Variable<GaussianDistribution>, TInputVariable,
            TFactor, TOutputVariable> 
{
    public TrueSkillFactorGraphLayer(TrueSkillFactorGraph parentGraph)
    {
        super(parentGraph);
    }
}