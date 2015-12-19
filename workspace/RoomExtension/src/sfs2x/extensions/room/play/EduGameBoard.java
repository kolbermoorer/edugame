package sfs2x.extensions.room.play;

import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.hp.hpl.jena.query.QuerySolution;
import com.hp.hpl.jena.query.ResultSet;
import com.smartfoxserver.v2.entities.User;

public class EduGameBoard {
	private ArrayList<User> usersInGame;
	private User player1; //TODO: remove and change to list of users
	private User player2;
	private Sparql sparql;
	private ArrayList<String[]> settings;
	private ArrayList<String[]> resourceList;
	private Card[] cardArray;
	private final int NUMBER_OF_CATEGORIES = 3;
	private final int NUMBER_OF_CARDS_PER_CATEGORY = 8;
	
	public EduGameBoard(int numberOfCards, ArrayList<String[]> settings, User player1, User player2) {
		usersInGame = new ArrayList<User>();
		usersInGame.add(player1);
		usersInGame.add(player2);
		setPlayer1(player1);
		setPlayer2(player2);
		setCardArray(new Card[numberOfCards]); 										// initiate # cards
		setSettings(settings); 														//set settings for category, topic and level
		setSparql(new Sparql()); 													// initiate new Sparql class
	}
	
	public void generateTestDataset(int player1Id, int player2Id) {
		Card card;
		List<String[]> properties = null;

		//Airlines
		card = cardArray[0] = new Card();
		card.setCategory("Airline");
		card.setTopic("Sky Team");
		card.setCardId(1);
		card.setPlayerId(player1Id);
		card.setName("China Eastern Airlines");
		card.setCharNumber("A1");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/ChinaEasternHQShanghaiAirHQ.jpg/220px-ChinaEasternHQShanghaiAirHQ.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/China_Eastern_Airlines");
		properties = new ArrayList<String[]>();
		properties.add(new String[]{"destinations","212"});
		properties.add(new String[]{"fleetSize","377"});
		properties.add(new String[]{"founded","1988-06-25"});
		properties.add(new String[]{"iata","MU"});
		properties.add(new String[]{"numEmployees","66207"});
		card.setProperties(properties);
		
		card = cardArray[1] = new Card();
		card.setCategory("Airline");
		card.setTopic("Sky Team");
		card.setCardId(6);
		card.setPlayerId(player2Id);
		card.setName("China Southern Airlines");
		card.setCharNumber("A2");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/China_Southern_Airlines_A380_Kustov-1.jpg/220px-China_Southern_Airlines_A380_Kustov-1.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/China_Southern_Airlines");
		properties = new ArrayList<String[]>();
		properties.add(new String[]{"destinations","193"});
		properties.add(new String[]{"fleetSize","488"});
		properties.add(new String[]{"founded","1988"});
		properties.add(new String[]{"iata","CZ"});
		properties.add(new String[]{"numEmployees","73668"});
		card.setProperties(properties);
		
		card = cardArray[2] = new Card();
		card.setCategory("Airline");
		card.setTopic("Sky Team");
		card.setCardId(2);
		card.setPlayerId(player2Id);
		card.setName("Aeroméxico");
		card.setCharNumber("A3");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/AeroM%C3%A9xicoHQMexicoCityDF.jpg/187px-AeroM%C3%A9xicoHQMexicoCityDF.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/Aeroméxico");
		properties = new ArrayList<String[]>();
		properties.add(new String[]{"destinations","56"});
		properties.add(new String[]{"fleetSize","68"});
		properties.add(new String[]{"founded","1988-10-01"});
		properties.add(new String[]{"iata","AM"});
		properties.add(new String[]{"numEmployees","13745"});
		card.setProperties(properties);
		
		card = cardArray[3] = new Card();
		card.setCategory("Airline");
		card.setTopic("Sky Team");
		card.setCardId(4);
		card.setPlayerId(player1Id);
		card.setName("Middle East Airlines");
		card.setCharNumber("A4");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Convair_990A_OD-AFI_MEA_2_LHR_20.06.70.jpg/220px-Convair_990A_OD-AFI_MEA_2_LHR_20.06.70.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/Middle_East_Airlines");
		properties = new ArrayList<String[]>();
		properties.add(new String[]{"destinations","33"});
		properties.add(new String[]{"fleetSize","17"});
		properties.add(new String[]{"iata","ME"});
		card.setProperties(properties);
		
		card = cardArray[4] = new Card();
		card.setCategory("Airline");
		card.setTopic("Sky Team");
		card.setCardId(7);
		card.setPlayerId(player1Id);
		card.setName("Vietnam Airlines");
		card.setCharNumber("B1");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Vietnam_Airlines_Tu-134_VN-A120_BKK_1992-4-14.png/220px-Vietnam_Airlines_Tu-134_VN-A120_BKK_1992-4-14.png");
		card.setWikiLink("http://en.wikipedia.org/wiki/Vietnam_Airlines");
		properties = new ArrayList<String[]>();
		properties.add(new String[]{"destinations","52"});
		properties.add(new String[]{"fleetSize","89"});
		properties.add(new String[]{"founded","1956"});
		properties.add(new String[]{"iata","VN"});
		properties.add(new String[]{"numEmployees","10929"});
		card.setProperties(properties);
		
		card = cardArray[5] = new Card();
		card.setCategory("Airline");
		card.setTopic("Sky Team");
		card.setCardId(3);
		card.setPlayerId(player1Id);
		card.setName("Alitalia");
		card.setCharNumber("B2");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Rom_Fiumicino_15_%28raboe%29.jpg/220px-Rom_Fiumicino_15_%28raboe%29.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/Alitalia");
		properties = new ArrayList<String[]>();
		properties.add(new String[]{"destinations","103"});
		properties.add(new String[]{"fleetSize","118"});
		properties.add(new String[]{"founded","1946"});
		properties.add(new String[]{"iata","AZ"});
		properties.add(new String[]{"numEmployees","14036"});
		card.setProperties(properties);
		
		card = cardArray[6] = new Card();
		card.setCategory("Airline");
		card.setTopic("Sky Team");
		card.setCardId(5);
		card.setPlayerId(player2Id);
		card.setName("China Airlines");
		card.setCharNumber("B3");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Boeing_727-109C_B-1822_China_Als_SIN_14.09.74_edited-2.jpg/220px-Boeing_727-109C_B-1822_China_Als_SIN_14.09.74_edited-2.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/China_Airlines");
		properties = new ArrayList<String[]>();
		properties.add(new String[]{"destinations","95"});
		properties.add(new String[]{"fleetSize","82"});
		properties.add(new String[]{"founded","1959-12-16"});
		properties.add(new String[]{"iata","CI"});
		card.setProperties(properties);
		
		card = cardArray[7] = new Card();
		card.setCategory("Airline");
		card.setTopic("Sky Team");
		card.setCardId(0);
		card.setPlayerId(player2Id);
		card.setName("Air Europa");
		card.setCharNumber("B4");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Air_Europa_Boeing_737-85P_JBM.jpg/220px-Air_Europa_Boeing_737-85P_JBM.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/Air_Europa");
		properties = new ArrayList<String[]>();
		properties.add(new String[]{"destinations","44"});
		properties.add(new String[]{"fleetSize","47"});
		properties.add(new String[]{"founded","1986"});
		properties.add(new String[]{"iata","UX"});
		properties.add(new String[]{"numEmployees","2949"});
		
		//Politician
		card = cardArray[8] = new Card();
		card.setCategory("Politician");
		card.setTopic("Democratic Party Presidents of the United States");
		card.setCardId(13);
		card.setPlayerId(player2Id);
		card.setName("Lyndon B. Johnson");
		card.setCharNumber("C1");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Lyndon_B._Johnson%2C_photo_portrait%2C_leaning_on_chair%2C_color_cropped.jpg/138px-Lyndon_B._Johnson%2C_photo_portrait%2C_leaning_on_chair%2C_color_cropped.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/Lyndon_B._Johnson");
		
		card = cardArray[9] = new Card();
		card.setCategory("Politician");
		card.setTopic("Democratic Party Presidents of the United States");
		card.setCardId(12);
		card.setPlayerId(player1Id);
		card.setName("Woodrow Wilson");
		card.setCharNumber("C2");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Thomas_Woodrow_Wilson%2C_Harris_%26_Ewing_bw_photo_portrait%2C_1919.jpg/145px-Thomas_Woodrow_Wilson%2C_Harris_%26_Ewing_bw_photo_portrait%2C_1919.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/Woodrow_Wilson");
		
		card = cardArray[10] = new Card();
		card.setCategory("Politician");
		card.setTopic("Democratic Party Presidents of the United States");
		card.setCardId(8);
		card.setPlayerId(player2Id);
		card.setName("Barack Obama");
		card.setCharNumber("C3");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/176px-President_Barack_Obama.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/Barack_Obama");
		
		card = cardArray[11] = new Card();
		card.setCategory("Politician");
		card.setTopic("Democratic Party Presidents of the United States");
		card.setCardId(15);
		card.setPlayerId(player1Id);
		card.setName("Harry S. Truman");
		card.setCharNumber("C4");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Harry_S_Truman_-_NARA_-_530677_%282%29.jpg/183px-Harry_S_Truman_-_NARA_-_530677_%282%29.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/Harry_S._Truman");
		
		card = cardArray[12] = new Card();
		card.setCategory("Politician");
		card.setTopic("Democratic Party Presidents of the United States");
		card.setCardId(14);
		card.setPlayerId(player1Id);
		card.setName("Franklin D. Roosevelt");
		card.setCharNumber("D1");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/FDR_in_1933.jpg/187px-FDR_in_1933.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/Franklin_D._Roosevelt");
		
		card = cardArray[13] = new Card();
		card.setCategory("Politician");
		card.setTopic("Democratic Party Presidents of the United States");
		card.setCardId(11);
		card.setPlayerId(player2Id);
		card.setName("James Buchanan");
		card.setCharNumber("D2");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Hon._James_Buchanan_-_NARA_-_528318-crop.jpg/176px-Hon._James_Buchanan_-_NARA_-_528318-crop.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/James_Buchanan");
		
		card = cardArray[14] = new Card();
		card.setCategory("Politician");
		card.setTopic("Democratic Party Presidents of the United States");
		card.setCardId(10);
		card.setPlayerId(player2Id);
		card.setName("Martin Van Buren");
		card.setCharNumber("D3");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Martin_Van_Buren_by_Mathew_Brady_c1855-58.jpg/176px-Martin_Van_Buren_by_Mathew_Brady_c1855-58.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/Martin_Van_Buren");
		
		card = cardArray[15] = new Card();
		card.setCategory("Politician");
		card.setTopic("Democratic Party Presidents of the United States");
		card.setCardId(9);
		card.setPlayerId(player1Id);
		card.setName("Franklin Pierce");
		card.setCharNumber("D4");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Mathew_Brady_-_Franklin_Pierce_-_alternate_crop.jpg/177px-Mathew_Brady_-_Franklin_Pierce_-_alternate_crop.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/Franklin_Pierce");
		
		//Actor
		card = cardArray[16] = new Card();
		card.setCategory("Actor");
		card.setTopic("Living people");
		card.setCardId(22);
		card.setPlayerId(player2Id);
		card.setName("Madonna (entertainer)");
		card.setCharNumber("E1");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Rebel_Heart_WTG_%283%29.jpg/154px-Rebel_Heart_WTG_%283%29.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/Madonna_(entertainer)");
		
		card = cardArray[17] = new Card();
		card.setCategory("Actor");
		card.setTopic("Living people");
		card.setCardId(20);
		card.setPlayerId(player1Id);
		card.setName("Celine Dion");
		card.setCharNumber("E2");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/C%C3%A9line_Dion_2012.jpg/155px-C%C3%A9line_Dion_2012.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/Celine_Dion");
		
		card = cardArray[18] = new Card();
		card.setCategory("Actor");
		card.setTopic("Living people");
		card.setCardId(23);
		card.setPlayerId(player2Id);
		card.setName("Cliff Richard");
		card.setCharNumber("E3");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Cliff_Richard_Brussels.jpg/165px-Cliff_Richard_Brussels.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/Cliff_Richard");
		
		card = cardArray[19] = new Card();
		card.setCategory("Actor");
		card.setTopic("Living people");
		card.setCardId(16);
		card.setPlayerId(player2Id);
		card.setName("Christina Aguilera");
		card.setCharNumber("E4");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Christina_Aguilera_2012_%28Headshot%29.jpg/150px-Christina_Aguilera_2012_%28Headshot%29.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/Christina_Aguilera");
		
		card = cardArray[20] = new Card();
		card.setCategory("Actor");
		card.setTopic("Living people");
		card.setCardId(18);
		card.setPlayerId(player1Id);
		card.setName("Sting (musician)");
		card.setCharNumber("F1");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Sting_ThePolice_2007.jpg/147px-Sting_ThePolice_2007.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/Sting_(musician)");
		
		card = cardArray[21] = new Card();
		card.setCategory("Actor");
		card.setTopic("Living people");
		card.setCardId(17);
		card.setPlayerId(player1Id);
		card.setName("John Lennon");
		card.setCharNumber("F2");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/JohnLennonpeace.jpg/206px-JohnLennonpeace.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/John_Lennon");
		
		card = cardArray[22] = new Card();
		card.setCategory("Actor");
		card.setTopic("Living people");
		card.setCardId(19);
		card.setPlayerId(player2Id);
		card.setName("Will Young");
		card.setCharNumber("F3");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Will_Young_2011.jpg/146px-Will_Young_2011.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/Will_Young");
		
		card = cardArray[23] = new Card();
		card.setCategory("Actor");
		card.setTopic("Living people");
		card.setCardId(21);
		card.setPlayerId(player1Id);
		card.setName("Britney Spears");
		card.setCharNumber("F4");
		card.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Britney_Spears_2013_%28Straighten_Crop%29.jpg/138px-Britney_Spears_2013_%28Straighten_Crop%29.jpg");
		card.setWikiLink("http://en.wikipedia.org/wiki/Britney_Spears");
	}
	
