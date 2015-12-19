import java.util.ArrayList;
import java.util.List;

import com.hp.hpl.jena.query.QuerySolution;
import com.hp.hpl.jena.query.ResultSet;

public class Cards {
	private Card[] cardArray;

	public Cards(int numberOfCards) {
		setCardArray(new Card[numberOfCards]);
	}

	public void initiate(ResultSet rs) {
		String lastName = null;
		Card card = null;
		List<String[]> properties = null;
		int index = -1;
		while (rs.hasNext()) {
			QuerySolution qs = rs.next();
			String category = qs.get("category").toString(); //name of card
			String topic = qs.get("topic").toString(); //name of card
			String name = qs.get("name").toString(); //name of card
			if (!name.equals(lastName)) {
				if(index > -1)
					card.setProperties(properties);
				properties = new ArrayList<String[]>();
				lastName = name;
				index++;
				card = cardArray[index] = new Card();
				card.setCategory(category);
				card.setTopic(topic);
				card.setName(name);
			}
			String property = qs.get("property_uri").toString();
			String value = qs.get("value").toString();
			if(property.toLowerCase().contains("thumbnail")) {
				card.setImage(value);
			}
			properties.add(new String[]{property,value});
		}
		card.setProperties(properties);
	}

	public Card[] getCardArray() {
		return cardArray;
	}

	public void setCardArray(Card[] cardArray) {
		this.cardArray = cardArray;
	}

}
