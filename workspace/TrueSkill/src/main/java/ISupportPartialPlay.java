package main.java;

/**
 * Indicates support for allowing partial play (where a player only plays a part
 * of the time).
 */
public interface ISupportPartialPlay {
    /**
     * Indicates the percent of the time the player should be weighted where 0.0
     * indicates the player didn't play and 1.0 indicates the player played 100%
     * of the time.
     */
    public double getPartialPlayPercentage();
}