	//get the resources attached to the topics, choose 8 for each topic
	public void generateResourceList() {
		String lastName = null;														
		sparql.setQueryString(getSettings(), "getResources");
		sparql.executeQuery();
		ResultSet rs =sparql.getResults();
		ArrayList<String[]> resources = new ArrayList<String[]>();
		ArrayList<String[]> temp = null;
		int index = -1;
		while (rs.hasNext()) {
			QuerySolution qs = rs.next();
			String category = qs.get("category").toString(); //category of card
			String uri = qs.get("uri").toString(); //resource uri of card
			String name = qs.get("name").toString(); //name of card
			if (!category.equals(lastName)) { //is there a new category because of the union?
				if (index > -1) {
					setSubset(temp, resources, NUMBER_OF_CARDS_PER_CATEGORY); //if yes get defined number of cards per category
				}
				lastName = category;
				index++;
				temp = new ArrayList<String[]>(); //temporary holder to manage all resources
			}
			temp.add(new String[]{category,uri, name});
		}
		setSubset(temp, resources, NUMBER_OF_CARDS_PER_CATEGORY); //because the last element does not have a successor we need to set the subset once more for last category
		setResourceList(resources);
		sparql.getQexec().close();
	}
	
	public void setSubset(ArrayList<String[]> temp, ArrayList<String[]> resources, int nCards) {
		ArrayList<Integer> list = new ArrayList<Integer>();
        for (int i=1; i<temp.size(); i++) { //add same number of indexes as there exists resources for topic
            list.add(new Integer(i));
        }
        Collections.shuffle(list); //shuffle the resources so that n random resources are at start of list
        for (int i=0; i<nCards; i++) { //get first n random resources
            int index = list.get(i);
            resources.add(temp.get(index));
        }
	}
	
