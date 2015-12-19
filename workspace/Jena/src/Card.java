import java.util.List;

public class Card {

	private String category;
	private String topic;
	private String name;
	private String image;
	private int id;
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
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}

	public List<String[]> getProperties() {
		return properties;
	}

	public void setProperties(List<String[]> properties) {
		this.properties = properties;
	}


}
