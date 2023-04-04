import { useState } from 'react';
import { GlidingBlink } from 'react-loading-indicators';
import { genusList, speciesList, strainList } from './arrays.js';

function App() {

    // selectors
    const [selectedGenus, setSelectedGenus] = useState("");
    const [selectedSpecies, setSelectedSpecies] = useState("");
    const [selectedStrain, setSelectedStrain] = useState("");
    // text input
    const [nameOrIdentifier, setNameOrIdentifier] = useState("");
    const [description, setDescription] = useState("");
    const [geneFamilyIdentifier, setGeneFamilyIdentifier] = useState("");
    // dependent selector lists
    const [speciesOptions, setSpeciesOptions] = useState([]);
    const [strainOptions, setStrainOptions] = useState([]);
    // GraphQL response
    const [response, setResponse] = useState({});
    // genes array from response
    const [genes, setGenes] = useState(null)
    // loading flag
    const [loading, setLoading] = useState(false);

    // query GraphQL and set appropriate state variables
    async function queryGraphQL(data = {}) {
        setLoading(true);
        fetch(process.env.REACT_APP_GRAPHQL_URI, {
            method: "POST",
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                setLoading(false);
                return(response.json());
            })
            .then((responseJson) => {
                setResponse(responseJson);
                setGenes(responseJson.data.genes);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // handle form submission and query GraphQL
    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);

        // Or you can work with it as a plain object:
        const formJson = Object.fromEntries(formData.entries());

        setSelectedGenus(formJson.genus);
        setSelectedSpecies(formJson.species);
        setSelectedStrain(formJson.strain);

        if (formJson.genus) {
            setSpeciesOptions(speciesList[formJson.genus]);
        }

        const query = "query Query($nameOrIdentifier: String, $description: String, $genus: String, $species: String, $strain: String, $geneFamilyIdentifier: String) { " +
              "genes(genus: $genus, species: $species, strain: $strain, nameOrIdentifier: $nameOrIdentifier, description: $description, geneFamilyIdentifier: $geneFamilyIdentifier) { " +
              "name " +
              "identifier " +
              "description " +
              "organism { genus species } " +
              "strain { identifier } " +
              "geneFamilyAssignments { geneFamily { identifier } } " +
              "locations { chromosome { identifier } start end strand } " +
              "}}";
        
        queryGraphQL( {
            "query": query,
            "variables": {
                "genus": formJson.genus,
                "species": formJson.species,
                "strain": formJson.strain,
                "nameOrIdentifier": formJson.nameOrIdentifier,
                "description": formJson.description,
                "geneFamilyIdentifier": formJson.geneFamilyIdentifier,
            },
            "operationName": "Query"
        });
    }

    function handleGenusSelection(e) {
        setSelectedGenus(e.target.value);
        setSpeciesOptions(speciesList[e.target.value]);
        setSelectedSpecies("");
        setSelectedStrain("");
    }

    function handleSpeciesSelection(e) {
        setSelectedSpecies(e.target.value);
        setStrainOptions(strainList[e.target.value]);
        setSelectedStrain("");
    }

    function handleStrainSelection(e) {
        setSelectedStrain(e.target.value);
    }

    return (
        <div className="uk-padding">

          <h2 className="uk-heading-small">
            React Gene Search Demo (UIkit)
          </h2>

          <form className="uk-flex" method="post" onSubmit={handleSubmit}>
              <div className="uk-padding-small">
                <label className="uk-label">Genus</label><br/>
                <select className="uk-select uk-form-small" name="genus" value={selectedGenus}
                        onChange={e => handleGenusSelection(e)}>
                  <option key={-1} value="">-- any --</option>
                  {genusList.map((genus, index) => (
                      <option key={index} value={genus}>{genus}</option>
                  ))}
                </select>
              </div>
              <div className="uk-padding-small">
                <label className="uk-label">species</label><br/>
                <select className="uk-select uk-form-small" name="species" value={selectedSpecies}
                        onChange={e => handleSpeciesSelection(e)}>
                  <option key={-1} value="">-- any --</option>
                  {selectedGenus && (
                      speciesOptions.map((species, index) => (
                          <option key={index} value={species}>{species}</option>
                      ))
                  )}
                </select>
              </div>
              <div className="uk-padding-small">
                <label className="uk-label">accession</label><br/>
                <select className="uk-select uk-form-small" name="strain" value={selectedStrain}
                        onChange={e => handleStrainSelection(e)}>
                  <option key={-1} value="">-- any --</option>
                  {strainOptions && (
                      strainOptions.map((strain, index) => (
                          <option key={index} value={strain}>{strain}</option>
                      ))
                  )}
                </select>
              </div>
              <div className="uk-padding-small">
                <label className="uk-label">name / identifier</label><br/>
                <input className="uk-input uk-form-small uk-form-width-medium" name="nameOrIdentifier"/>
              </div>
              <div className="uk-padding-small">
                <label className="uk-label">description</label><br/>
                <input className="uk-input uk-form-small" name="description"/>
              </div>
              <div className="uk-padding-small">
                <label className="uk-label">gene family ID</label><br/>
                <input className="uk-input uk-form-small uk-form-width-small" name="geneFamilyIdentifier"/>
              </div>
              <div className="uk-padding-small">
                <br/>
                <button className="uk-button uk-button-default uk-form-small" type="submit">SEARCH</button>
              </div>
          </form>

          {loading && (
              <GlidingBlink/>
          )}

          {!loading && genes && (
              <div className="uk-padding">
                {genes.length ? (
                    genes.map((gene, index) => (
                        <div>
                          <div>
                            <b>{ gene.identifier }</b> ({ gene.name }) <span className="uk-text-italic">{ gene.organism.genus } { gene.organism.species }</span> { gene.strain.identifier }
                          </div>
                          <div className="uk-text-italic">
                            { gene.description }
                          </div>
                          {gene.locations[0] && gene.locations[0].chromosome && (
                              <div>
                                <b>location:</b> { gene.locations[0].chromosome.identifier }:{gene.locations[0].start}-{gene.locations[0].end} ({gene.locations[0].strand})
                              </div>
                          )}
                          {gene.geneFamilyAssignments[0] && (
                              <div>
                                <b>gene family:</b> { gene.geneFamilyAssignments[0].geneFamily.identifier }
                              </div>
                          )}
                          <hr className="uk-divider-icon"/>
                        </div>
                    ))
                ) : (
                    <div>
                      No results found.
                    </div>
                )}
              </div>
          )}

        {!loading && !genes && (
            <code>
              Note: this is for design-purposes only. Linkouts are not implemented.
            </code>
        )}

        </div>
    );
}

export default App;

      // {
      //   "name": "cicar.ICC4958.Ca_00193",
      //   "identifier": "cicar.ICC4958.gnm2.ann1.Ca_00193",
      //   "organism": {
      //     "genus": "Cicer",
      //     "species": "arietinum"
      //   },
      //   "geneFamilyAssignments": [
      //     null
      //   ],
      //   "locations": [
      //     {
      //       "chromosome": {
      //         "identifier": "cicar.ICC4958.gnm2.Ca1"
      //       },
      //       "start": 2183507,
      //       "end": 2184859,
      //       "strand": "-1"
      //     }
      //   ]
      // }