	public void generateCardList() {
		sparql.setQueryString(getResourceList(), "getDetails");
		sparql.executeQuery();
		ResultSet rs =sparql.getResults();
		generateCards(rs);
		sparql.getQexec().close();
	}

	public void generateCards(ResultSet rs) {
		String lastName = null;
		Card card = null;
		List<String[]> properties = null;
		ArrayList<Integer> userIdList = getBalancedRandomUserList();
		int index = -1;
		while (rs.hasNext()) {
			QuerySolution qs = rs.next();
			String category = qs.get("category").toString(); //category of card
			//String topic = qs.get("topic").toString(); //topic of card
			String name = qs.get("name").toString(); //name of card
			if (!name.equals(lastName)) {
				if(index > -1)
					card.setProperties(properties);
				properties = new ArrayList<String[]>();
				lastName = name;
				index++;
				card = cardArray[index] = new Card();
				card.setCategory(category);
				card.setCardId(index);
				card.setPlayerId(userIdList.get(index));
				//card.setTopic(topic);
				card.setName(name);
			}
			String property = qs.get("property_uri").toString();
			String value = qs.get("value").toString();
			if(property.toLowerCase().contains("thumbnail")) {
				card.setImage(value); //TODO: set thumbnail via json request, e.g. https://en.wikipedia.org/w/api.php?action=query&titles=Aerom%C3%A9xico&prop=pageimages&format=json&pithumbsize=120
			}
			else if(property.toLowerCase().contains("isPrimaryTopicOf")) {
				card.setWikiLink(value);
			}
			else 
				properties.add(new String[]{property,value});
		}
		card.setProperties(properties);
	}
	
