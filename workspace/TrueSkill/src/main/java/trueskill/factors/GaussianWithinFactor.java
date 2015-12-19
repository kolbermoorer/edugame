package main.java.trueskill.factors;

import static main.java.numerics.GaussianDistribution.cumulativeTo;
import static main.java.numerics.GaussianDistribution.divide;
import static main.java.numerics.GaussianDistribution.fromPrecisionMean;
import static main.java.numerics.GaussianDistribution.logProductNormalization;
import static main.java.numerics.GaussianDistribution.mult;
import static main.java.numerics.GaussianDistribution.sub;
import static main.java.trueskill.TruncatedGaussianCorrectionFunctions.VWithinMargin;
import static main.java.trueskill.TruncatedGaussianCorrectionFunctions.WWithinMargin;

import main.java.factorgraphs.Message;
import main.java.factorgraphs.Variable;
import main.java.numerics.GaussianDistribution;

/**
 * Factor representing a team difference that has not exceeded the draw margin.
 * <remarks>See the accompanying math paper for more details.</remarks>
 */
public class GaussianWithinFactor extends GaussianFactor
{
    private final double _Epsilon;

    public GaussianWithinFactor(double epsilon, Variable<GaussianDistribution> variable)
    {
        super(String.format("%s <= %4.3f", variable, epsilon));
        _Epsilon = epsilon;
        CreateVariableToMessageBinding(variable);
    }

    @Override
    public double getLogNormalization()
    {
        GaussianDistribution marginal = variables.get(0).getValue();
        GaussianDistribution message = messages.get(0).getValue();
        GaussianDistribution messageFromVariable = divide(marginal, message);
        double mean = messageFromVariable.getMean();
        double std = messageFromVariable.getStandardDeviation();
        double z = cumulativeTo((_Epsilon - mean)/std)
                   -
                   cumulativeTo((-_Epsilon - mean)/std);

        return -logProductNormalization(messageFromVariable, message) + Math.log(z);
    }

    @Override
    protected double updateMessage(Message<GaussianDistribution> message,
                                            Variable<GaussianDistribution> variable)
    {
        GaussianDistribution oldMarginal = new GaussianDistribution(variable.getValue());
        GaussianDistribution oldMessage = new GaussianDistribution(message.getValue());
        GaussianDistribution messageFromVariable = divide(oldMarginal,oldMessage);

        double c = messageFromVariable.getPrecision();
        double d = messageFromVariable.getPrecisionMean();

        double sqrtC = Math.sqrt(c);
        double dOnSqrtC = d/sqrtC;
        
        double epsilonTimesSqrtC = _Epsilon*sqrtC;
        d = messageFromVariable.getPrecisionMean();

        double denominator = 1.0 - WWithinMargin(dOnSqrtC, epsilonTimesSqrtC);
        double newPrecision = c/denominator;
        double newPrecisionMean = (d +
                                   sqrtC*
                                   VWithinMargin(dOnSqrtC, epsilonTimesSqrtC))/
                                  denominator;

        GaussianDistribution newMarginal = fromPrecisionMean(newPrecisionMean, newPrecision);
        GaussianDistribution newMessage = divide(mult(oldMessage,newMarginal),oldMarginal);

        // Update the message and marginal
        message.setValue(newMessage);
        variable.setValue(newMarginal);

        // Return the difference in the new marginal
        return sub(newMarginal, oldMarginal);
    }
}