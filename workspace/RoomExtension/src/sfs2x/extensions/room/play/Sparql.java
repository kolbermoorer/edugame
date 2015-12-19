package sfs2x.extensions.room.play;

import java.util.ArrayList;

import com.hp.hpl.jena.query.Query;
import com.hp.hpl.jena.query.QueryExecution;
import com.hp.hpl.jena.query.QueryExecutionFactory;
import com.hp.hpl.jena.query.QueryFactory;
import com.hp.hpl.jena.query.ResultSet;

public class Sparql {
	private String queryString;
	private String endpoint;
	private Query query;
	private QueryExecution qexec;
	private ResultSet results;
 
	public ResultSet executeQuery()
    {
		setEndpoint("http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org"); 
		String tt = getQueryString();
		setQuery(QueryFactory.create(tt));
		setQexec(QueryExecutionFactory.sparqlService(getEndpoint(), getQuery()));
		try {
			setResults(getQexec().execSelect());
			return getResults();
		} catch (Exception e) {
			getQexec().close();
			return null;
		}
	    
    }

	public String getQueryString() {
		return queryString;
	}
	public void setQueryString(ArrayList<String[]> data, String goal) {
		String queryString = null;
		if (goal.equals("getResources")) {
			int index = 0;
			queryString =
					"PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>"+
					"PREFIX dbo:<http://dbpedia.org/ontology/>"+
					"PREFIX vrank:<http://purl.org/voc/vrank#>"+
					"PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>"+
					"PREFIX foaf:<http://xmlns.com/foaf/0.1/>"+
					"PREFIX dct:<http://purl.org/dc/terms/>";
			for (String[] setting : data) {
				String category = setting[0];
				String topic = setting[1];
				//String level = setting[2];
				
				if(index == 0) {
					queryString += "SELECT * FROM <http://people.aifb.kit.edu/ath/#DBpedia_PageRank> WHERE {";
				} 
				else {
					queryString += "UNION";
				}
				queryString +=
					"{ " +
					"SELECT DISTINCT ('" + category +"' AS ?category) ?uri ?name " +
					"WHERE {  " +
					"     ?uri dct:subject <" + topic + ">. " +
					"     ?uri rdfs:label ?name  " +
					"     filter langMatches( lang(?name), 'EN' ) " +
					"     ?uri foaf:isPrimaryTopicOf ?website . " +
					"     ?uri rdf:type ?type.  " +
					"     filter (strstarts( str(?type), 'http://dbpedia.org/class/yago/" + category + "1' ) || strstarts( str(?type), 'http://dbpedia.org/ontology/" + category + "' ))  " +
					"     ?uri vrank:hasRank/vrank:rankValue ?v.  " +
					"     FILTER(?v > 5) " +
					"}" +
					"}";
				index++;
			}
			queryString += "}";
		}
		else if (goal.equals("getDetails")) {
			int index = 0;
			for (String[] setting : data) {
				String category = setting[0];
				String uri = setting[1];
				String name = setting[2];
				if(index == 0) {
					queryString = "SELECT * WHERE {";
				} 
				else {
					queryString += "UNION";
				}
				queryString +=
				"{ " +
				"    SELECT ('" + category + "' AS ?category) ('" + name + "' AS ?name) ?property_uri ?value " +
				"    { " +
				"         <" + uri +"> ?property_uri ?value . " +
				"         FILTER(STRSTARTS(str(?property_uri), 'http://dbpedia.org/property/') || STRSTARTS(str(?property_uri), 'http://dbpedia.org/ontology/thumbnail') " +
				" || STRSTARTS(str(?property_uri), 'http://xmlns.com/foaf/0.1/isPrimaryTopicOf')) " +
				"    } " +
				"}";
				index++;
			}
			queryString += "}";			
		}
		this.queryString = queryString;
	}

	
	public String getEndpoint() {
		return endpoint;
	}
	public void setEndpoint(String endpoint) {
		this.endpoint = endpoint;
	}
	public Query getQuery() {
		return query;
	}
	public void setQuery(Query query) {
		this.query = query;
	}
	public QueryExecution getQexec() {
		return qexec;
	}
	public void setQexec(QueryExecution qexec) {
		this.qexec = qexec;
	}
	public ResultSet getResults() {
		return results;
	}
	public void setResults(ResultSet results) {
		this.results = results;
	}

}