	public ArrayList<Integer> getBalancedRandomUserList() {
		int p1Id = getPlayer1().getId();
		int p2Id = getPlayer2().getId();
		ArrayList<Integer> listAll = new ArrayList<Integer>();
		for (int i=0; i<NUMBER_OF_CATEGORIES; i++) {
			ArrayList<Integer> list = new ArrayList<Integer>();
			for (int j=0; j<NUMBER_OF_CARDS_PER_CATEGORY/2; j++) {
	    		list.add(new Integer(p1Id));
	    	}
	    	for (int j=0; j<NUMBER_OF_CARDS_PER_CATEGORY/2; j++) {
	    		list.add(new Integer(p2Id));
	    	}
	    	Collections.shuffle(list);
	    	listAll.addAll(list);
		}
		return listAll;
	}
	
	@SuppressWarnings("unchecked")
	public String getAllCards() throws IOException {
		JSONArray list = new JSONArray();
		
		Card[] initiatedCards = getCardArray();
		for (Card card : initiatedCards) {
			String category = card.getCategory();
			String topic = card.getTopic();
			String name = card.getName();
			int id = card.getCardId();
			int playerId = card.getPlayerId();
			String image = card.getImage();
			String wikiLink = card.getWikiLink();
			
			if(!categoryExists(list,category)) {
				JSONObject obj=new JSONObject();
				obj.put("category", category);
				obj.put("topic", topic);
				obj.put("cards", new JSONArray());
				list.add(obj);
			}
			int pos = getCategoryPosition(list,category);
			JSONObject data = (JSONObject) list.get(pos);
			JSONArray cards = (JSONArray) data.get("cards");
			JSONObject cardDetails = new JSONObject();
			cardDetails.put("name", name);
			cardDetails.put("image", image);
			cardDetails.put("uri", wikiLink);
			cardDetails.put("id", id);
			cardDetails.put("playerId", playerId);
			cards.add(cardDetails);
		}
		StringWriter out = new StringWriter();
		list.writeJSONString(out);
		String jsonText = out.toString();
		  
		return jsonText;
	}
	
