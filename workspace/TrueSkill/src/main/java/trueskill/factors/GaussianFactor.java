package main.java.trueskill.factors;

import static main.java.numerics.GaussianDistribution.logProductNormalization;

import main.java.factorgraphs.Factor;
import main.java.factorgraphs.Message;
import main.java.factorgraphs.Variable;
import main.java.numerics.GaussianDistribution;

public abstract class GaussianFactor extends Factor<GaussianDistribution> {

    GaussianFactor(String name) { super(name); }

    /** Sends the factor-graph message with and returns the log-normalization constant **/
    @Override
    protected double SendMessage(Message<GaussianDistribution> message,
            Variable<GaussianDistribution> variable) {
        GaussianDistribution marginal = variable.getValue();
        GaussianDistribution messageValue = message.getValue();
        double logZ = logProductNormalization(marginal, messageValue);
        variable.setValue(marginal.mult(messageValue));
        return logZ;
    }

    @Override
    public Message<GaussianDistribution> CreateVariableToMessageBinding(
            Variable<GaussianDistribution> variable) {
        return CreateVariableToMessageBinding(variable,
                new Message<GaussianDistribution>(GaussianDistribution
                        .fromPrecisionMean(0, 0), "message from %s to %s",
                        this, variable));
    }
}