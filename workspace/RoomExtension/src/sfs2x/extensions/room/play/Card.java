package sfs2x.extensions.room.play;

import java.util.List;

public class Card {

	private String category;
	private int categoryId;
	private int cardId;
	private int playerId;
	private String topic;
	private String name;
	private String charNumber;
	private String image;
	private String wikiLink;
	private List<String[]> properties;

	@Override
	  public String toString() {
	    return getCategory();
	  }
	
	
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public int getCategoryId() {
		return categoryId;
	}
	public void setCategoryId(int categoryId) {
		this.categoryId = categoryId;
	}
	public String getTopic() {
		return topic;
	}
	public void setTopic(String topic) {
		this.topic = topic;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public List<String[]> getProperties() {
		return properties;
	}
	public void setProperties(List<String[]> properties) {
		this.properties = properties;
	}


	public int getCardId() {
		return cardId;
	}


	public void setCardId(int cardId) {
		this.cardId = cardId;
	}


	public int getPlayerId() {
		return playerId;
	}


	public void setPlayerId(int playerId) {
		this.playerId = playerId;
	}


	public String getCharNumber() {
		return charNumber;
	}


	public void setCharNumber(String charNumber) {
		this.charNumber = charNumber;
	}


	public String getWikiLink() {
		return wikiLink;
	}


	public void setWikiLink(String wikiLink) {
		this.wikiLink = wikiLink;
	}


}