	private boolean categoryExists(JSONArray jsonArray, String categoryToFind){
	    return jsonArray.toString().contains("\"category\":\""+ categoryToFind +"\"");
	}
	
	private int getCategoryPosition(JSONArray jsonArray, String categoryToFind){
		int pos=0;
		for (Object wrapper : jsonArray) {
			if(wrapper.toString().contains("\"category\":\""+ categoryToFind +"\"")) {
				return pos;
			}
			else
				pos++;
		}
		return 0;
	}
	
	//search for the wiki link so that the users are able to inform themselves prior to the game
//	private String[] getExtraData(Card card) {
//		String uri = null;
//		String image = null;
//		List<String[]> properties = card.getProperties();
//		for (String[] property : properties) {
//			if(property[0].contains("isPrimaryTopicOf")) {
//				uri = property[1];
//			}
//			if(property[0].contains("thumbnail")) {
//				image = property[1];
//			}
//		}
//		return new String[]{image,uri};
//	}
	
	
	/*
	 * Getter and setter
	 */

	public Card[] getCardArray() {
		return cardArray;
	}
	public void setCardArray(Card[] cardArray) {
		this.cardArray = cardArray;
	}
	public Sparql getSparql() {
		return sparql;
	}
	public void setSparql(Sparql sparql) {
		this.sparql = sparql;
	}

	public ArrayList<String[]> getSettings() {
		return settings;
	}

	public void setSettings(ArrayList<String[]> settings) {
		this.settings = settings;
	}
	public ArrayList<String[]> getResourceList() {
		return resourceList;
	}
	public void setResourceList(ArrayList<String[]> resourceList) {
		this.resourceList = resourceList;
	}
	public User getPlayer1() {
		return player1;
	}
	public void setPlayer1(User player1) {
		this.player1 = player1;
	}
	public User getPlayer2() {
		return player2;
	}
	public void setPlayer2(User player2) {
		this.player2 = player2;
	}

	public ArrayList<User> getUsersInGame() {
		return usersInGame;
	}

	public void setUsersInGame(ArrayList<User> usersInGame) {
		this.usersInGame = usersInGame;
	}
}
